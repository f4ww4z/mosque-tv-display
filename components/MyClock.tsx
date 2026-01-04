"use client"

import moment from "moment"
import { useState, useEffect } from "react"

const MyClock = ({ theme, hourFormat = 24 }: { theme: string; hourFormat?: number }) => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatString = hourFormat === 12 ? "hh:mm A" : "HH:mm"

  return (
    <div
      className={`flex items-center justify-center px-4 py-2 text-center bg-${theme}-lighter`}
    >
      <p className="m-0 font-sans font-bold text-amber-100 text-6xl">
        {moment(time).utcOffset(8).format(formatString)}
      </p>
    </div>
  )
}

export default MyClock
