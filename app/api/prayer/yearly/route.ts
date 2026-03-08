import prisma from "lib/prisma"
import { getYearlyJakimData } from "lib/jakimApi"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

/**
 * Returns the full yearly JAKIM prayer timetable for the zone associated with the city.
 * Used by the browser to cache the entire year's data in localStorage,
 * enabling full offline functionality.
 */
export async function GET(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      const q = req.nextUrl.searchParams
      const countryCode = q.get("countryCode")
      const city = q.get("city")

      if (!countryCode || countryCode !== "MY") {
        throw new Error("Yearly prayer data is only supported for MY")
      }

      if (!city) {
        throw new Error("city is required")
      }

      const myCity = await prisma.city.findFirstOrThrow({
        where: { name: city },
        select: { zone: { select: { code: true } } },
      })

      const yearlyData = await getYearlyJakimData(myCity.zone.code)
      return NextResponse.json(yearlyData)
    },
    false
  )
}
