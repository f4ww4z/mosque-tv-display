"use client"

import LoadingIndicator from "components/LoadingIndicator"
import { getExtension } from "lib/string"
import Image from "next/image"
import Carousel from "react-multi-carousel"
import { CarouselItem } from "types/carousel"
import WorldClocksCard from "./WorldClocks"
import { MasjidWorldClocksResponse } from "types/masjid"

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 0 },
    items: 1,
  },
}

const Card = ({
  masjidId,
  filename,
}: {
  masjidId: string
  filename: string
}) => {
  const ext = getExtension(filename)
  return (
    <>
      {["mp4", "mov", "avi"].includes(ext) ? (
        <video
          className="w-full h-auto"
          src={`/api/masjid/${masjidId}/carousel/${filename}`}
          autoPlay
          loop
          muted
        />
      ) : (
        <Image
          className="w-full h-auto"
          src={`/api/masjid/${masjidId}/carousel/${filename}`}
          alt={filename}
          width={1920}
          height={1080}
        />
      )}
    </>
  )
}

const DisplayCarousel = ({
  theme,
  masjidId,
  items,
  loading,
  autoPlaySpeed,
  worldClocks,
}: {
  theme: string
  masjidId: string
  items: CarouselItem[]
  loading: boolean
  autoPlaySpeed: number
  worldClocks: MasjidWorldClocksResponse[]
}) => {
  if (loading) {
    return <LoadingIndicator />
  }

  return (
    <Carousel
      responsive={responsive}
      ssr
      infinite
      autoPlay
      showDots
      autoPlaySpeed={autoPlaySpeed}
      arrows={false}
      swipeable
      draggable
      pauseOnHover={false}
    >
      <WorldClocksCard
        theme={theme}
        masjidId={masjidId}
        clocks={worldClocks}
      />
      {items.map((a) => (
        <Card
          key={a.title}
          masjidId={masjidId}
          filename={a.filename}
        />
      ))}
    </Carousel>
  )
}

export default DisplayCarousel
