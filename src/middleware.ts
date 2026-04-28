import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const protectedPaths = ["/checkout", "/orders", "/profile", "/wishlist"];
        
        const isProtected = protectedPaths.some((path) =>
          req.nextUrl.pathname.startsWith(path)
        );

        if (isProtected) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/login",
      error: "/login", 
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};