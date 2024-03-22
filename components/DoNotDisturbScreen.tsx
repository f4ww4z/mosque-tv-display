import Image from "next/image"

const DoNotDisturbScreen = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="absolute z-50 flex items-center justify-center w-screen h-screen pb-3 text-white bg-black"
    >
      <Image
        src="/mode solat.jpg"
        alt="Do Not Disturb"
        width={1920}
        height={1080}
        className="w-auto h-full"
      />
    </div>
  )
}

export default DoNotDisturbScreen
