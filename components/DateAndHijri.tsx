"use client"

import { hijriMonthToLatin } from "lib/string"
import moment from "moment"
import { PrayerTime } from "types/prayer"

const DateAndHijri = ({ pt }: { pt: PrayerTime }) => {
  if (!pt) {
    return <p>Loading...</p>
  }

  return (
    <div className="flex gap-6 text-5xl font-bold text-amber-100 drop-shadow-2xl font-sans uppercase">
      <p>{moment().format("dddd, DD MMMM YYYY")}</p>
      <p>/</p>
      <p className="text-amber-300">
        {Number(pt.hijri.substring(8, 10))}
        &nbsp;
        {hijriMonthToLatin(pt.hijri.substring(5, 7))}
        &nbsp;
        {pt.hijri.substring(0, 4)}H
      </p>
    </div>
  )
}

export default DateAndHijri
