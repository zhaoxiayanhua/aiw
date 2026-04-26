"use client";

import { motion } from "framer-motion";

export default function HeroArtTitle() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
      className="hero-art-title-wrap text-5xl leading-tight md:text-6xl lg:text-7xl xl:text-[5.5rem] 2xl:text-[6.5rem]"
    >
      <span className="hero-art-title-line hero-art-title-main">为留学申请打造的</span>
      <span className="hero-art-title-line hero-art-title-accent">
        AI <span className="hero-art-title-gong">工</span>作空间
      </span>
    </motion.h1>
  );
}
