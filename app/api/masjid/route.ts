import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"
import { BriefMasjidResponse } from "types/masjid"

// export const dynamic = "force-dynamic"
// export const revalidate = 0

export async function GET(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      const masjids: BriefMasjidResponse[] = await prisma.masjid.findMany({
        select: {
          id: true,
          type: true,
          name: true,
        },
      })

      return NextResponse.json(masjids)
    },
    false
  )
}
