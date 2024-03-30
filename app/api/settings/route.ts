import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      const settings: Setting[] = (
        await prisma.settings.findMany({
          select: {
            id: true,
            name: true,
            value: true,
          },
        })
      ).map((setting) => {
        return {
          id: setting.id,
          name: setting.name as Setting["name"],
          value: setting.value,
        }
      })

      return NextResponse.json(settings)
    },
    false
  )
}
