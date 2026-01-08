"use client"

import moment from "moment"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

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
  const [time, setTime] = useState(new Date())
  const onCompleteRef = useRef(onComplete)

  // Update ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Auto-complete after duration
    const timer = setTimeout(() => {
      onCompleteRef.current()
    }, duration * 1000)

    return () => clearTimeout(timer)
  }, [duration]) // Only depend on duration, not onComplete

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen text-gray-300 bg-black">
      <p className="absolute w-full text-2xl font-semibold text-center bottom-14 z-10">
        {moment(time).format("HH:mm")}
      </p>
      <Image
        src="/mode azan.jpg"
        alt="Azan Announcement"
        fill
        className="object-cover"
        priority
      />
    </div>
  )
}

export default AzanAnnouncement
