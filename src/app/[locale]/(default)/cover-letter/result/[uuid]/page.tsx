import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import CoverLetterResultClient from "./components/CoverLetterResultClient";

interface PageProps {
  params: Promise<{
    uuid: string;
    locale: string;
  }>;
}

export default async function CoverLetterResultPage({ params }: PageProps) {
  const t = await getTranslations();
  const { uuid, locale } = await params;
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    const callbackUrl =
      locale === "zh"
        ? `/cover-letter/result/${uuid}`
        : `/${locale}/cover-letter/result/${uuid}`;
    redirect("/auth/signin?callbackUrl=" + encodeURIComponent(callbackUrl));
  }

  return <CoverLetterResultClient documentUuid={uuid} />;
} 
