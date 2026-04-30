import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import SOPResultClient from "./components/SOPResultClient";

interface PageProps {
  params: Promise<{
    uuid: string;
    locale: string;
  }>;
}

export default async function SOPResultPage({ params }: PageProps) {
  const t = await getTranslations();
  const { uuid, locale } = await params;
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    const callbackUrl =
      locale === "zh"
        ? `/sop/result/${uuid}`
        : `/${locale}/sop/result/${uuid}`;
    redirect("/auth/signin?callbackUrl=" + encodeURIComponent(callbackUrl));
  }

  return <SOPResultClient documentUuid={uuid} />;
}
