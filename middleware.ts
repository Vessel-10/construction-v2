import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");
  const isSettingsRoute = request.nextUrl.pathname.startsWith("/dashboard/settings") ||
    request.nextUrl.pathname.startsWith("/api/admin/settings");

  const token = request.cookies.get("token")?.value;

  if (!token) {
    if (isApiRoute) {
      return NextResponse.json(
        { success: false, message: "Not authenticated." },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = await verifyToken(token);

  if (!payload) {
    if (isApiRoute) {
      const response = NextResponse.json(
        { success: false, message: "Session expired. Please log in again." },
        { status: 401 }
      );
      response.cookies.set("token", "", { maxAge: 0, path: "/" });
      return response;
    }

    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    return response;
  }

  if (isSettingsRoute && payload.role !== "ADMIN") {
    if (isApiRoute) {
      return NextResponse.json(
        { success: false, message: "You don't have permission to do this." },
        { status: 403 }
      );
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};