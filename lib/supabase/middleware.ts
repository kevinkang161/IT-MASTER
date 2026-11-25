import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  // Performance & Resilience Check:
  // Supabase auth cookies typically start with "sb-" or contain "auth-token".
  // If there are no auth cookies in the request (e.g. anonymous visitor on public pages),
  // return immediately to avoid unnecessary network latency or timeouts.
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) => c.name.startsWith("sb-") || c.name.includes("auth-token")
  );

  if (!hasAuthCookie) {
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    });

    // Refresh auth token with a strict 1500ms timeout.
    // If Supabase is slow, paused, or DNS fails, this ensures the middleware NEVER exceeds
    // Vercel's Edge execution limits (which causes 504 MIDDLEWARE_INVOCATION_TIMEOUT).
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 1500));
    await Promise.race([supabase.auth.getUser(), timeoutPromise]);
  } catch (error) {
    // Fail silently in edge middleware so page requests are never blocked
    console.warn("Middleware auth session refresh error:", error);
  }

  return response;
}
