import { Role } from "@prisma/client"
import { Session, getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { getAuthOptions } from "./auth"
import prisma from "./prisma"

export async function handleRequest(
  req: NextRequest,
  callback: ({ session }: { session?: Session }) => Promise<NextResponse>,
  needAuth = true
) {
  try {
    let session: Session

    if (needAuth) {
      session = await getServerSession(getAuthOptions(prisma))

      if (!session) {
        throw new Error("Unauthenticated")
      }

      // check if admin and accessing admin routes
      if (
        req.nextUrl.pathname.startsWith("/api/admin") &&
        session?.user?.role !== Role.ADMIN
      ) {
        throw new Error("You are not authorized to access this page.")
      }
    }

    return await callback({ session })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    )
  }
}
