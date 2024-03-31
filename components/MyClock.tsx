"use client"

import moment from "moment"
import { useState, useEffect } from "react"

const MyClock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <p className="m-0 font-bold text-amber-100 text-8xl drop-shadow-2xl">
      {moment(time).utcOffset(8).format("HH:mm")}
    </p>
  )
}

export default MyClock
