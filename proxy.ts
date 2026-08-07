import { NextResponse, type NextRequest } from "next/server";

const roleHome = {
  ADMIN: "/dashboard/admin",
  PROVIDER: "/dashboard/provider",
  CUSTOMER: "/dashboard/customer",
};

const publicPaths = new Set([
  "/",
  "/about",
  "/auth/login",
  "/auth/register",
  "/cart",
  "/payment/success",
  "/payment/cancel",
]);

function isPublicPath(path: string) {
  return publicPaths.has(path) || path === "/gear" || path.startsWith("/gear/");
}

function redirectNoStore(url: URL) {
  const response = NextResponse.redirect(url);
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("gearup_token")?.value;
  const role = request.cookies.get("gearup_role")?.value as keyof typeof roleHome | undefined;
  const path = request.nextUrl.pathname;

  if (token && (path === "/auth/login" || path === "/auth/register")) {
    return redirectNoStore(new URL(roleHome[role ?? "CUSTOMER"], request.url));
  }

  if (!token && !isPublicPath(path)) {
    return redirectNoStore(new URL("/auth/login", request.url));
  }

  if (!token) {
    return NextResponse.next();
  }

  if (path.startsWith("/dashboard/admin") && role !== "ADMIN") {
    return redirectNoStore(new URL(roleHome[role ?? "CUSTOMER"], request.url));
  }
  if (path.startsWith("/dashboard/provider") && role !== "PROVIDER") {
    return redirectNoStore(new URL(roleHome[role ?? "CUSTOMER"], request.url));
  }
  if (path.startsWith("/dashboard/customer") && role !== "CUSTOMER") {
    return redirectNoStore(new URL(roleHome[role ?? "CUSTOMER"], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
