"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Bridges the mouse gap between a trigger and its (portaled) panel before closing. */
const CLOSE_DELAY = 150;

export function useCloseTimer(close: () => void) {
  const timer = useRef<number | null>(null);

  const cancel = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };
  const schedule = () => {
    cancel();
    timer.current = window.setTimeout(close, CLOSE_DELAY);
  };

  useEffect(() => cancel, []);

  return { cancel, schedule };
}

/**
 * The nav header clips overflow (it scrolls horizontally on cramped desktop
 * widths), so a plain `absolute` panel gets cut off. Portal it to <body> and
 * position it from the trigger's live bounding rect instead.
 */
export function FloatingPanel({
  anchorRect,
  placement,
  onMouseEnter,
  onMouseLeave,
  children,
}: {
  anchorRect: DOMRect;
  placement: "below" | "right";
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: ReactNode;
}) {
  if (typeof document === "undefined") return null;

  // Submenus nest arbitrarily deep, so by the third or fourth level a panel
  // opening rightwards can run past the viewport. Flip it to the left of its
  // trigger when there isn't room, and keep it clear of the bottom edge.
  const PANEL_WIDTH = 264;
  const room = window.innerWidth - anchorRect.right - 6;
  const flipped = placement === "right" && room < PANEL_WIDTH && anchorRect.left > PANEL_WIDTH;

  const style: React.CSSProperties =
    placement === "below"
      ? { position: "fixed", top: anchorRect.bottom + 8, left: anchorRect.left, zIndex: 70 }
      : {
          position: "fixed",
          top: Math.max(8, Math.min(anchorRect.top, window.innerHeight - 200)),
          left: flipped ? anchorRect.left - PANEL_WIDTH - 6 : anchorRect.right + 6,
          zIndex: 70,
        };

  return createPortal(
    <div
      data-nav-flyout
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="overflow-hidden rounded-2xl border border-line bg-white shadow-lg"
    >
      {children}
    </div>,
    document.body,
  );
}
