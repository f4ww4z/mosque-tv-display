import "moment/locale/ms"
import fetchJson from "lib/fetchJson"
import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { getHijriMonthName } from "lib/string"
import moment from "moment"
import { NextRequest, NextResponse } from "next/server"
import {
  AladhanPrayerTimesResponse,
  JAKIMPrayerTimesResponse,
  PrayerTimeResponse,
  countryCodesBehindByOneHijriDay,
} from "types/prayer"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      moment.locale("en")

      const today = new Date()
      const tomorrow = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      )

      const q = req.nextUrl.searchParams
      const countryCode = q.get("countryCode") // ISO2 country code
      const city = q.get("city")

      if (!countryCode) {
        throw new Error("countryCode is required")
      }

      if (!city) {
        throw new Error("city is required")
      }

      if (countryCode === "MY") {
        const myCity = await prisma.city.findFirstOrThrow({
          where: {
            name: city,
          },
          select: {
            zone: {
              select: {
                code: true,
              },
            },
          },
        })

        const url = new URL(process.env.JAKIM_API_URL)
        url.searchParams.set("r", "esolatApi/takwimsolat")
        url.searchParams.set("period", "duration")
        url.searchParams.set("zone", myCity.zone.code)

        const data = new FormData()
        data.append("datestart", moment(today).format("YYYY-MM-DD"))
        data.append("dateend", moment(tomorrow).format("YYYY-MM-DD"))

        const res = await fetch(url.toString(), {
          method: "POST",
          body: data,
        })

        if (!res.ok) {
          throw new Error("Error fetching prayer times response")
        }

        const response = (await res.json()) as JAKIMPrayerTimesResponse

        // console.log(response)

        const [hijriYear, hijriMonth, hijriDay] =
          response.prayerTime[0].hijri.split("-")

        const hijriMonthName = getHijriMonthName(Number(hijriMonth))

        const hijriDateFormatted = `${hijriDay} ${hijriMonthName} ${hijriYear}H`

        const date = moment(response.prayerTime[0].date, "DD-MMM-YYYY")
        date.locale("ms")
        const dateFormatted = date.format("dddd, Do MMMM yyyy")

        const prayerTime: PrayerTimeResponse = {
          hijri: hijriDateFormatted,
          date: dateFormatted,
          method: "Jabatan Kemajuan Islam Malaysia (JAKIM)",
          imsak: response.prayerTime[0].imsak.substring(0, 5),
          fajr: response.prayerTime[0].fajr.substring(0, 5),
          syuruk: response.prayerTime[0].syuruk.substring(0, 5),
          dhuhr: response.prayerTime[0].dhuhr.substring(0, 5),
          asr: response.prayerTime[0].asr.substring(0, 5),
          maghrib: response.prayerTime[0].maghrib.substring(0, 5),
          isha: response.prayerTime[0].isha.substring(0, 5),
          nextFajr: response.prayerTime[1].fajr.substring(0, 5),
        }

        return NextResponse.json(prayerTime)
      }

      // International prayer times using Aladhan API
      const aladhanDateFormatted = moment(today).format("DD-MM-YYYY")

      const currentDateUrl = new URL(
        `/v1/timingsByCity/${aladhanDateFormatted}`,
        process.env.ALADHAN_API_URL
      )
      currentDateUrl.searchParams.set("city", city)
      currentDateUrl.searchParams.set("country", countryCode)

      console.log(currentDateUrl.toString())

      const response = await fetchJson<AladhanPrayerTimesResponse>(
        currentDateUrl.toString()
      )

      console.log(response)

      const aladhanNextDayFormatted = moment(tomorrow).format("DD-MM-YYYY")

      const nextDayUrl = new URL(
        `/v1/timingsByCity/${aladhanNextDayFormatted}`,
        process.env.ALADHAN_API_URL
      )
      nextDayUrl.searchParams.set("city", city)
      nextDayUrl.searchParams.set("country", countryCode)

      const nextDayResponse = await fetchJson<AladhanPrayerTimesResponse>(
        nextDayUrl.toString()
      )

      const dateFormatted = moment(nextDayResponse.data.date.readable).format(
        "dddd, Do MMMM yyyy"
      )

      let hijriDay = response.data.date.hijri.day
      if (countryCodesBehindByOneHijriDay.includes(countryCode)) {
        hijriDay = String(Number(hijriDay) - 1)
      }

      const hijriDateFormatted = `${hijriDay} ${response.data.date.hijri.month.en} ${response.data.date.hijri.year}H`

      const prayerTime: PrayerTimeResponse = {
        hijri: hijriDateFormatted,
        date: dateFormatted,
        method: response.data.meta.method.name,
        imsak: response.data.timings.Imsak,
        fajr: response.data.timings.Fajr,
        syuruk: response.data.timings.Sunrise,
        dhuhr: response.data.timings.Dhuhr,
        asr: response.data.timings.Asr,
        maghrib: response.data.timings.Maghrib,
        isha: response.data.timings.Isha,
        nextFajr: nextDayResponse.data.timings.Fajr,
      }

      return NextResponse.json(prayerTime)
    },
    false
  )
}
