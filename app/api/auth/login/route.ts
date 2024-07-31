import bcrypt from "bcrypt"
import { generateJWTToken } from "lib/auth"
import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"
import { EmailPasswordLoginRequest } from "types/user"

export async function POST(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      const { email, password }: EmailPasswordLoginRequest = await req.json()

      if (!email) {
        throw new Error("Emel diperlukan.")
      }

      if (!password) {
        throw new Error("Kata Laluan diperlukan.")
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          masjidId: true,
          email: true,
          password: true,
          fullName: true,
          role: true,
        },
      })

      if (!user) {
        throw new Error("Pengguna tidak ditemukan.")
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        throw new Error("Kata laluan tidak sah.")
      }

      const token = generateJWTToken({
        id: user.id,
        masjidId: user.masjidId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      })

      return NextResponse.json({ token })
    },
    false
  )
}
