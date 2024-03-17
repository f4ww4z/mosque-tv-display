"use client"

import fetchJson from "lib/fetchJson"
import { hijriMonthToLatin } from "lib/string"
import moment from "moment"
import { useEffect, useState } from "react"
import { PrayerTime } from "types/prayer"

const DateAndHijri = () => {
  const [pt, setPrayerTimes] = useState<PrayerTime>()

  const fetchPrayerTimes = async () => {
    const formdata = new FormData()
    formdata.append("datestart", new Date().toISOString())
    formdata.append("dateend", new Date().toISOString())

    try {
      const data = await fetchJson<PrayerTime>(`/api/prayer`)

      setPrayerTimes(data)

      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchPrayerTimes()
  }, [])

  if (!pt) {
    return <p>Loading...</p>
  }

  return (
    <div className="flex flex-col ml-4 text-3xl text-amber-100 drop-shadow-2xl">
      <p className="font-bold">{moment().format("dddd, DD MMMM YYYY")}</p>
      <p className="font-bold">
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
