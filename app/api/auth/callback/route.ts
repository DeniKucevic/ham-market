import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(
        new URL("/sign-in?error=Could not verify email", requestUrl.origin)
      );
    }

    // Successfully authenticated - redirect to next or home
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  // No code provided
  return NextResponse.redirect(
    new URL("/sign-in?error=No code provided", requestUrl.origin)
  );
}