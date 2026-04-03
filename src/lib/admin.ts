import { getUserInfo } from "@/services/user";
import { getSiteSetting } from "@/models/site-settings";

export async function getAdminEmails(): Promise<string[]> {
  const envAdmins = (process.env.ADMIN_EMAILS?.split(",") || [])
    .map((e: string) => e.trim())
    .filter(Boolean);
  const dbValue = await getSiteSetting("admin_emails");
  const dbAdmins = dbValue
    ? dbValue.split(",").map((e: string) => e.trim()).filter(Boolean)
    : [];
  return [...new Set([...envAdmins, ...dbAdmins])];
}

export async function checkAdmin(): Promise<boolean> {
  const userInfo = await getUserInfo();
  if (!userInfo?.email) return false;
  const admins = await getAdminEmails();
  return admins.includes(userInfo.email);
}
