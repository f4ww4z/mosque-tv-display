import { useState, useEffect } from "react"

interface ScreenSize {
  width: number
  height: number
}

interface ScreenSizeReturn {
  screenSize: ScreenSize
  isMobile: boolean
}

export const mobileThreshold = 575

const useScreenSize = (): ScreenSizeReturn => {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: 0,
    height: 0,
  })

  const [isMobile, setIsMobile] = useState<boolean>(true)

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth
      setScreenSize({
        width: newWidth,
        height: window.innerHeight,
      })
      setIsMobile(newWidth < mobileThreshold)
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return { screenSize, isMobile }
}

export default useScreenSize
