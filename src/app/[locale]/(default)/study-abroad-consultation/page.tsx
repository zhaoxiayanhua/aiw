import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import StudyAbroadGeneratorClient from "./components/StudyAbroadGeneratorClient";

export default async function StudyAbroadConsultationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations();
  const { locale } = await params;
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    const callbackUrl =
      locale === "zh"
        ? "/study-abroad-consultation"
        : `/${locale}/study-abroad-consultation`;
    redirect("/auth/signin?callbackUrl=" + encodeURIComponent(callbackUrl));
  }

  return <StudyAbroadGeneratorClient />;
}
