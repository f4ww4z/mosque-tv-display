"use client"

import Image from "next/image"
import Carousel from "react-multi-carousel"

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 0 },
    items: 1,
  },
}

interface ImageProps {
  imageLink: string
  title: string
}

const imagesData: ImageProps[] = [
  {
    imageLink: "/api/image/3.jpg",
    title: "Marhaban ya Ramadhan",
  },
  {
    imageLink: "/api/image/4.jpg",
    title: "bacaan surah selepas maghrib",
  },
  {
    imageLink: "/api/image/5.jpg",
    title: "bacaan surah selepas subuh",
  },
  {
    imageLink: "/api/image/6.jpg",
    title: "bacaan tahlil ramadhan",
  },
  {
    imageLink: "/api/image/8.jpg",
    title: "majlis buka puasa",
  },
  {
    imageLink: "/api/image/9.jpg",
    title: "jadwal imam solat ramadhan",
  },
  {
    imageLink: "/api/image/10.jpg",
    title: "program ramadhan",
  },
  {
    imageLink: "/api/image/14.jpg",
    title: "aktiviti-aktiviti",
  },
  {
    imageLink: "/api/image/15.jpg",
    title: "aktiviti-aktiviti 2",
  },
  {
    imageLink: "/api/image/16.jpg",
    title: "niat iktikaf",
  },
  {
    imageLink: "/api/image/18.jpg",
    title: "doa untuk palestin",
  },
  {
    imageLink: "/api/image/19.jpg",
    title: "boycott israhell",
  },
]

const Card = ({ imageLink, title }: ImageProps) => {
  return (
    <Image
      className="w-full h-auto"
      src={imageLink}
      alt={title}
      width={1920}
      height={1080}
    />
  )
}

const ImageCarousel = () => {
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
      draggable={false}
    >
      {imagesData.map((a) => (
        <Card
          key={a.title}
          {...a}
        />
      ))}
    </Carousel>
  )
}

export default ImageCarousel
