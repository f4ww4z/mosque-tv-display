"use client"

import Carousel from "react-multi-carousel"

const responsive = {
  desktop: {
    breakpoint: { max: 5000, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
}

interface CardContentProps {
  id: number
  imageUrl: string
}

const cardContent: Array<CardContentProps> = [
  {
    id: 2,
    imageUrl: "/hero/display 1.png",
  },
  {
    id: 3,
    imageUrl: "/hero/display 2.png",
  },
  {
    id: 4,
    imageUrl: "/hero/display 3.png",
  },
  {
    id: 5,
    imageUrl: "/hero/display 4.png",
  },
  {
    id: 6,
    imageUrl: "/hero/infaq collection screen.png",
  },
]

const Card = ({ imageUrl }: CardContentProps) => {
  return (
    <div
      className="h-[calc(200px_+_20vw)] sm:h-[calc(300px_+_20vw)] lg:h-[440px]"
      style={{
        backgroundImage: `url("${imageUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>
  )
}

const HeroCarousel = () => {
  return (
    <Carousel
      responsive={responsive}
      ssr
      infinite
      autoPlay
      autoPlaySpeed={5000}
      swipeable
      draggable
    >
      {cardContent.map((c) => (
        <Card
          key={c.id}
          {...c}
        />
      ))}
    </Carousel>
  )
}

export default HeroCarousel
