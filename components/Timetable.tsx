"use client"

import { PrayerTime } from "types/prayer"

interface PrayerTimeCardProps {
  ptLabel: string
  time: string
}

const PrayerTimeCard = ({ ptLabel, time }: PrayerTimeCardProps) => {
  return (
    <div className="flex flex-col items-center gap-1 p-4 text-white border-4 drop-shadow-2xl bg-gradient-to-br from-teal-700 to-cyan-700 rounded-2xl">
      <p className="text-3xl font-medium">{ptLabel}</p>
      <p className="text-5xl font-bold">{time.substring(0, time.length - 3)}</p>
    </div>
  )
}

interface TimetableProps {
  prayerTime?: PrayerTime
  ptLabelsToShow?: string[]
}

const Timetable = ({ prayerTime, ptLabelsToShow }: TimetableProps) => {
  if (!prayerTime) {
    return <p>Loading...</p>
  }

  return (
    <div className="flex flex-col gap-3 px-3 py-8 text-center">
      {ptLabelsToShow.map((ptLabel, index) => (
        <PrayerTimeCard
          key={index}
          ptLabel={ptLabel}
          time={prayerTime[ptLabel.toLowerCase()]}
        />
      ))}
    </div>
  )
}

export default Timetable
