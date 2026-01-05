import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { PiClockCountdownFill } from "react-icons/pi"

const IqamahCountdown = ({
  theme,
  timeUntilIqamah,
  timeUntilPrayerEnds,
  prayerTime,
  togglePrayerMode,
}: {
  theme: string
  timeUntilIqamah: number
  timeUntilPrayerEnds: number
  prayerTime?: string // in "HH:mm" format
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

    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
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

  if (secondsLeftUntilIqamah <= 0) {
    return null
  }

  return (
    <div
      className={`absolute z-10 flex flex-col items-center justify-center px-8 py-4 border-4 border-white rounded-lg bg-${theme}-dark left-[100px] top-[50px]`}
    >
      <p className="text-5xl font-bold uppercase">Time to Iqamah</p>
      <div className="flex items-center gap-4 flex-nowrap">
        <PiClockCountdownFill className="mt-2 text-8xl text-red-light" />
        <span className="font-sans text-9xl font-bold text-red-light">
          {getIqamahTimeLeftFormatted()}
        </span>
      </div>
    </div>
  )
}

export default IqamahCountdown
