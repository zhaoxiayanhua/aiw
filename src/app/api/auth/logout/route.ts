import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/models/db";

function parseCookieHeader(cookieHeader: string) {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [key, ...val] = part.split("=");
        return [key, val.join("=")];
      })
  );
}

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = parseCookieHeader(cookieHeader);
    const sessionToken = cookies["better-auth.session_token"];

    // Delete session from DB
    if (sessionToken) {
      const supabase = getSupabaseClient();
      await supabase.from("session").delete().eq("token", sessionToken);
    }

    // Clear cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("better-auth.session_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    const response = NextResponse.json({ success: true });
    response.cookies.set("better-auth.session_token", "", {
      path: "/",
      maxAge: 0,
    });
    return response;
  }
}
