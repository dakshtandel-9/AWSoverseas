"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { ExportHero } from "@/components/home/export-hero";

type HeroData = React.ComponentProps<typeof Hero>["data"];
type ExportHeroData = React.ComponentProps<typeof ExportHero>["data"];

const AUTOPLAY_MS = 8000;

export function HeroSlider({ hero, exportHero }: { hero: HeroData; exportHero: ExportHeroData }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const slideCount = 2;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Any manual navigation (click or swipe, mouse or touch) pauses autoplay for a
  // beat before it resumes. Without this, autoplay's own tick can land seconds
  // after a manual change and fire a second transition on top of it — two
  // crossfades overlapping reads as a glitchy flash between the slides.
  const pauseAutoplay = useCallback(() => {
    setPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setPaused(false), AUTOPLAY_MS);
  }, []);

  const goTo = useCallback((i: number, e?: React.MouseEvent<HTMLButtonElement>) => {
    // Blur immediately: a focused control near the viewport edge can make the
    // browser auto-scroll to keep it visible mid-transition, which reads as a
    // jump to the white section below the hero. No focused element, no auto-scroll.
    e?.currentTarget.blur();
    pauseAutoplay();
    setIndex((i + slideCount) % slideCount);
  }, [pauseAutoplay]);

  useEffect(() => {
    if (paused || reduceMotion) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slideCount);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reduceMotion]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") goTo(index - 1);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(index + 1);
  }

  // Basic touch swipe support
  const touchStartX = useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) goTo(index + (delta < 0 ? 1 : -1));
    touchStartX.current = null;
  }

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden bg-[#000c1a]"
      aria-roledescription="carousel"
      aria-label="Featured highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      tabIndex={-1}
    >
      {/* Slides crossfade in place (mode="sync", both layers stacked) so the shared
          dark background is never left uncovered between an exit and the next enter. */}
      <AnimatePresence initial={false}>
        {index === 0 && (
          <motion.div
            key="hero-export"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            aria-roledescription="slide"
            aria-label="1 of 2"
          >
            <ExportHero data={exportHero} active />
          </motion.div>
        )}
        {index === 1 && (
          <motion.div
            key="hero-main"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            aria-roledescription="slide"
            aria-label="2 of 2"
          >
            <Hero data={hero} active />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide navigation — vertical stack on the left edge: up arrow, dots, down arrow.
          Hidden below md: the hero content column exceeds viewport height on small
          screens, so a mid-height stack would sit on top of copy; swipe covers mobile. */}
      <div className="absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 lg:left-8 md:flex">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous slide"
          className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white/70 backdrop-blur-md transition-colors duration-200 hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d72846]"
        >
          <ChevronUp className="size-4" />
        </button>

        <div className="flex flex-col items-center gap-2">
          {Array.from({ length: slideCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className="group relative w-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d72846]"
              style={{ height: i === index ? 24 : 8, background: i === index ? "#d72846" : "rgba(255,255,255,0.25)" }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next slide"
          className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white/70 backdrop-blur-md transition-colors duration-200 hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d72846]"
        >
          <ChevronDown className="size-4" />
        </button>
      </div>

      {/* Mobile — dots only, bottom-center, matches the dark hero surface */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center md:hidden">
        <div className="pointer-events-auto flex items-center gap-2">
          {Array.from({ length: slideCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className="group relative h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d72846]"
              style={{ width: i === index ? 24 : 8, background: i === index ? "#d72846" : "rgba(255,255,255,0.25)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
