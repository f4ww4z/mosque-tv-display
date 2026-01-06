"use client"

import { useEffect, useState } from "react"

const AzanAnnouncement = ({
  theme,
  prayerName,
  duration,
  onComplete,
}: {
  theme: string
  prayerName: string
  duration: number // in seconds
  onComplete: () => void
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(duration)
  const [isFlashing, setIsFlashing] = useState<boolean>(true)

  useEffect(() => {
    setSecondsLeft(duration)
  }, [duration])

  useEffect(() => {
    // Flash animation interval (500ms on/off)
    const flashInterval = setInterval(() => {
      setIsFlashing((prev) => !prev)
    }, 500)

    // Countdown interval
    const countdownInterval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          clearInterval(flashInterval)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(flashInterval)
      clearInterval(countdownInterval)
    }
  }, [duration, onComplete])

  return (
    <div
      className={`absolute inset-0 z-20 w-full h-full flex flex-col items-center justify-center transition-all duration-500 ${
        isFlashing
          ? `bg-gradient-to-br from-${theme}-darker via-${theme}-dark to-${theme}-darker`
          : "bg-white"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-12 p-16 animate-pulse">
        {/* AZAN Text */}
        <div
          className={`text-[12rem] font-black uppercase tracking-wider drop-shadow-2xl transition-colors duration-500 ${
            isFlashing ? "text-white" : `text-${theme}-darker`
          }`}
        >
          AZAN
        </div>

        {/* Prayer Time Message */}
        <div
          className={`text-7xl font-bold text-center transition-colors duration-500 ${
            isFlashing ? "text-white" : `text-${theme}-darker`
          }`}
        >
          Sekarang Telah Masuk Waktu Solat
        </div>

        {/* Prayer Name */}
        <div
          className={`text-[10rem] font-black uppercase tracking-wide drop-shadow-2xl transition-colors duration-500 ${
            isFlashing ? `text-${theme}-lighter` : `text-${theme}-dark`
          }`}
        >
          {prayerName}
        </div>
      </div>
    </div>
  )
}

export default AzanAnnouncement
