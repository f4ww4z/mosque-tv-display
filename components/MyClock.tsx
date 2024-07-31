"use client"

import moment from "moment"
import { useState, useEffect } from "react"

const MyClock = ({ theme }: { theme: string }) => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`flex items-center justify-center px-8 py-4 text-center bg-${theme}-lighter`}
    >
      <p className="m-0 font-sans font-bold text-amber-100 text-8xl">
        {moment(time).utcOffset(8).format("HH:mm")}
      </p>
    </div>
  )
}

export default MyClock
