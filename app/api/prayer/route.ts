import { handleRequest } from "lib/requests"
import moment from "moment"
import { NextRequest, NextResponse } from "next/server"
import { PrayerTimesResponse } from "types/prayer"

export async function GET(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      const data = new FormData()
      data.append("datestart", moment().format("YYYY-MM-DD"))
      data.append("dateend", moment().format("YYYY-MM-DD"))

      const res = await fetch(process.env.NEXT_PUBLIC_JAKIM_PRAYER_TIMES_URL, {
        method: "POST",
        body: data,
      })

      if (!res?.ok) {
        throw new Error("Failed to fetch prayer times")
      }

      const prayerTimes: PrayerTimesResponse = await res.json()

      if (prayerTimes.status !== "OK!") {
        throw new Error("Failed to fetch prayer times")
      }

      return NextResponse.json(prayerTimes.prayerTime[0])
    },
    false
  )
}
