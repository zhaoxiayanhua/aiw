"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import HeroBg from "./bg";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          url?: string;
        },
        HTMLElement
      >;
    }
  }
}

export default function HeroSplineCentered({ section }: { section: SectionType }) {
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);

  useEffect(() => {
    const checkSplineLoaded = () => {
      if (customElements.get("spline-viewer")) {
        setIsSplineLoaded(true);
        return true;
      }
      return false;
    };

    if (checkSplineLoaded()) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.10.35/build/spline-viewer.js";
    script.onload = () => {
      setIsSplineLoaded(true);
    };

    const existingScript = document.querySelector(`script[src="${script.src}"]`);
    if (!existingScript) {
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (checkSplineLoaded()) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  if (section.disabled) {
    return null;
  }

  return (
    <section
      id={section.name}
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/95 lg:min-h-[80vh]"
    >
      <div className="absolute inset-0 z-0">
        <HeroBg />
      </div>

      {!isSplineLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Hello...</div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isSplineLoaded ? 1 : 0, scale: isSplineLoaded ? 1 : 0.9 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute inset-0 z-10 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-background/30" />

        <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] max-w-4xl -translate-x-[175%] -translate-y-1/2">
          <spline-viewer
            url="https://prod.spline.design/JdZgoBYW5zhBLimi/scene.splinecode"
            className="w-[335%] 2xl:h-full"
          />
        </div>
      </motion.div>

      <div className="relative z-30 px-4 pt-12 text-center md:pt-16 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto w-full max-w-none space-y-8"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
              className="mx-auto flex w-[88vw] max-w-[60rem] min-w-0 justify-center md:w-[82vw] lg:w-[58vw] xl:w-[60vw] 2xl:w-[64vw]"
            >
              <Image
                src="/imgs/icons/title.svg"
                alt="为留学申请打造的 AI 工作空间"
                width={1120}
                height={340}
                priority
                className="h-auto w-full"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mx-auto max-w-none whitespace-nowrap text-base text-muted-foreground md:text-lg lg:text-xl"
            >
              从文书初稿、简历优化到人工润色，帮你更清晰地表达经历、优势与申请目标。
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center pt-6"
          >
            <Link href="/creation-center">
              <Button size="lg" className="rounded-xl px-6 py-7 text-lg font-semibold">
                <span className="grid min-w-[12.5rem] grid-cols-[1.5rem_auto_1.5rem] items-center gap-0">
                  <Sparkles className="size-7 translate-x-[1px] justify-self-start" />
                  <span className="text-center">立即开始</span>
                  <ArrowRight className="size-7 -translate-x-[1px] justify-self-end" />
                </span>
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-sm text-muted-foreground"
          />
        </motion.div>
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-blob rounded-full bg-purple-300 opacity-20 blur-xl mix-blend-multiply filter" />
        <div className="animation-delay-2000 absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-blob rounded-full bg-yellow-300 opacity-20 blur-xl mix-blend-multiply filter" />
        <div className="animation-delay-4000 absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-blob rounded-full bg-pink-300 opacity-20 blur-xl mix-blend-multiply filter" />
      </div>
    </section>
  );
}
