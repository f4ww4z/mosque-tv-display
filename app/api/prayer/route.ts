import fs from "fs"
import { handleRequest } from "lib/requests"
import moment from "moment"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { PrayerTime } from "types/prayer"

export async function GET(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      const timetableFile = fs.readFileSync(
        `${process.env.ROOT_FILES_PATH}${path.sep}timetable${path.sep}${new Date().getFullYear()}.json`
      )

      const timetable = JSON.parse(timetableFile.toString())

      const today = moment().format("DD-MMM-YYYY")

      const todayPrayerTime: PrayerTime = timetable.prayerTime.find(
        (prayerTime: any) => prayerTime.date === today
      )

      return NextResponse.json(todayPrayerTime)
    },
    false
  )
}
