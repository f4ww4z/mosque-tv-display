"use client"

import moment from "moment"
import { useEffect, useRef, useState } from "react"

const IqamahCountdown = ({
  theme,
  timeUntilIqamah,
  timeUntilPrayerEnds,
  prayerTime,
  prayerName,
  togglePrayerMode,
}: {
  theme: string
  timeUntilIqamah: number
  timeUntilPrayerEnds: number
  prayerTime?: string // in "HH:mm" format
  prayerName?: string
  togglePrayerMode: (on: boolean) => void
}) => {
  const [secondsLeftUntilIqamah, setSecondsLeftUntilIqamah] =
    useState<number>(-1)
  const [secondsLeftUntilPrayerEnds, setSecondsLeftUntilPrayerEnds] =
    useState<number>(-1)

  const getIqamahTimeLeftFormatted = () => {
    if (!prayerTime || secondsLeftUntilIqamah <= 0) {
      return null
    }

    const minutes = Math.floor(secondsLeftUntilIqamah / 60)
    const seconds = secondsLeftUntilIqamah % 60

    return { minutes, seconds }
  }

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/sounds/notif1.wav")
  }, [])

  useEffect(() => {
    if (!prayerTime) {
      return
    }

    const interval = setInterval(() => {
      setSecondsLeftUntilIqamah(
        moment(prayerTime, "HH:mm")
          .add(timeUntilIqamah, "minutes")
          .diff(moment(), "seconds")
      )

      setSecondsLeftUntilPrayerEnds(
        moment(prayerTime, "HH:mm")
          .add(timeUntilIqamah, "minutes")
          .add(timeUntilPrayerEnds, "minutes")
          .diff(moment(), "seconds")
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [prayerTime])

  useEffect(() => {
    if (secondsLeftUntilIqamah === 0) {
      if (audioRef.current) {
        audioRef.current.play()
      }
    }

    if (secondsLeftUntilIqamah <= 0) {
      if (secondsLeftUntilPrayerEnds <= 0) {
        togglePrayerMode(false)
      } else {
        togglePrayerMode(true)
      }
    }
  }, [secondsLeftUntilIqamah])

  if (!prayerTime || secondsLeftUntilIqamah >= timeUntilIqamah * 60) {
    return null
  }

  if (secondsLeftUntilIqamah <= 0 || !prayerName) {
    return null
  }

  const timeLeft = getIqamahTimeLeftFormatted()

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
            IQAMAH {prayerName.toUpperCase()}
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

export default IqamahCountdown
