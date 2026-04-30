import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import RecommendationLetterResultClient from "./components/RecommendationLetterResultClient";

interface PageProps {
  params: Promise<{
    uuid: string;
    locale: string;
  }>;
}

export default async function RecommendationLetterResultPage({ params }: PageProps) {
  const t = await getTranslations();
  const { uuid, locale } = await params;
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    const callbackUrl =
      locale === "zh"
        ? `/recommendation-letter/result/${uuid}`
        : `/${locale}/recommendation-letter/result/${uuid}`;
    redirect("/auth/signin?callbackUrl=" + encodeURIComponent(callbackUrl));
  }

  return <RecommendationLetterResultClient documentUuid={uuid} />;
} 
