"use client"

import fetchJson from "lib/fetchJson"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FaMosque } from "react-icons/fa"
import { toast } from "react-toastify"
import { CarouselItem } from "types/carousel"
import { PrayerTime } from "types/prayer"
import DateAndHijri from "./DateAndHijri"
import DisplayCarousel from "./DisplayCarousel"
import DoNotDisturbScreen from "./DoNotDisturbScreen"
import MyClock from "./MyClock"
import PrayerTimetable from "./PrayerTimetable"

const ptLabels = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]

const Dashboard = () => {
  const [pt, setPrayerTimes] = useState<PrayerTime>()
  const [settings, setSettings] = useState<Setting[]>([])
  const [doNotDisturb, setDoNotDisturb] = useState<boolean>(false)
  const [items, setItems] = useState<CarouselItem[]>([])
  const [carouselLoading, setCarouselLoading] = useState<boolean>(false)

  const fetchCarouselData = async () => {
    setCarouselLoading(true)

    try {
      let data = await fetchJson<CarouselItem[]>("/api/carousel")

      if (data.length === 0) {
        throw new Error("No display images found.")
      }

      data = data.filter((item) => !item.hidden)

      setItems(data)
    } catch (error) {
      toast.error(
        error.message ?? "An error occurred while fetching carousels."
      )
    }

    setCarouselLoading(false)
  }

  const fetchCarouselDataEvery12Hours = async () => {
    const currentDate = new Date()
    const currentHour = currentDate.getHours()
    const currentMinute = currentDate.getMinutes()
    if (currentHour === 12 && currentMinute === 0) {
      fetchCarouselData()
    }
  }

  const fetchSettings = async () => {
    try {
      const data = await fetchJson<Setting[]>("/api/settings")

      setSettings(data)
    } catch (error) {
      // console.log(error)
      toast.error(error.message ?? "An error occurred while fetching settings.")
    }
  }

  const fetchJAKIMData = async () => {
    try {
      const data = await fetchJson<PrayerTime>(`/api/prayer`, {
        method: "POST",
        body: JSON.stringify({ date: new Date() }),
      })

      setPrayerTimes(data)

      // console.log(data)
    } catch (error) {
      // console.log(error)
      toast.error(
        error.message ?? "An error occurred while fetching JAKIM prayer times."
      )
    }
  }

  useEffect(() => {
    fetchJAKIMData()
    fetchSettings()
    fetchCarouselData()

    const interval = setInterval(() => {
      fetchJAKIMData()
      fetchSettings()
      fetchCarouselDataEvery12Hours()
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (settings.length === 0) {
      return
    }

    const interval = setInterval(() => {
      try {
        const timeToIqamah = Number(
          settings.find((s) => s.name === "Time until iqamah (mins)").value
        )

        console.log(timeToIqamah)

        const prayerModeDurationAfterIqamah = Number(
          settings.find(
            (s) => s.name === "Prayer mode duration after iqamah (mins)"
          ).value
        )

        const prayerModeDurationTarawih = Number(
          settings.find((s) => s.name === "Prayer mode duration tarawih (mins)")
            .value
        )
      } catch (error) {
        console.log(error)
        toast.error("An error occurred while applying settings.")
      }
    }, 1000)
  }, [settings])

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
        <MyClock />
        <Link
          href="/login"
          className="flex flex-col flex-end"
        >
          <p className="flex items-end text-xl font-bold text-white">
            <span className="text-3xl">
              <FaMosque />
            </span>
            <span className="ml-2">
              Surau Al-Mustaqim, Metropolitan Square, Damansara Perdana 47820
            </span>
          </p>
          <DateAndHijri pt={pt} />
        </Link>
      </div>

      <div className="flex items-start justify-center w-full flex-nowrap">
        <PrayerTimetable
          prayerTime={pt}
          ptLabelsToShow={ptLabels}
        />
        <div className="w-[148vh] h-screen">
          <DisplayCarousel
            items={items}
            loading={carouselLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
