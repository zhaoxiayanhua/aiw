"use client";

import Lenis from 'lenis';
import { useEffect } from 'react';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.add("lenis");
    body.classList.add("lenis");

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      root.classList.remove("lenis");
      root.classList.remove("lenis-smooth");
      root.classList.remove("lenis-scrolling");
      root.classList.remove("lenis-stopped");
      body.classList.remove("lenis");
      body.classList.remove("lenis-smooth");
      body.classList.remove("lenis-scrolling");
      body.classList.remove("lenis-stopped");
    };
  }, []);

  return <>{children}</>;
}
