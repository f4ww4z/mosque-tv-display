import prisma from "lib/prisma"
import { getYearlyJakimData, invalidateYearlyCache } from "lib/jakimApi"
import { handleRequest, HttpError } from "lib/requests"
import { getPrayerTimeFromYearlyData } from "lib/prayerUtils"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      const q = req.nextUrl.searchParams
      const countryCode = q.get("countryCode")
      const city = q.get("city")

      if (!countryCode) throw new Error("countryCode is required")
      if (!city) throw new Error("city is required")

      const myCity = await prisma.city.findFirstOrThrow({
        where: { name: city },
        select: { zone: { select: { code: true } } },
      })

      const today = new Date()
      const zone = myCity.zone.code
      const yearlyData = await getYearlyJakimData(zone)
      const prayerTime = getPrayerTimeFromYearlyData(yearlyData, today)

      if (!prayerTime) {
        invalidateYearlyCache(zone, today.getFullYear())
        throw new HttpError("JAKIM_DOWN", 503)
      }

      return NextResponse.json(prayerTime)
    },
    false
  )
}
