import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import PSResultClient from "./components/PSResultClient";

interface PageProps {
  params: Promise<{
    uuid: string;
    locale: string;
  }>;
}

export default async function PSResultPage({ params }: PageProps) {
  const t = await getTranslations();
  const { uuid, locale } = await params;
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    const callbackUrl =
      locale === "zh"
        ? `/personal-statement/result/${uuid}`
        : `/${locale}/personal-statement/result/${uuid}`;
    redirect("/auth/signin?callbackUrl=" + encodeURIComponent(callbackUrl));
  }

  return <PSResultClient documentUuid={uuid} />;
}
