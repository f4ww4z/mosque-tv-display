"use client"

import { getExtension } from "lib/string"
import moment from "moment-timezone"
import Image from "next/image"
import { useEffect, useState } from "react"
import AnalogClock from "react-clock"
import Carousel from "react-multi-carousel"
import { CarouselItem } from "types/carousel"

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 0 },
    items: 1,
  },
}

const worldTimezones = [
  {
    city: "Makkah",
    timezone: "Asia/Riyadh",
  },
  {
    city: "Madinah",
    timezone: "Asia/Riyadh",
  },
  {
    city: "Jakarta",
    timezone: "Asia/Jakarta",
  },
  {
    city: "Dubai",
    timezone: "Asia/Dubai",
  },
  {
    city: "Istanbul",
    timezone: "Europe/Istanbul",
  },
  {
    city: "Islamabad",
    timezone: "Asia/Karachi",
  },
]

interface WorldClock {
  city: string
  time: Date
}

const WorldClocksCard = () => {
  const [worldClocks, setWorldClocks] = useState<WorldClock[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const clocks = worldTimezones.map((wc) => ({
        city: wc.city,
        time: new Date(moment().tz(wc.timezone).format("YYYY-MM-DDTHH:mm:ss")),
      }))
      setWorldClocks(clocks)

      // console.log(clocks)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      key="world-clock-card"
      className="flex flex-wrap items-center justify-center w-full h-full py-1"
      style={{
        backgroundImage: "url('/clock_background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {worldClocks.map((wc) => (
        <div
          key={wc.city}
          className="mx-6"
        >
          <AnalogClock
            key={wc.city}
            className="bg-white rounded-full drop-shadow-2xl"
            value={wc.time}
            size={200}
            hourHandWidth={10}
            minuteHandWidth={6}
            secondHandWidth={2}
          />
          <p className="mt-2 text-3xl font-bold text-center uppercase drop-shadow-2xl">
            {wc.city}
          </p>
        </div>
      ))}
    </div>
  )
}

const Card = (item: CarouselItem) => {
  const ext = getExtension(item.filename)
  return (
    <>
      {["mp4", "mov", "avi"].includes(ext) ? (
        <video
          className="w-full h-auto"
          src={`/api/carousel/${item.filename}`}
          autoPlay
          loop
          muted
        />
      ) : (
        <Image
          className="w-full h-auto"
          src={`/api/carousel/${item.filename}`}
          alt={item.filename}
          width={1920}
          height={1080}
        />
      )}
    </>
  )
}

const DisplayCarousel = ({
  items,
  loading,
}: {
  items: CarouselItem[]
  loading: boolean
}) => {
  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <Carousel
      responsive={responsive}
      ssr
      infinite
      autoPlay
      showDots
      autoPlaySpeed={25000}
      arrows={false}
      swipeable
      draggable
      pauseOnHover
    >
      <WorldClocksCard />
      {items.map((a) => (
        <Card
          key={a.title}
          {...a}
        />
      ))}
    </Carousel>
  )
}

export default DisplayCarousel
