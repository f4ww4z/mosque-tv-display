"use client"

import moment from "moment"
import { useEffect, useState } from "react"
import { PrayerTime } from "types/prayer"

interface PrayerTimeCardProps {
  ptLabel: string
  time: string
  nextPrayer?: boolean
}

const PrayerTimeCard = ({ ptLabel, time, nextPrayer }: PrayerTimeCardProps) => {
  return (
    <div
      className={`${nextPrayer ? "bg-gradient-to-br from-amber-700 to-orange-700" : "bg-gradient-to-br from-teal-700 to-cyan-700"} flex flex-col items-center px-4 py-2 mb-2 text-white border-4 drop-shadow-2xl rounded-2xl`}
    >
      <p className="text-2xl font-medium">{ptLabel}</p>
      <p className="text-4xl font-bold">{time.substring(0, time.length - 3)}</p>
    </div>
  )
}

interface TimetableProps {
  prayerTime?: PrayerTime
  ptLabelsToShow?: string[]
}

const PrayerTimetable = ({ prayerTime, ptLabelsToShow }: TimetableProps) => {
  const [time, setTime] = useState(new Date())

  const isPrayerNotStarted = (ptLabel: string) => {
    const nextPrayerTime = moment(
      prayerTime[ptLabel.toLowerCase()],
      "HH:mm"
    ).toDate()

    return time.getTime() < nextPrayerTime.getTime()
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!prayerTime) {
    return <p>Loading...</p>
  }

  return (
    <div className="flex flex-col px-3 py-2 text-center">
      {ptLabelsToShow.map((ptLabel, index) => {
        let isNextPrayer =
          ptLabel.toLowerCase() === "fajr" && !isPrayerNotStarted("isha")

        if (index > 0) {
          isNextPrayer =
            !isPrayerNotStarted(ptLabelsToShow[index - 1]) &&
            isPrayerNotStarted(ptLabel)
        }

        return (
          <PrayerTimeCard
            key={index}
            ptLabel={ptLabel}
            time={prayerTime[ptLabel.toLowerCase()]}
            nextPrayer={isNextPrayer}
          />
        )
      })}
    </div>
  )
}

export default PrayerTimetable
