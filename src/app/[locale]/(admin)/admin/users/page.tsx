import { getUsers } from "@/models/user";
import { getUserQuotaSummary, ServiceType } from "@/models/service-quota";
import { getSiteSetting } from "@/models/site-settings";
import UsersManagement from "./components/users-management";

export default async function AdminUsersPage() {
  const users = await getUsers(1, 50);

  const quotasMap: Record<string, Record<ServiceType, number>> = {};
  if (users && users.length > 0) {
    await Promise.all(
      users.map(async (user: any) => {
        if (user.uuid) {
          quotasMap[user.uuid] = await getUserQuotaSummary(user.uuid);
        }
      })
    );
  }

  const envAdmins = (process.env.ADMIN_EMAILS?.split(",") || []).map((e: string) => e.trim()).filter(Boolean);
  const dbValue = await getSiteSetting("admin_emails");
  const dbAdmins = dbValue ? dbValue.split(",").map((e: string) => e.trim()).filter(Boolean) : [];
  const adminEmails = [...new Set([...envAdmins, ...dbAdmins])];

  return <UsersManagement users={users || []} userQuotasMap={quotasMap} adminEmails={adminEmails} />;
}
