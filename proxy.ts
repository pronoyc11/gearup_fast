import { NextResponse, type NextRequest } from "next/server";

const roleHome = {
  ADMIN: "/dashboard/admin",
  PROVIDER: "/dashboard/provider",
  CUSTOMER: "/dashboard/customer",
};

export function proxy(request: NextRequest) {
  const token = request.cookies.get("gearup_token")?.value;
  const role = request.cookies.get("gearup_role")?.value as keyof typeof roleHome | undefined;
  const path = request.nextUrl.pathname;

  if (token && (path === "/auth/login" || path === "/auth/register")) {
    return NextResponse.redirect(new URL(roleHome[role ?? "CUSTOMER"], request.url));
  }

  if (path.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (path.startsWith("/dashboard/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(roleHome[role ?? "CUSTOMER"], request.url));
  }
  if (path.startsWith("/dashboard/provider") && role !== "PROVIDER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL(roleHome[role ?? "CUSTOMER"], request.url));
  }
  if (path.startsWith("/dashboard/customer") && role === "PROVIDER") {
    return NextResponse.redirect(new URL("/dashboard/provider", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
};
