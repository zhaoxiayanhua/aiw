import "@/app/globals.css";

import { MdOutlineHome } from "react-icons/md";
import { Metadata } from "next";
import React from "react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: {
      template: `%s | ${t("metadata.title")}`,
      default: t("metadata.title"),
    },
    description: t("metadata.description"),
    keywords: t("metadata.keywords"),
  };
}

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <a
        className="text-base-content cursor-pointer transition-opacity hover:opacity-80"
        href="/"
      >
        <MdOutlineHome className="mx-8 my-8 text-2xl" />
        {/* <img className="w-10 h-10 mx-4 my-4" src="/logo.png" /> */}
      </a>
      <div className="prose prose-slate dark:prose-invert mx-auto max-w-4xl px-8 pt-4 pb-10 text-base leading-loose prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-base-content prose-code:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-base-content [&_h1]:mb-8 [&_h1]:text-center [&_h1]:text-4xl [&_h1]:font-extrabold md:[&_h1]:text-5xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-extrabold md:[&_h2]:text-3xl [&_h3]:mt-7 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold md:[&_h3]:text-2xl [&_p]:text-base md:[&_p]:text-[17px] [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-2 [&_li]:text-base md:[&_li]:text-[17px] [&_h1+strong]:mb-8 [&_h1+strong]:block [&_h1+strong]:text-center [&_h1+strong]:text-sm md:[&_h1+strong]:text-base">
        {children}
      </div>
    </div>
  );
}
