import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      const masjid = await prisma.masjid.findFirst({
        select: {
          id: true,
        },
      })

      if (!masjid) {
        throw new Error("Demo Masjid tidak ditemukan")
      }

      return NextResponse.json(masjid)
    },
    false
  )
}
