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

  // Calculate dynamic sizes based on number of clocks
  const numClocks = worldClocks.length
  let clockSize = 300
  let textSizeClass = "text-5xl"
  let marginClass = "mx-6 my-4"
  let borderWidth = 8
  let hourHandWidth = 10
  let minuteHandWidth = 6
  let secondHandWidth = 2

  if (numClocks <= 2) {
    clockSize = 300
    textSizeClass = "text-5xl"
    marginClass = "mx-8 my-6"
    borderWidth = 8
    hourHandWidth = 10
    minuteHandWidth = 6
    secondHandWidth = 2
  } else if (numClocks <= 3) {
    clockSize = 240
    textSizeClass = "text-4xl"
    marginClass = "mx-6 my-4"
    borderWidth = 7
    hourHandWidth = 9
    minuteHandWidth = 5
    secondHandWidth = 2
  } else if (numClocks <= 4) {
    clockSize = 220
    textSizeClass = "text-3xl"
    marginClass = "mx-5 my-4"
    borderWidth = 6
    hourHandWidth = 8
    minuteHandWidth = 5
    secondHandWidth = 2
  } else if (numClocks <= 6) {
    clockSize = 180
    textSizeClass = "text-2xl"
    marginClass = "mx-4 my-3"
    borderWidth = 5
    hourHandWidth = 7
    minuteHandWidth = 4
    secondHandWidth = 1
  } else if (numClocks <= 8) {
    clockSize = 140
    textSizeClass = "text-xl"
    marginClass = "mx-3 my-2"
    borderWidth = 4
    hourHandWidth = 6
    minuteHandWidth = 3
    secondHandWidth = 1
  } else {
    clockSize = 120
    textSizeClass = "text-lg"
    marginClass = "mx-2 my-2"
    borderWidth = 3
    hourHandWidth = 5
    minuteHandWidth = 3
    secondHandWidth = 1
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
      <div className="w-full flex flex-wrap items-center justify-center h-[76vh] gap-y-2">
        {worldClocks.map((wc) => (
          <div
            key={wc.city}
            className={marginClass}
          >
            <div
              className="inline-block border-white rounded-full drop-shadow-2xl"
              style={{ borderWidth: `${borderWidth}px` }}
            >
              <AnalogClock
                key={wc.city}
                className={`rounded-full bg-${theme}-dark/50`}
                value={wc.time}
                size={clockSize}
                hourHandWidth={hourHandWidth}
                minuteHandWidth={minuteHandWidth}
                secondHandWidth={secondHandWidth}
              />
            </div>
            <p
              className={`mt-2 ${textSizeClass} font-bold text-center drop-shadow-2xl`}
            >
              {wc.city}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorldClocksCard
