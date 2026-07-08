"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const minDisplay = 800; // keep visible at least this long (ms)

    function dismiss() {
      const elapsed = Date.now() - start;
      const delay = Math.max(0, minDisplay - elapsed);
      setTimeout(() => {
        setFading(true);
        setTimeout(() => setVisible(false), 500);
      }, delay);
    }

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
      return () => window.removeEventListener("load", dismiss);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`page-loader${fading ? " page-loader--out" : ""}`}
    >
      <div className="page-loader__inner">
        <Image
          src="/brand/logo-mark-light.png"
          alt=""
          width={112}
          height={62}
          priority
          className="page-loader__logo"
        />
        <div className="page-loader__track">
          <div className="page-loader__bar" />
        </div>
      </div>
    </div>
  );
}
