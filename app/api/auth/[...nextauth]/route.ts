import { getAuthOptions } from "lib/auth"
import prisma from "lib/prisma"
import NextAuth from "next-auth"

const handler = NextAuth(getAuthOptions(prisma))

export { handler as GET, handler as POST }
