"use client"

import { hijriMonthToLatin } from "lib/string"
import moment from "moment"
import { PrayerTime } from "types/prayer"

const DateAndHijri = ({ pt }: { pt: PrayerTime }) => {
  if (!pt) {
    return <p>Loading...</p>
  }

  return (
    <div className="flex items-center justify-end mt-1 text-3xl font-bold flex-nowrap text-amber-100 drop-shadow-2xl">
      <span className="">
        {moment(new Date()).format("dddd, DD MMMM YYYY")}
      </span>
      <span className="mx-2">/</span>
      <span className="text-amber-300">
        {Number(pt.hijri.substring(8, 10))}
        &nbsp;
        {hijriMonthToLatin(pt.hijri.substring(5, 7))}
        &nbsp;
        {pt.hijri.substring(0, 4)}H
      </span>
    </div>
  )
}

export default DateAndHijri
