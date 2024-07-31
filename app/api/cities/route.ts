import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      const zonesWithCities = await prisma.zone.findMany({
        select: {
          code: true,
          cities: {
            select: {
              id: true,
              name: true,
            },
          },
          state: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          state: {
            name: "asc",
          },
        },
      })

      const res = zonesWithCities.map((zone) => ({
        code: zone.code,
        stateName: zone.state.name,
        cities: zone.cities.map((city) => ({
          id: city.id,
          name: city.name,
        })),
      }))

      return NextResponse.json(res)
    },
    false
  )
}
