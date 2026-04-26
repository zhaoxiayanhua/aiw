"use client";

import { BookOpen, PenTool, WandSparkles } from "lucide-react";

export default function HomeHighlights() {
  return (
    <section className="px-4 pb-6 pt-2 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 text-sm text-[#84868a] md:gap-8 md:text-base">
        <div className="flex items-center gap-2.5">
          <PenTool className="size-4 text-[#11803a]" />
          <span>智能写作工具</span>
        </div>
        <span className="h-4 w-px bg-[#d5d7db]" />
        <div className="flex items-center gap-2.5">
          <BookOpen className="size-4 text-[#11803a]" />
          <span>案例参考丰富</span>
        </div>
        <span className="h-4 w-px bg-[#d5d7db]" />
        <div className="flex items-center gap-2.5">
          <WandSparkles className="size-4 text-[#11803a]" />
          <span>人工润色支持</span>
        </div>
      </div>
    </section>
  );
}
