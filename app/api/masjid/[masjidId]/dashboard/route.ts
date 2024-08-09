import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"
import { MasjidDashboardResponse } from "types/masjid"

export async function GET(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(
    req,
    async () => {
      const data: MasjidDashboardResponse = await prisma.masjid.findFirst({
        where: {
          id: params.masjidId,
        },
        select: {
          type: true,
          name: true,
        },
      })

      if (!data) {
        throw new Error("Masjid tidak ditemukan")
      }

      return NextResponse.json(data)
    },
    false
  )
}
