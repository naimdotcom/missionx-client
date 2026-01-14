import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_SERVICE_URL =
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:8000";

/**
 * Middleware to handle authentication and route protection.
 * It checks for authentication via calling the Auth Service verify endpoint.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define Public Routes
  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/privacy",
    "/terms",
    "/docs",
    "/auth",
    "/auth/facebook/callback",
  ];

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  console.log("isPublicPath", isPublicPath, pathname);

  // 2. Bypass middleware for internal Next.js requests and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico" ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg")
  ) {
    return NextResponse.next();
  }

  // 2.5 Early return for public paths
  // This ensures "/" or "/login" work even if the Auth Service is DOWN.
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Removed early return for isPublicPath to allow authenticated redirection checks later

  // 3. Check Authentication Status via Auth Service
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  let isAuthenticated = false;
  let response = NextResponse.next();

  if (accessToken) {
    try {
      const verifyRes = await fetch(`${AUTH_SERVICE_URL}/api/auth/session`, {
        headers: {
          Cookie: `access_token=${accessToken}`,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (verifyRes.ok) {
        isAuthenticated = true;
      } else if (verifyRes.status === 401 && refreshToken) {
        // Try to refresh
        console.log("[Middleware] Access token expired, attempting refresh...");
        const refreshRes = await fetch(`${AUTH_SERVICE_URL}/api/auth/refresh`, {
          method: "POST",
          headers: {
            Cookie: `refresh_token=${refreshToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshRes.ok) {
          console.log("[Middleware] Token refreshed successfully");
          isAuthenticated = true;

          // We need to pass the new cookies to the browser
          const setCookieHeaders = refreshRes.headers.getSetCookie();
          if (setCookieHeaders.length > 0) {
            response = NextResponse.next();
            setCookieHeaders.forEach((cookie) => {
              response.headers.append("Set-Cookie", cookie);
            });
          }
        }
      }
    } catch (error) {
      console.error("[Middleware] Auth Service connection error:", error);
      // Backend is down or unreachable. Clear tokens to prevent client-side "authenticated" state loops.
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      response.cookies.delete("mx_auth_hint");
    }
  }

  // 4. Protection Logic

  // Case A: User is NOT authenticated
  if (!isAuthenticated) {
    if (!isPublicPath) {
      console.log(
        `[Middleware] Unauthorized attempt to: ${pathname}. Redirecting to /login`
      );
      const redirectResponse = NextResponse.redirect(
        new URL("/login", request.url)
      );

      // Ensure we clear cookies on the redirect response as well if they were marked for deletion above
      // or if we simply want to force logout on unauthorized access
      redirectResponse.cookies.delete("access_token");
      redirectResponse.cookies.delete("refresh_token");
      redirectResponse.cookies.delete("mx_auth_hint");

      return redirectResponse;
    }
    // If it is a public path, we just return the response (which might have cookie deletions set)
  }
  // Case B: User IS authenticated
  else {
    // 1. Handle Login/Signup/Root for authenticated users
    if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
      const redirectResponse = NextResponse.redirect(
        new URL("/dashboard", request.url)
      );

      // Copy cookies from the response (if any were set during refresh)
      const setCookieHeaders = response.headers.getSetCookie();
      if (setCookieHeaders.length > 0) {
        setCookieHeaders.forEach((cookie) => {
          redirectResponse.headers.append("Set-Cookie", cookie);
        });
      }

      return redirectResponse;
    }

    // App selection enforcement is now handled client-side by AppInitializer
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
