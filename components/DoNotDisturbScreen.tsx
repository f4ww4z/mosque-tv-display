import moment from "moment"
import Image from "next/image"
import { useEffect, useState } from "react"

const DoNotDisturbScreen = ({ onClick }: { onClick?: () => void }) => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      onClick={onClick}
      className="fixed z-50 flex items-center justify-center w-screen h-screen text-gray-300 bg-black"
    >
      <p className="absolute w-full text-2xl font-semibold text-center bottom-14">
        {moment(time).format("HH:mm")}
      </p>
      <Image
        src="/mode solat.png"
        alt="Do Not Disturb"
        width={1920}
        height={1080}
        className="w-auto h-full"
      />
    </div>
  )
}

export default DoNotDisturbScreen
