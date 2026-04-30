import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import ResumeEditClient from "./components/ResumeEditClient";

interface PageProps {
  params: Promise<{
    uuid: string;
    locale: string;
  }>;
}

export default async function ResumeEditPage({ params }: PageProps) {
  const t = await getTranslations();
  const { uuid, locale } = await params;
  const userInfo = await getUserInfo();
  
  if (!userInfo || !userInfo.email) {
    const callbackUrl =
      locale === "zh"
        ? `/resume-generator/edit/${uuid}`
        : `/${locale}/resume-generator/edit/${uuid}`;
    redirect("/auth/signin?callbackUrl=" + encodeURIComponent(callbackUrl));
  }

  return <ResumeEditClient documentUuid={uuid} />;
}
