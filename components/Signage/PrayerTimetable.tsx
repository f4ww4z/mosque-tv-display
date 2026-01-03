"use client"

import Shimmer from "components/Shimmer"
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { PrayerTimeResponse } from "types/prayer"
import IqamahCountdown from "./IqamahCountdown"

interface PrayerTimeCardProps {
  theme: string
  ptLabel: string
  time: string
  isCurrentPrayer?: boolean
  shouldFlash?: boolean
  loading: boolean
}

const PrayerTimeCard = ({
  theme,
  ptLabel,
  time,
  isCurrentPrayer,
  shouldFlash,
  loading,
}: PrayerTimeCardProps) => {
  return (
    <div
      className={`${isCurrentPrayer ? "text-accent" : "text-white"} flex flex-col items-center px-2 py-1.5 border-b-3 border-${theme}-lighter bg-${theme}-dark`}
    >
      <p className="text-xl font-medium">{ptLabel}</p>
      {loading ? (
        <Shimmer h={40} />
      ) : (
        <p
          className={`font-sans text-4xl font-bold transition transform ${isCurrentPrayer && shouldFlash && "animate-ping"}`}
        >
          {time}
        </p>
      )}
    </div>
  )
}

const PrayerTimetable = ({
  theme,
  lang,
  prayerTime,
  azanAudioPath,
  timeUntilIqamah,
  timeUntilPrayerEnds,
  togglePrayerMode,
}: {
  theme: string
  lang: string
  prayerTime?: PrayerTimeResponse
  azanAudioPath: string
  timeUntilIqamah: number
  timeUntilPrayerEnds: number
  togglePrayerMode: (on: boolean) => void
}) => {
  const [time, setTime] = useState(new Date())
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false)
  const [shouldFlash, setShouldFlash] = useState(false)

  const ptLabels = {
    en: ["Fajr", "Syuruk", "Dhuhr", "Asr", "Maghrib", "Isha"],
    ms: ["Subuh", "Syuruk", "Zohor", "Asar", "Maghrib", "Isyak"],
    id: ["Subuh", "Syuruk", "Dzuhur", "Ashar", "Maghrib", "Isya"],
  }

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio(azanAudioPath)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!prayerTime || !audioRef.current) {
      return
    }

    // Check if the current time is equal to any of the prayer times
    const currentTime = moment(time).format("HH:mm")
    const ptLabelsEn = ptLabels.en

    for (let i = 0; i < ptLabelsEn.length; i++) {
      if (ptLabelsEn[i].toLowerCase() === "syuruk") {
        // Skip syuruk as it is not a prayer time
        continue
      }

      const ptLabelEn = ptLabelsEn[i]
      const ptTime = prayerTime[ptLabelEn.toLowerCase()]

      // console.log(`prayer time: ${ptTime}, current time: ${currentTime}`)
      if (ptTime === currentTime) {
        // If the current time is equal to the prayer time, play the notification sound
        if (!hasPlayedAudio) {
          audioRef.current.play()
          setHasPlayedAudio(true)
          setShouldFlash(true)
        }

        // console.log("should flash now: ", shouldFlash)
      }
    }
  }, [time, prayerTime, audioRef.current])

  useEffect(() => {
    if (!hasPlayedAudio) {
      return
    }

    // after 1 minute, reset the shouldFlash and hasPlayedAudio state
    const timeout = setTimeout(() => {
      setHasPlayedAudio(false)
      setShouldFlash(false)
    }, 60000)

    return () => clearTimeout(timeout)
  }, [hasPlayedAudio])

  // Calculate the latest prayer that has passed
  const getCurrentPrayerIndex = () => {
    if (!prayerTime) {
      return 0
    }

    const ptLabelsEn = ptLabels.en

    for (let i = ptLabelsEn.length - 1; i >= 0; i--) {
      // If the prayer has started, return the current prayer
      const ptLabelEn = ptLabelsEn[i]

      const ptTime = moment(prayerTime[ptLabelEn.toLowerCase()], "HH:mm")
      const hasPrayerStarted = moment(time).isAfter(ptTime)

      if (hasPrayerStarted) {
        return i
      }
    }

    return 0
  }

  return (
    <>
      <div className="flex flex-col text-center">
        {ptLabels[lang].map((ptLabel: string, index: number) => {
          // A prayer is the current one if its index matches the current prayer index
          const isCurrentPrayer = index === getCurrentPrayerIndex()

          const ptLabelEn = ptLabels.en[index]

          // console.log("should flash: ", shouldFlash)

          return (
            <PrayerTimeCard
              key={index}
              theme={theme}
              ptLabel={ptLabel}
              time={prayerTime?.[ptLabelEn.toLowerCase()]}
              isCurrentPrayer={isCurrentPrayer}
              shouldFlash={shouldFlash}
              loading={!prayerTime}
            />
          )
        })}
      </div>

      {ptLabels.en[getCurrentPrayerIndex()].toLowerCase() !== "syuruk" && (
        <IqamahCountdown
          theme={theme}
          timeUntilIqamah={timeUntilIqamah}
          timeUntilPrayerEnds={timeUntilPrayerEnds}
          prayerTime={
            prayerTime?.[ptLabels.en[getCurrentPrayerIndex()].toLowerCase()]
          }
          togglePrayerMode={(on) => togglePrayerMode(on)}
        />
      )}
    </>
  )
}

export default PrayerTimetable
