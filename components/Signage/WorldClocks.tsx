"use client"

import moment from "moment-timezone"
import { useEffect, useState } from "react"
import AnalogClock from "react-clock"
import { MasjidWorldClocksResponse } from "types/masjid"

interface WorldClock {
  city: string
  time: Date
}

const WorldClocksCard = ({
  theme,
  masjidId,
  clocks,
}: {
  theme: string
  masjidId: string
  clocks: MasjidWorldClocksResponse[]
}) => {
  const [worldClocks, setWorldClocks] = useState<WorldClock[]>([])

  useEffect(() => {
    if (!clocks) {
      return
    }

    const interval = setInterval(() => {
      const data = clocks.map((wc) => ({
        city: wc.city,
        time: new Date(moment().tz(wc.timezone).format("YYYY-MM-DDTHH:mm:ss")),
      }))
      setWorldClocks(data)

      // console.log(clocks)
    }, 1000)
    return () => clearInterval(interval)
  }, [clocks])

  if (!clocks) {
    return null
  }

  return (
    <div
      key="world-clock-card"
      className={`relative flex flex-wrap items-center justify-center w-full h-[87vh] bg-${theme}-darker`}
      style={{
        backgroundImage: `url('/api/masjid/${masjidId}/settings/world-clocks/background')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute w-full h-full bg-black/10"></div>
      <div className="w-full flex flex-wrap items-center justify-center h-[76vh]">
        {worldClocks.map((wc) => (
          <div
            key={wc.city}
            className="mx-6"
          >
            <AnalogClock
              key={wc.city}
              className={`border-8 border-white rounded-full bg-${theme}-dark/50 drop-shadow-2xl`}
              value={wc.time}
              size={300}
              hourHandWidth={10}
              minuteHandWidth={6}
              secondHandWidth={2}
            />
            <p className="mt-2 text-5xl font-bold text-center drop-shadow-2xl">
              {wc.city}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorldClocksCard
