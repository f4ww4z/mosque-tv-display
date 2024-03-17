"use client"

import fetchJson from "lib/fetchJson"
import { useEffect, useState } from "react"
import { PrayerTime } from "types/prayer"

const Timetable = () => {
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
    <div className="flex flex-col gap-2 text-center">
      <div className="flex flex-col items-center gap-1 p-4 text-white border-4 bg-teal-700/80 rounded-2xl">
        <p className="text-4xl font-medium">Fajr</p>
        <p className="text-6xl font-bold">
          {pt.fajr.substring(0, pt.fajr.length - 3)}
        </p>
      </div>

      <div className="flex flex-col items-center gap-1 p-4 text-white border-4 bg-teal-700/80 rounded-2xl">
        <p className="text-4xl font-medium">Dhuhr</p>
        <p className="text-6xl font-bold">
          {pt.dhuhr.substring(0, pt.dhuhr.length - 3)}
        </p>
      </div>

      <div className="flex flex-col items-center gap-1 p-4 text-white border-4 bg-teal-700/80 rounded-2xl">
        <p className="text-4xl font-medium">Asr</p>
        <p className="text-6xl font-bold">
          {pt.asr.substring(0, pt.asr.length - 3)}
        </p>
      </div>

      <div className="flex flex-col items-center gap-1 p-4 text-white border-4 bg-teal-700/80 rounded-2xl">
        <p className="text-4xl font-medium">Maghrib</p>
        <p className="text-6xl font-bold">
          {pt.maghrib.substring(0, pt.maghrib.length - 3)}
        </p>
      </div>

      <div className="flex flex-col items-center gap-1 p-4 text-white border-4 bg-teal-700/80 rounded-2xl">
        <p className="text-4xl font-medium">Isha</p>
        <p className="text-6xl font-bold">
          {pt.isha.substring(0, pt.isha.length - 3)}
        </p>
      </div>
    </div>
  )
}

export default Timetable
