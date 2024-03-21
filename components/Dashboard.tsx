"use client"

import fetchJson from "lib/fetchJson"
import { useEffect, useState } from "react"
import { PrayerTime } from "types/prayer"
import Clock from "./Clock"
import DateAndHijri from "./DateAndHijri"
import Timetable from "./Timetable"
import Link from "next/link"
import ImageCarousel from "./ImageCarousel"

const ptLabels = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]

const Dashboard = () => {
  const [pt, setPrayerTimes] = useState<PrayerTime>()

  const fetchData = async () => {
    const formdata = new FormData()
    formdata.append("datestart", new Date().toISOString())
    formdata.append("dateend", new Date().toISOString())

    try {
      const data = await fetchJson<PrayerTime>(`/api/prayer`)

      setPrayerTimes(data)

      // console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (!pt) {
    return <p>Loading...</p>
  }

  return (
    <div
      className="flex flex-col justify-start h-screen"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
      }}
    >
      <div className="flex items-center justify-between w-full px-4 py-2 bg-gradient-to-br to-teal-950/80 from-cyan-950/80">
        <Clock />
        <Link href="/login">
          <DateAndHijri pt={pt} />
        </Link>
      </div>

      <div className="flex items-center justify-center w-full flex-nowrap">
        <Timetable
          prayerTime={pt}
          ptLabelsToShow={ptLabels}
        />
        <div className="w-[156vh] h-screen">
          <ImageCarousel />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
