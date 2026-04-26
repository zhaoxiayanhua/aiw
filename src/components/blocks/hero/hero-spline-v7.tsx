"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/app";
import Link from "next/link";
import NextImage from "next/image";
import HeroBg from "./bg";

export default function HeroSplineV7({ section }: { section: SectionType }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useAppContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    setImageLoaded(false);

    const isDark = theme === "dark";
    const imageSrc = isDark ? "/imgs/coverdark.png" : "/imgs/cover-v2.png";

    const img = new window.Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true);
    img.src = imageSrc;
  }, [theme, mounted]);

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

      {!imageLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="animate-pulse text-muted-foreground">Loading background...</div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 1.05 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: imageLoaded
            ? `url('${mounted && theme === "dark" ? "/imgs/coverdark.png" : "/imgs/cover-v2.png"}')`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-30 px-4 pt-12 text-center md:pt-16 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="mx-auto w-full max-w-none space-y-8"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
              className="mx-auto flex w-[88vw] max-w-[60rem] min-w-0 justify-center md:w-[82vw] lg:w-[58vw] xl:w-[60vw] 2xl:w-[64vw]"
            >
              <NextImage
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
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mx-auto max-w-none whitespace-nowrap text-base text-muted-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)] md:text-lg lg:text-xl"
            >
              从文书初稿、简历优化到人工润色，帮你更清晰地表达经历、优势与申请目标。
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex justify-center pt-6"
          >
            <Link href="/creation-center">
              <Button
                size="lg"
                className="rounded-xl px-6 py-7 text-lg font-semibold shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
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
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-sm text-gray-300"
          />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-5">
        <div
          className="absolute left-1/4 top-1/4 h-2 w-2 animate-pulse rounded-full bg-black/15"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute right-1/3 top-1/3 h-1 w-1 animate-pulse rounded-full bg-black/20"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/2 h-1.5 w-1.5 animate-pulse rounded-full bg-black/10"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        />
        <div
          className="absolute right-1/4 top-2/3 h-1 w-1 animate-pulse rounded-full bg-black/15"
          style={{ animationDelay: "0.5s", animationDuration: "3.5s" }}
        />
      </div>
    </section>
  );
}
