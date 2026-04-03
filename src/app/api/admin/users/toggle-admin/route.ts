import { respData, respErr } from "@/lib/resp";
import { getUserInfo } from "@/services/user";
import { getSiteSetting, setSiteSetting } from "@/models/site-settings";

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS?.split(",") || []).map((e: string) => e.trim()).filter(Boolean);
}

async function getAllAdminEmails(): Promise<string[]> {
  const envAdmins = getAdminEmails();
  const dbValue = await getSiteSetting("admin_emails");
  const dbAdmins = dbValue ? dbValue.split(",").map((e: string) => e.trim()).filter(Boolean) : [];
  // Merge and deduplicate
  return [...new Set([...envAdmins, ...dbAdmins])];
}

async function checkAdmin() {
  const userInfo = await getUserInfo();
  if (!userInfo?.email) return false;
  const admins = await getAllAdminEmails();
  return admins.includes(userInfo.email);
}

export async function POST(req: Request) {
  try {
    if (!(await checkAdmin())) {
      return respErr("无权限", 403);
    }

    const { email, action } = await req.json();

    if (!email || !action) {
      return respErr("缺少必要参数");
    }

    if (action !== "add" && action !== "remove") {
      return respErr("无效操作");
    }

    const envAdmins = getAdminEmails();
    const dbValue = await getSiteSetting("admin_emails");
    const dbAdmins = dbValue ? dbValue.split(",").map((e: string) => e.trim()).filter(Boolean) : [];

    if (action === "add") {
      if (!dbAdmins.includes(email) && !envAdmins.includes(email)) {
        dbAdmins.push(email);
      }
    } else {
      // Cannot remove env-configured admins
      if (envAdmins.includes(email)) {
        return respErr("无法移除环境变量中配置的管理员");
      }
      const idx = dbAdmins.indexOf(email);
      if (idx !== -1) {
        dbAdmins.splice(idx, 1);
      }
    }

    await setSiteSetting("admin_emails", dbAdmins.join(","));

    const allAdmins = [...new Set([...envAdmins, ...dbAdmins])];
    return respData({ admin_emails: allAdmins });
  } catch (error: any) {
    console.error("切换管理员失败:", error);
    return respErr("操作失败: " + error.message);
  }
}
