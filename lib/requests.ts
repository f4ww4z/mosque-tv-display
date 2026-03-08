import { Role } from "@prisma/client"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { SessionUser } from "types/user"
import { verifyAndDecodeJWTToken } from "./auth"

export class HttpError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.name = "HttpError"
    this.statusCode = statusCode
  }
}

export async function handleRequest(
  req: NextRequest,
  callback: ({
    sessionUser,
  }: {
    sessionUser?: SessionUser
  }) => Promise<NextResponse>,
  needAuth = true
) {
  try {
    if (!needAuth) {
      return await callback({})
    }

    const authorization = headers().get("Authorization")

    if (!authorization) {
      throw new Error("Sila log masuk untuk pergi ke laman ini.")
    }

    const jwt = authorization.split(" ")[1]
    if (!jwt) {
      throw new Error("Sila log masuk untuk meneruskan request ini.")
    }

    const sessionUser = verifyAndDecodeJWTToken<SessionUser>(jwt)

    if (!sessionUser) {
      throw new Error("Sila log masuk untuk meneruskan request ini.")
    }

    // check if admin and accessing admin routes
    if (
      req.nextUrl.pathname.startsWith("/api/admin") &&
      sessionUser.role !== Role.SUPERADMIN
    ) {
      throw new Error("Anda tidak dibenarkan mengakses halaman ini.")
    }

    // Masjid admins can only CUD their own masjid
    if (
      req.nextUrl.pathname.startsWith("/api/masjid") &&
      sessionUser.role === Role.MASJID_ADMIN
    ) {
      const masjidId = req.nextUrl.pathname.split("/")[3]

      if (sessionUser.masjidId !== masjidId && req.method !== "GET") {
        throw new Error("Anda tidak dibenarkan mengedit masjid ini.")
      }
    }

    return await callback({ sessionUser })
  } catch (error) {
    console.log(error)
    const statusCode = error instanceof HttpError ? error.statusCode : 500
    const message =
      error instanceof Error
        ? error.message
        : "Error yang tidak diketahui berlaku"
    return NextResponse.json(
      { error: message },
      { status: statusCode, statusText: message }
    )
  }
}
