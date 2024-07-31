import Image from "next/image"

const LoadingIndicator = () => (
  <div className="flex justify-center w-30 h-30 animate-spin">
    <Image
      src="/loading indicator teal.png"
      alt="loading"
      width={30}
      height={30}
      priority
    />
  </div>
)

export default LoadingIndicator
