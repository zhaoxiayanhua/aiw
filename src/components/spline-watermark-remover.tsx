"use client";

import { useEffect } from "react";

export default function SplineWatermarkRemover() {
  useEffect(() => {
    const removeWatermark = () => {
      document.querySelectorAll("spline-viewer").forEach((viewer: Element) => {
        const shadow = (viewer as HTMLElement).shadowRoot;
        if (shadow) {
          const logo = shadow.querySelector("#logo");
          if (logo) logo.remove();
          shadow.querySelectorAll("a").forEach((a: HTMLAnchorElement) => {
            if (a.href?.includes("spline")) a.remove();
          });
        }
      });
    };

    // Run multiple times to catch late-loading Spline viewers
    const timers = [500, 1500, 3000, 5000].map((ms) =>
      setTimeout(removeWatermark, ms)
    );

    const observer = new MutationObserver(removeWatermark);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      timers.forEach(clearTimeout);
      observer.disconnect();
    };
  }, []);

  return null;
}
