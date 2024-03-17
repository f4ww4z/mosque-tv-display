import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { NextAuthOptions, User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { SessionUser } from "types/user"

export const getAuthOptions = (prisma: PrismaClient): NextAuthOptions => {
  return {
    session: {
      maxAge: 60 * 60 * 24, // 1 day
    },
    jwt: {
      maxAge: 60 * 60 * 24, // 1 day
    },
    providers: [
      Credentials({
        id: "emailpassword",
        name: "Email and Password",
        credentials: {
          email: { label: "Email", type: "text", placeholder: "Email" },
          password: {
            label: "Password",
            type: "password",
            placeholder: "Password",
          },
        },
        async authorize(credentials): Promise<User | null> {
          // console.log(credentials)

          try {
            const user = await prisma.user.findFirstOrThrow({
              where: { email: credentials.email },
              select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                password: true,
              },
            })

            if (!user) {
              return null
            }

            // console.log(user)
            // console.log(credentials.password)

            const matchingPassword = await bcrypt.compare(
              credentials.password,
              user.password
            )

            if (!matchingPassword) {
              return null
            }

            return user
          } catch (error) {
            console.log("authorize error")
            console.error(error)
            return null
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        try {
          if (!user) {
            return token
          }

          const dbUser = await prisma.user.findFirstOrThrow({
            where: { email: user.email },
            select: {
              role: true,
            },
          })

          if (!dbUser) {
            return token
          }

          token.userRole = dbUser.role

          // console.log(token)
          return token
        } catch (error) {
          console.error(error)
          return token
        }
      },
      async session({ session }) {
        // console.log("session is ")
        // console.log(session)

        const dbUser: SessionUser = await prisma.user.findFirstOrThrow({
          where: { email: session.user.email },
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            password: true,
          },
        })

        if (!dbUser) {
          return session
        }

        session.user = dbUser
        return session
      },
      async signIn({ user }) {
        // console.log("signing in...")
        // console.log(user)

        try {
          const dbUser = await prisma.user.findFirstOrThrow({
            where: { email: user.email },
          })

          if (!dbUser) {
            return false
          }

          return true
        } catch (error) {
          console.error("sign in error")
          console.error(error)
          return null
        }
      },
    },
  }
}
