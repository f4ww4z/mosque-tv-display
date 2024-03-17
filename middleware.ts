import { Role } from "@prisma/client"
import { withAuth } from "next-auth/middleware"

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname.startsWith("/admin/login")) {
        return true
      }

      // `/admin` requires admin role
      if (
        req.nextUrl.pathname.startsWith("/admin") ||
        req.nextUrl.pathname.startsWith("/api/admin")
      ) {
        return token?.userRole === Role.ADMIN
      }

      return !!token
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
})

export const config = {
  matcher: ["/admin/:path*"],
}
