import { Database } from "@/types/database";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(
  request: NextRequest,
  response?: NextResponse
) {
  // Use provided response or create new one
  const supabaseResponse =
    response ||
    NextResponse.next({
      request,
    });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if accessing admin routes
  const pathname = request.nextUrl.pathname;
  const pathSegments = pathname.split("/").filter(Boolean);
  const isAdminRoute = pathSegments.includes("admin");

  if (isAdminRoute) {
    // Not logged in - redirect to sign in
    if (!user) {
      const locale = pathSegments[0] || "en";
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url));
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // Not admin - redirect to home
    if (profile?.role !== "admin") {
      const locale = pathSegments[0] || "en";
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return supabaseResponse;
}
