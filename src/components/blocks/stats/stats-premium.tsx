"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";

function formatCounterValue(value: number, decimals: number) {
  if (decimals > 0) {
    return value.toFixed(decimals);
  }

  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2.5,
  shouldAnimate = false,
  isHovering = false,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  shouldAnimate?: boolean;
  isHovering?: boolean;
}) {
  const [displayValue, setDisplayValue] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const needsReplay = isHovering && hasAnimated;
    const shouldStart = (shouldAnimate && !hasAnimated) || needsReplay;

    if (!shouldStart || isAnimatingRef.current) {
      return;
    }

    isAnimatingRef.current = true;

    let startTime: number | null = null;
    let animationFrame = 0;

    const updateValue = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easedProgress = 1 - Math.pow(1 - progress, 2.5);
      const currentValue = easedProgress * value;

      setDisplayValue(formatCounterValue(currentValue, decimals));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateValue);
        return;
      }

      setDisplayValue(formatCounterValue(value, decimals));
      setHasAnimated(true);
      isAnimatingRef.current = false;
    };

    animationFrame = requestAnimationFrame(updateValue);

    return () => {
      cancelAnimationFrame(animationFrame);
      isAnimatingRef.current = false;
    };
  }, [decimals, duration, hasAnimated, isHovering, shouldAnimate, value]);

  return (
    <span className="tabular-nums">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

const statsConfig = [
  {
    icon: Star,
    title: "95% 好评率",
    value: 95,
    suffix: "%",
    unit: "用户满意度",
    decimals: 0,
    color: "blue",
  },
  {
    icon: Users,
    title: "1500+ 注册用户",
    value: 1500,
    suffix: "+",
    unit: "累计注册用户数",
    color: "purple",
  },
  {
    icon: FileText,
    title: "3,289+ 份文书",
    value: 3289,
    suffix: "+",
    unit: "累计生成文书数量",
    color: "green",
    highlight: true,
  },
  {
    icon: UserCheck,
    title: "10+ 常驻润色老师",
    value: 10,
    suffix: "+",
    unit: "人工润色支持",
    color: "orange",
  },
  {
    icon: Zap,
    title: "3 分钟快速生成",
    value: 3,
    suffix: "",
    unit: "平均生成用时",
    color: "red",
  },
  {
    icon: Target,
    title: "92% 用户获得录取",
    value: 92,
    suffix: "%",
    unit: "录取率",
    color: "emerald",
  },
];

export default function StatsPremium({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: "0px 0px -10% 0px",
  });

  return (
    <section id={section.name} className="relative overflow-hidden py-24">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]">
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="stats-grid"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path d="M0 40V0h40" fill="none" stroke="currentColor" strokeWidth="0.25" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stats-grid)" />
          </svg>
        </div>

        <div className="absolute inset-0 stats-bg-gradient" />
        <div className="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-transparent via-[#86f096]/10 to-transparent dark:via-[#86f096]/5" />
        <div className="absolute top-0 right-1/3 h-full w-px bg-gradient-to-b from-transparent via-[#3dcd77]/10 to-transparent dark:via-[#3dcd77]/5" />
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#86f096]/10 to-[#3dcd77]/10 blur-[100px] opacity-40 dark:from-[#86f096]/5 dark:to-[#3dcd77]/5" />
      </div>

      <div className="container relative">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-md border border-[#3dcd77]/20 bg-gradient-to-r from-[#86f096]/10 to-[#3dcd77]/10 px-3 py-1.5 backdrop-blur-sm dark:border-[#3dcd77]/10"
          >
            <TrendingUp className="h-4 w-4 text-[#3dcd77] dark:text-[#86f096]" />
            <span className="text-lg font-semibold text-[#3dcd77] dark:text-[#86f096]">
              平台数据
            </span>
          </motion.div>

          <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
            {section.title || "我们的用户遍布世界名校"}
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400">
            {section.description || "数据是我们实力最好的证明"}
          </p>
        </motion.div>

        <div ref={containerRef} className="relative">
          <div className="grid gap-4 lg:gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              {statsConfig.slice(0, 3).map((stat, index) => (
                <StatsCard key={index} stat={stat} index={index} shouldAnimate={isInView} />
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {statsConfig.slice(3, 6).map((stat, index) => (
                <StatsCard
                  key={index + 3}
                  stat={stat}
                  index={index + 3}
                  shouldAnimate={isInView}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface StatsCardProps {
  stat: (typeof statsConfig)[0];
  index: number;
  shouldAnimate: boolean;
}

function StatsCard({ stat, index, shouldAnimate }: StatsCardProps) {
  const IconComponent = stat.icon;
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{
        y: -1,
        transition: { duration: 0.2 },
      }}
      className="group relative"
    >
      <div
        className={`
          group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300
          hover:border-gray-300 hover:shadow-md dark:border-gray-700/50 dark:bg-gray-800/50 dark:backdrop-blur-sm
          dark:hover:border-[#3dcd77]/30 dark:hover:shadow-[#3dcd77]/5
          ${stat.highlight ? "ring-1 ring-gray-200 dark:ring-[#3dcd77]/20" : ""}
        `}
      >
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.04]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#86f096]/5 via-transparent to-[#3dcd77]/5 dark:from-[#86f096]/10 dark:to-[#3dcd77]/10" />
        </div>

        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-br from-[#86f096]/5 via-transparent to-[#3dcd77]/5 dark:from-[#86f096]/8 dark:via-transparent dark:to-[#3dcd77]/8" />
        </div>

        <div className="relative">
          <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#3dcd77]/20 bg-gradient-to-br from-[#86f096]/10 to-[#3dcd77]/10 transition-all duration-200 group-hover:from-[#86f096]/20 group-hover:to-[#3dcd77]/20 dark:border-[#3dcd77]/30 dark:from-[#86f096]/15 dark:to-[#3dcd77]/15 dark:group-hover:from-[#86f096]/25 dark:group-hover:to-[#3dcd77]/25">
            <IconComponent className="h-4 w-4 text-[#027c50] dark:text-[#86f096]" />
          </div>

          <h3 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            {stat.title}
          </h3>

          <div className="mb-1 text-3xl font-semibold text-gray-900 dark:text-gray-100 lg:text-4xl">
            <AnimatedCounter
              value={stat.value}
              suffix={stat.suffix}
              decimals={stat.decimals || 0}
              duration={isHovering ? 1.2 : 2.2 + index * 0.15}
              shouldAnimate={shouldAnimate}
              isHovering={isHovering}
            />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-500">{stat.unit}</p>
        </div>

        {stat.highlight && (
          <motion.div
            className="absolute top-0 left-0 h-0.5 w-full"
            initial={{ scaleX: 0 }}
            animate={shouldAnimate ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="h-full bg-gradient-to-r from-transparent via-[#3dcd77] to-transparent dark:via-[#86f096]" />
          </motion.div>
        )}

        <div className="absolute top-0 right-0 h-12 w-12 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute -top-6 -right-6 h-12 w-12 bg-gradient-to-br from-[#86f096]/10 to-transparent dark:from-[#86f096]/20 dark:to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}
