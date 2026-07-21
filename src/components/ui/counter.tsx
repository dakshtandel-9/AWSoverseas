"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  motion,
} from "framer-motion";

/**
 * Animated stat. Splits a label like "100+", "24/7", "99%" into a numeric
 * lead that counts up plus the trailing non-numeric suffix kept intact.
 */
export function Counter({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const hasNumber = !!match;

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 80, damping: 18 });
  const rounded = useTransform(spring, (v) =>
    Number.isInteger(target) ? Math.round(v).toString() : v.toFixed(0),
  );

  useEffect(() => {
    if (inView) mv.set(target);
  }, [inView, mv, target]);

  if (!hasNumber) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} data-no-translate className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
