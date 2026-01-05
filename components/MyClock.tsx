"use client"

import moment from "moment"
import { useState, useEffect } from "react"

const MyClock = ({
  theme,
  hourFormat = 24,
}: {
  theme: string
  hourFormat?: number
}) => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const is12Hour = hourFormat === 12
  const timeString = moment(time)
    .utcOffset(8)
    .format(is12Hour ? "hh:mm" : "HH:mm")
  const period = is12Hour ? moment(time).utcOffset(8).format("A") : null

  return (
    <div
      className={`flex items-center justify-center px-4 py-2 text-center bg-${theme}-lighter gap-2`}
    >
      <p className="m-0 font-sans font-bold text-amber-100 text-6xl">
        {timeString}
      </p>
      {period && (
        <p className="m-0 font-sans font-bold text-amber-100 text-2xl">
          {period}
        </p>
      )}
    </div>
  )
}

export default MyClock
