import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// This function can be marked `async` if using `await` inside
export async function proxy(request:NextRequest ) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const user = session?.user;
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/add-studio/:path*", "/my-listings/:path*", "/my-bookings/:path*", "/studios/edit/:path*"],
};
