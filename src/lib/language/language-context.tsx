"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { isRtlLanguage } from "@/lib/language/languages";

export type LanguageCode = string;

const DEFAULT_LANGUAGE = "en";
const STORAGE_KEY = "aws-overseas-lang";
const CACHE_KEY_PREFIX = "aws-overseas-translations-";
const BATCH_SIZE = 60;
const DEBOUNCE_MS = 150;
const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEXTAREA",
  "CODE",
  "PRE",
]);
const TRANSLATABLE_ATTRS = ["placeholder", "aria-label", "title"] as const;

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isTranslating: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function loadCache(lang: LanguageCode): Map<string, string> {
  if (typeof window === "undefined") return new Map();
  try {
    const raw = window.localStorage.getItem(CACHE_KEY_PREFIX + lang);
    if (!raw) return new Map();
    return new Map(Object.entries(JSON.parse(raw)));
  } catch {
    return new Map();
  }
}

function saveCache(lang: LanguageCode, cache: Map<string, string>) {
  try {
    window.localStorage.setItem(
      CACHE_KEY_PREFIX + lang,
      JSON.stringify(Object.fromEntries(cache)),
    );
  } catch {
    // storage full or unavailable — non-fatal, cache just won't persist
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [isTranslating, setIsTranslating] = useState(false);

  const languageRef = useRef<LanguageCode>(DEFAULT_LANGUAGE);
  // One translation cache per target language, loaded lazily on first use.
  const cachesRef = useRef<Map<LanguageCode, Map<string, string>>>(new Map());
  // Maps a Text node to the string we last wrote into it, so we can tell
  // "React reset this node back to English" apart from "we just wrote it".
  const lastAppliedRef = useRef<WeakMap<Text, string>>(new WeakMap());
  // Maps a Text node to its original English source, so switching back to
  // English can restore it without waiting on a React re-render that may
  // never come (most nodes are static once mounted).
  const originalTextRef = useRef<WeakMap<Text, string>>(new WeakMap());
  const originalAttrRef = useRef<
    WeakMap<Element, Partial<Record<(typeof TRANSLATABLE_ATTRS)[number], string>>>
  >(new WeakMap());
  const observerRef = useRef<MutationObserver | null>(null);
  const inFlightRef = useRef<Set<Text>>(new Set());
  const inFlightAttrRef = useRef<Set<Element>>(new Set());
  const scheduleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRootsRef = useRef<Set<Node>>(new Set());

  const getCache = useCallback((lang: LanguageCode) => {
    let cache = cachesRef.current.get(lang);
    if (!cache) {
      cache = loadCache(lang);
      cachesRef.current.set(lang, cache);
    }
    return cache;
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setLanguageState(stored);
  }, []);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const collectTextNodes = useCallback((root: Node): Text[] => {
    const nodes: Text[] = [];
    const consider = (node: Node) => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const text = node.nodeValue;
      if (!text || !text.trim()) return;
      const parent = (node as Text).parentElement;
      if (!parent) return;
      if (SKIP_TAGS.has(parent.tagName)) return;
      if (parent.closest("[data-no-translate]")) return;
      nodes.push(node as Text);
    };

    if (root.nodeType === Node.TEXT_NODE) {
      consider(root);
      return nodes;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const text = node.nodeValue;
        if (!text || !text.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let current = walker.nextNode();
    while (current) {
      nodes.push(current as Text);
      current = walker.nextNode();
    }
    return nodes;
  }, []);

  const collectAttrElements = useCallback((root: Node): Element[] => {
    const selector = TRANSLATABLE_ATTRS.map((a) => `[${a}]`).join(",");
    if (!(root instanceof Element) && !(root instanceof Document)) return [];
    const els = Array.from(root.querySelectorAll(selector));
    if (root instanceof Element && root.matches(selector)) els.push(root);
    return els.filter((el) => !el.closest("[data-no-translate]"));
  }, []);

  const translateBatch = useCallback(
    async (texts: string[], targetLang: LanguageCode): Promise<string[]> => {
      const cache = getCache(targetLang);
      const results: string[] = new Array(texts.length);
      const toFetch: { index: number; text: string }[] = [];

      texts.forEach((text, i) => {
        const cached = cache.get(text);
        if (cached !== undefined) {
          results[i] = cached;
        } else {
          toFetch.push({ index: i, text });
        }
      });

      for (let i = 0; i < toFetch.length; i += BATCH_SIZE) {
        const chunk = toFetch.slice(i, i + BATCH_SIZE);
        try {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              texts: chunk.map((c) => c.text),
              target: targetLang,
            }),
          });
          if (!res.ok) throw new Error("translate failed");
          const data = await res.json();
          const translations: string[] = data.translations ?? [];
          chunk.forEach((c, j) => {
            const translated = translations[j] || c.text;
            results[c.index] = translated;
            cache.set(c.text, translated);
          });
        } catch {
          chunk.forEach((c) => {
            results[c.index] = c.text;
          });
        }
      }

      saveCache(targetLang, cache);
      return results;
    },
    [getCache],
  );

  const applyTranslationToDom = useCallback(
    async (root: Node, targetLang: LanguageCode) => {
      if (languageRef.current !== targetLang || targetLang === DEFAULT_LANGUAGE) return;

      const textNodes = collectTextNodes(root).filter((n) => {
        if (inFlightRef.current.has(n)) return false;
        // Skip nodes that already hold the text we last applied — nothing
        // changed since our own last write.
        const applied = lastAppliedRef.current.get(n);
        return applied === undefined || applied !== n.nodeValue;
      });
      const attrEls = collectAttrElements(root).filter(
        (el) => !inFlightAttrRef.current.has(el),
      );

      if (textNodes.length === 0 && attrEls.length === 0) return;

      textNodes.forEach((n) => inFlightRef.current.add(n));
      attrEls.forEach((el) => inFlightAttrRef.current.add(el));

      // The current DOM value is the "original" English source — either the
      // first time we see this node, or after React reset it post-render.
      const originals = textNodes.map((node) => {
        const text = node.nodeValue ?? "";
        originalTextRef.current.set(node, text);
        return text;
      });

      const attrJobs: { el: Element; attr: (typeof TRANSLATABLE_ATTRS)[number]; text: string }[] = [];
      attrEls.forEach((el) => {
        const stored = originalAttrRef.current.get(el) ?? {};
        TRANSLATABLE_ATTRS.forEach((attr) => {
          const current = el.getAttribute(attr);
          if (!current || !current.trim()) return;
          const original = stored[attr] ?? current;
          stored[attr] = original;
          attrJobs.push({ el, attr, text: original });
        });
        originalAttrRef.current.set(el, stored);
      });

      const allTexts = [...originals, ...attrJobs.map((j) => j.text)];
      const translated = await translateBatch(allTexts, targetLang);

      if (languageRef.current === targetLang) {
        textNodes.forEach((node, i) => {
          node.nodeValue = translated[i];
          lastAppliedRef.current.set(node, translated[i]);
        });
        attrJobs.forEach((job, i) => {
          job.el.setAttribute(job.attr, translated[originals.length + i]);
        });
      }

      textNodes.forEach((n) => inFlightRef.current.delete(n));
      attrEls.forEach((el) => inFlightAttrRef.current.delete(el));
    },
    [collectTextNodes, collectAttrElements, translateBatch],
  );

  const revertDom = useCallback(() => {
    const textNodes = collectTextNodes(document.body);
    textNodes.forEach((node) => {
      const original = originalTextRef.current.get(node);
      if (original !== undefined) node.nodeValue = original;
    });
    const attrEls = collectAttrElements(document.body);
    attrEls.forEach((el) => {
      const stored = originalAttrRef.current.get(el);
      if (!stored) return;
      TRANSLATABLE_ATTRS.forEach((attr) => {
        const original = stored[attr];
        if (original !== undefined) el.setAttribute(attr, original);
      });
    });
    lastAppliedRef.current = new WeakMap();
  }, [collectTextNodes, collectAttrElements]);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const rtl = isRtlLanguage(language);
    html.setAttribute("lang", language);
    html.setAttribute("dir", rtl ? "rtl" : "ltr");

    observerRef.current?.disconnect();
    observerRef.current = null;
    if (scheduleRef.current) {
      clearTimeout(scheduleRef.current);
      scheduleRef.current = null;
    }
    dirtyRootsRef.current.clear();

    if (language !== DEFAULT_LANGUAGE) {
      setIsTranslating(true);
      void applyTranslationToDom(document.body, language).finally(() =>
        setIsTranslating(false),
      );

      const flush = () => {
        const roots = Array.from(dirtyRootsRef.current);
        dirtyRootsRef.current.clear();
        roots.forEach((root) => {
          if (root.isConnected) void applyTranslationToDom(root, language);
        });
      };

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => dirtyRootsRef.current.add(node));
          } else if (mutation.type === "characterData") {
            const parent = mutation.target.parentElement;
            if (parent) dirtyRootsRef.current.add(mutation.target);
          }
        }
        if (scheduleRef.current) clearTimeout(scheduleRef.current);
        scheduleRef.current = setTimeout(flush, DEBOUNCE_MS);
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      observerRef.current = observer;
    } else {
      revertDom();
    }

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (scheduleRef.current) {
        clearTimeout(scheduleRef.current);
        scheduleRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
