"use client"

import moment from "moment"
import { useEffect, useState } from "react"
import { PiClockCountdownFill } from "react-icons/pi"

const AzanCountdown = ({
  theme,
  minutesBeforeAzan,
  nextPrayerTime,
  nextPrayerName,
}: {
  theme: string
  minutesBeforeAzan: number
  nextPrayerTime?: string // in "HH:mm" format
  nextPrayerName?: string
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(-1)
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false)

  const getTimeLeftFormatted = () => {
    if (secondsLeft <= 0) {
      return null
    }

    const minutes = Math.floor(secondsLeft / 60)
    const seconds = secondsLeft % 60

    return { minutes, seconds }
  }

  useEffect(() => {
    if (!nextPrayerTime) {
      return
    }

    const interval = setInterval(() => {
      const secondsUntilPrayer = moment(nextPrayerTime, "HH:mm").diff(
        moment(),
        "seconds"
      )

      setSecondsLeft(secondsUntilPrayer)

      // Check if we should show countdown (within X minutes before Azan)
      const shouldShowCountdown =
        secondsUntilPrayer > 0 && secondsUntilPrayer <= minutesBeforeAzan * 60

      setIsCountdownActive(shouldShowCountdown)
    }, 1000)

    return () => clearInterval(interval)
  }, [nextPrayerTime, minutesBeforeAzan])

  if (!isCountdownActive || !nextPrayerName) {
    return null
  }

  const timeLeft = getTimeLeftFormatted()

  if (!timeLeft) {
    return null
  }

  return (
    <div
      className={`absolute inset-0 z-10 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-${theme}-darker via-${theme}-dark to-${theme}-darker`}
    >
      <div
        className={`flex flex-col items-center justify-center gap-8 p-12 border-8 border-white rounded-3xl shadow-2xl bg-${theme}-dark/50 backdrop-blur-sm`}
      >
        {/* Title */}
        <div className="text-center">
          <p
            className={`text-8xl font-black text-${theme}-lighter uppercase tracking-wide drop-shadow-lg`}
          >
            AZAN {nextPrayerName.toUpperCase()}
          </p>
        </div>

        {/* Countdown Display */}
        <div className="flex items-center justify-center gap-8 mt-8 flex-nowrap">
          <div className="flex items-center gap-6">
            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div
                className={`bg-white rounded-2xl shadow-2xl px-12 py-8 min-w-[200px] border-4 border-${theme}-lighter`}
              >
                <span
                  className={`font-mono text-[10rem] font-black leading-none text-${theme}-darker`}
                >
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-4 text-5xl font-bold text-white uppercase tracking-wider">
                Minit
              </p>
            </div>

            {/* Separator */}
            <span className="text-[10rem] font-black text-white leading-none mb-16">
              :
            </span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div
                className={`bg-white rounded-2xl shadow-2xl px-12 py-8 min-w-[200px] border-4 border-${theme}-lighter`}
              >
                <span
                  className={`font-mono text-[10rem] font-black leading-none text-${theme}-darker`}
                >
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-4 text-5xl font-bold text-white uppercase tracking-wider">
                Saat
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AzanCountdown
