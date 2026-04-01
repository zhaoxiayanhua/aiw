import { respData, respErr } from "@/lib/resp";
import { getUserInfo } from "@/services/user";
import { hashPassword, validatePasswordStrength } from "@/lib/password";
import { getSupabaseClient } from "@/models/db";

async function checkAdmin() {
  const userInfo = await getUserInfo();
  if (!userInfo?.email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  return adminEmails.includes(userInfo.email);
}

export async function POST(req: Request) {
  try {
    if (!(await checkAdmin())) {
      return respErr("无权限", 403);
    }

    const { user_uuid, new_password } = await req.json();

    if (!user_uuid || !new_password) {
      return respErr("缺少必要参数");
    }

    const validation = validatePasswordStrength(new_password);
    if (!validation.isValid) {
      return respErr(validation.message || "密码不符合要求");
    }

    const supabase = getSupabaseClient();

    // 查找用户
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("uuid, signin_provider")
      .eq("uuid", user_uuid)
      .single();

    if (userError || !user) {
      return respErr("用户不存在");
    }

    if (user.signin_provider !== "credentials") {
      return respErr("该用户使用第三方登录，无法重置密码");
    }

    // 哈希新密码
    const hashedPassword = await hashPassword(new_password);

    // 更新密码（密码存储在 users 表的 signin_openid 字段）
    const { error: updateError } = await supabase
      .from("users")
      .update({ signin_openid: hashedPassword, updated_at: new Date().toISOString() })
      .eq("uuid", user_uuid);

    if (updateError) {
      return respErr("更新密码失败");
    }

    // 删除该用户所有 session（强制重新登录）
    await supabase.from("session").delete().eq("user_id", user_uuid);

    return respData({ success: true });
  } catch (error: any) {
    console.error("重置密码失败:", error);
    return respErr("重置密码失败: " + error.message);
  }
}
