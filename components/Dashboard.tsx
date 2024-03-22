"use client"

import fetchJson from "lib/fetchJson"
import Link from "next/link"
import { useEffect, useState } from "react"
import { PrayerTime } from "types/prayer"
import Clock from "./Clock"
import DateAndHijri from "./DateAndHijri"
import ImageCarousel from "./ImageCarousel"
import PrayerTimetable from "./PrayerTimetable"
import DoNotDisturbScreen from "./DoNotDisturbScreen"

const ptLabels = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]

const Dashboard = () => {
  const [pt, setPrayerTimes] = useState<PrayerTime>()

  const [doNotDisturb, setDoNotDisturb] = useState<boolean>(false)

  const fetchData = async () => {
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

    const interval = setInterval(() => {
      fetchData()
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="flex flex-col justify-start h-screen"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
      }}
    >
      {doNotDisturb && (
        <DoNotDisturbScreen onClick={() => setDoNotDisturb(!doNotDisturb)} />
      )}
      <div
        onClick={() => setDoNotDisturb(!doNotDisturb)}
        className="flex items-center justify-between w-full px-4 py-2 bg-gradient-to-br to-teal-950/80 from-cyan-950/80"
      >
        <Clock />
        <Link href="/login">
          <DateAndHijri pt={pt} />
        </Link>
      </div>

      <div className="flex items-start justify-center w-full flex-nowrap">
        <PrayerTimetable
          prayerTime={pt}
          ptLabelsToShow={ptLabels}
        />
        <div className="w-[148vh] h-screen">
          <ImageCarousel />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
