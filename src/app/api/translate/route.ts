import { NextRequest, NextResponse } from "next/server";

const GOOGLE_ENDPOINT = "https://translate.googleapis.com/translate_a/single";
const MAX_BATCH = 100;
// Google's endpoint returns roughly one result segment per newline in the
// input, so batching many strings into one request (joined by \n) avoids one
// round trip per string — critical since a page can have 200+ text nodes.
const UPSTREAM_CHUNK_SIZE = 40;

// A string containing a sentence boundary (. ! ?) followed by more text on
// the same line gets split into multiple output segments by Google's
// endpoint, desyncing the "one line in, one segment out" assumption the
// newline-batch trick depends on (e.g. "Source. Verify." comes back as two
// segments). Strings like this must be translated individually instead.
const MID_STRING_SENTENCE_BOUNDARY = /[.!?]\s+\S/;

async function translateSingle(text: string, target: string): Promise<string> {
  if (!text.trim()) return text;
  const params = new URLSearchParams({
    client: "gtx",
    sl: "en",
    tl: target,
    dt: "t",
    q: text,
  });
  const res = await fetch(`${GOOGLE_ENDPOINT}?${params.toString()}`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(`Translate upstream ${res.status}`);
  const data = await res.json();
  const segments: string[] = (data?.[0] ?? []).map(
    (segment: unknown[]) => (segment?.[0] as string) ?? "",
  );
  return segments.join("");
}

async function translateChunk(texts: string[], target: string): Promise<string[]> {
  const results = [...texts];

  const risky: { i: number; t: string }[] = [];
  const batchable: { i: number; t: string }[] = [];
  texts.forEach((t, i) => {
    if (!t.trim()) return;
    (MID_STRING_SENTENCE_BOUNDARY.test(t) ? risky : batchable).push({ i, t });
  });

  const jobs: Promise<void>[] = [];

  if (batchable.length > 0) {
    jobs.push(
      (async () => {
        const q = batchable.map(({ t }) => t).join("\n");
        const params = new URLSearchParams({
          client: "gtx",
          sl: "en",
          tl: target,
          dt: "t",
          q,
        });
        const res = await fetch(`${GOOGLE_ENDPOINT}?${params.toString()}`, {
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        if (!res.ok) throw new Error(`Translate upstream ${res.status}`);
        const data = await res.json();
        const segments: string[] = (data?.[0] ?? []).map(
          (segment: unknown[]) => (segment?.[0] as string) ?? "",
        );

        if (segments.length !== batchable.length) {
          // Segmentation still didn't line up 1:1 (e.g. an edge case the
          // regex missed) — fall back to translating this group one at a
          // time rather than risk writing a segment into the wrong slot.
          await Promise.all(
            batchable.map(async ({ i, t }) => {
              results[i] = await translateSingle(t, target).catch(() => t);
            }),
          );
          return;
        }

        batchable.forEach(({ i }, j) => {
          const segment = segments[j];
          results[i] = segment !== undefined ? segment.replace(/\n$/, "") : texts[i];
        });
      })(),
    );
  }

  risky.forEach(({ i, t }) => {
    jobs.push(
      translateSingle(t, target)
        .then((translated) => {
          results[i] = translated;
        })
        .catch(() => {
          results[i] = t;
        }),
    );
  });

  await Promise.all(jobs);
  return results;
}

async function translateBatch(texts: string[], target: string): Promise<string[]> {
  const results: string[] = new Array(texts.length);
  const chunks: { start: number; texts: string[] }[] = [];
  for (let i = 0; i < texts.length; i += UPSTREAM_CHUNK_SIZE) {
    chunks.push({ start: i, texts: texts.slice(i, i + UPSTREAM_CHUNK_SIZE) });
  }

  await Promise.all(
    chunks.map(async ({ start, texts: chunkTexts }) => {
      try {
        const translated = await translateChunk(chunkTexts, target);
        translated.forEach((t, j) => {
          results[start + j] = t;
        });
      } catch {
        chunkTexts.forEach((t, j) => {
          results[start + j] = t;
        });
      }
    }),
  );

  return results;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const texts: unknown = body?.texts;
  const target: unknown = body?.target;

  if (!Array.isArray(texts) || typeof target !== "string") {
    return NextResponse.json(
      { error: "Expected { texts: string[], target: string }" },
      { status: 400 },
    );
  }
  if (texts.length === 0) {
    return NextResponse.json({ translations: [] });
  }
  if (texts.length > MAX_BATCH) {
    return NextResponse.json(
      { error: `Too many texts, max ${MAX_BATCH} per request` },
      { status: 400 },
    );
  }
  if (!texts.every((t) => typeof t === "string")) {
    return NextResponse.json(
      { error: "texts must be an array of strings" },
      { status: 400 },
    );
  }

  try {
    const translations = await translateBatch(texts as string[], target);
    return NextResponse.json({ translations });
  } catch {
    return NextResponse.json(
      { error: "Translation service unavailable" },
      { status: 502 },
    );
  }
}
