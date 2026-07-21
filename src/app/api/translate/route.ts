import { NextRequest, NextResponse } from "next/server";

const GOOGLE_ENDPOINT = "https://translate.googleapis.com/translate_a/single";
const MAX_BATCH = 100;
// Google's endpoint returns one result segment per newline in the input, so
// batching many strings into one request (joined by \n) avoids one round
// trip per string — critical since a page can have 200+ text nodes.
const UPSTREAM_CHUNK_SIZE = 40;

async function translateChunk(texts: string[], target: string): Promise<string[]> {
  const nonEmpty = texts.map((t, i) => ({ i, t })).filter(({ t }) => t.trim());
  if (nonEmpty.length === 0) return texts;

  const q = nonEmpty.map(({ t }) => t).join("\n");
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

  const results = [...texts];
  // Segments come back newline-terminated and 1:1 with input lines as long
  // as none of the source strings themselves contain a newline.
  nonEmpty.forEach(({ i }, j) => {
    const segment = segments[j];
    results[i] = segment !== undefined ? segment.replace(/\n$/, "") : texts[i];
  });
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
