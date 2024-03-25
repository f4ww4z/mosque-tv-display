import { handleRequest } from "lib/requests"
import moment from "moment"
import { NextRequest, NextResponse } from "next/server"
import { PrayerTimesResponse } from "types/prayer"

export async function POST(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      const { date } = await req.json()

      const data = new FormData()
      data.append("datestart", moment(date).format("YYYY-MM-DD"))
      data.append("dateend", moment(date).format("YYYY-MM-DD"))

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
