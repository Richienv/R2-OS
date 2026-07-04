import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and image files, so the
     * session is refreshed and protected routes are gated everywhere else.
     */
    "/((?!_next/static|_next/image|favicon.ico|favicon.svg|apple-touch-icon.png|icon-512.png|manifest.json|api/og|api/icon).*)",
  ],
};
