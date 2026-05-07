"use client";

import SignIn from "./sign_in";
import User from "./user";
import { useAppContext } from "@/contexts/app";
import { useCustomSession } from "@/hooks/useCustomSession";
import { useTranslations } from "next-intl";

export default function SignToggle() {
  const t = useTranslations();
  const { user } = useAppContext();
  const { isPending, data: session } = useCustomSession();

  if (isPending) {
    return <div className="h-9 w-24" />;
  }

  return (
    <div className="flex items-center gap-x-2 px-2 cursor-pointer">
      {session?.user && user ? <User user={user} /> : <SignIn />}
    </div>
  );
}
