"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export type ImageSlide = {
  image: string;
  imageAlt: string;
  /** Optional background video — when set, autoplays/loops muted in place of the still image. */
  video?: string;
  badge: string;
  title: string;
  subtitle: string;
  primaryButton: string;
  primaryButtonHref: string;
  secondaryButton: string;
  secondaryButtonHref: string;
};

const AUTOPLAY_MS = 8000;
const ease = [0.16, 1, 0.3, 1] as const;

/**
 * A second hero slider for the home page, kept separate from `HeroSlider`
 * (which crossfades the dot-field `Hero`/`ExportHero`). Reuses that same left
 * column layout — badge, two-line headline, subtitle, two buttons, animated
 * stat row — but the right side is a real full-bleed photo instead of a
 * floating UI card, and the whole slide (not just the right half) sits on
 * top of that photo with a dark gradient scrim for legibility.
 */
export function ImageHeroSlider({ slides }: { slides: ImageSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const slideCount = slides.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pauseAutoplay = useCallback(() => {
    setPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setPaused(false), AUTOPLAY_MS);
  }, []);

  const goTo = useCallback(
    (i: number, e?: React.MouseEvent<HTMLButtonElement>) => {
      e?.currentTarget.blur();
      pauseAutoplay();
      setIndex((i + slideCount) % slideCount);
    },
    [pauseAutoplay, slideCount],
  );

  useEffect(() => {
    if (paused || reduceMotion || slideCount < 2) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slideCount);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reduceMotion, slideCount]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  }

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

  const slide = slides[index];
  if (!slide) return null;

  // Split title into two lines at first space after halfway point, matching Hero.
  const words = slide.title.split(" ");
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  return (
    <section
      className="relative min-h-[100svh] h-auto lg:h-[100svh] w-full overflow-hidden bg-[#000c1a]"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      tabIndex={-1}
    >
      {/* Background photo — crossfades between slides, sits behind everything */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease }}
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${slideCount}`}
        >
          {slide.video ? (
            <video
              key={slide.video}
              className="absolute inset-0 size-full object-cover"
              src={slide.video}
              poster={slide.image}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden
            />
          ) : (
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          )}
          {/* Scrim: solid enough on the left for text, fading out on the right so the photo reads clearly */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #000c1a 0%, rgba(0,12,26,0.94) 22%, rgba(0,12,26,0.72) 42%, rgba(0,12,26,0.32) 62%, rgba(0,12,26,0.08) 80%, rgba(0,12,26,0) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(0deg, rgba(0,12,26,0.65) 0%, transparent 30%)" }}
          />
        </motion.div>
      </AnimatePresence>

      <Container className="relative flex min-h-[100svh] flex-col justify-center pb-10 pt-28 sm:pb-16 sm:pt-32 lg:h-[100svh] lg:justify-start lg:pt-40 xl:pt-44">
        <AnimatePresence mode="wait">
          <div key={index} className="w-full max-w-[600px]">
            {/* Eyebrow */}
            <motion.div
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#9e4953]/30 bg-[#9e4953]/8 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-maroon-admin sm:gap-2 sm:px-4 sm:text-xs sm:tracking-widest"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-[#9e4953]" />
              {slide.badge}
            </motion.div>

            {/* Display headline — two-line with accent second line, matches Hero */}
            <motion.h1
              className="mt-7 font-heading font-extrabold leading-[1.0] tracking-[-0.03em]"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease }}
            >
              <span className="block text-5xl text-white sm:text-6xl lg:text-[4rem] xl:text-[4.5rem]">
                {line1}
              </span>
              <span className="text-maroon-gradient block text-5xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem]">
                {line2}
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-[480px] text-base leading-relaxed text-white/60 sm:text-lg"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease }}
            >
              {slide.subtitle}
            </motion.p>

            {/* CTA row — maroon filled + glass outline, matches Hero */}
            <motion.div
              className="mt-9 flex max-w-full flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26, ease }}
            >
              <Button
                href={slide.primaryButtonHref}
                size="lg"
                variant="secondary"
                className="h-auto min-h-14 max-w-full whitespace-normal text-center"
              >
                {slide.primaryButton} <ArrowRight className="size-4 shrink-0" />
              </Button>
              <a
                href={slide.secondaryButtonHref}
                className="group inline-flex h-auto min-h-14 max-w-full items-center gap-2 rounded-full px-8 py-3 text-base font-medium transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 0 0 0 rgba(144, 45, 57,0)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 0 1px rgba(144, 45, 57,0.4), 0 4px 20px rgba(144, 45, 57,0.15)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 rgba(144, 45, 57,0)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <Smartphone className="size-4" />
                {slide.secondaryButton}
              </a>
            </motion.div>
          </div>
        </AnimatePresence>
      </Container>

      {/* Arrow controls */}
      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => goTo(index - 1, e)}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/[0.08] text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/[0.18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e4953] sm:left-6 md:grid"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={(e) => goTo(index + 1, e)}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/[0.08] text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/[0.18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e4953] sm:right-6 md:grid"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Dot indicators */}
          <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center gap-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => goTo(i, e)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className="rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e4953]"
                style={{
                  width: i === index ? 28 : 9,
                  height: 9,
                  background: i === index ? "#9e4953" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
