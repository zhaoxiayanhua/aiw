import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { getUserInfo } from "@/services/user";
import { getSupabaseClient } from "@/models/db";

async function checkAdmin() {
  const userInfo = await getUserInfo();
  if (!userInfo?.email) {
    return false;
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  return adminEmails.includes(userInfo.email);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ orderNo: string }> }
) {
  try {
    if (!(await checkAdmin())) {
      return respErr("Unauthorized", 403);
    }

    const { orderNo } = await params;
    const { status } = await req.json();

    if (status !== "completed") {
      return respErr("Invalid status");
    }

    const supabase = getSupabaseClient();
    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("order_no, product_id, status")
      .eq("order_no", orderNo)
      .single();

    if (findError || !order) {
      return respErr("Order not found", 404);
    }

    if (order.product_id !== "polishing-single") {
      return respErr("Invalid polishing order", 400);
    }

    if (order.status !== "paid" && order.status !== "completed") {
      return respErr("Only paid orders can be marked as completed", 400);
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("order_no", orderNo);

    if (updateError) {
      return respErr("Failed to update order status");
    }

    return respData({ order_no: orderNo, status: "completed" });
  } catch (error: any) {
    return respErr("Failed to update order status: " + error.message);
  }
}
