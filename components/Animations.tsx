"use client"

import React, { FC, ReactNode } from "react"
import { Slide, Fade, Zoom } from "react-awesome-reveal"

interface SlideAndFadeProps {
  className?: string
  delay?: number
  duration: number
  direction: "left" | "right" | "up" | "down"
  cascade?: boolean
  damping?: number
  triggerOnce?: boolean
  children?: ReactNode
}

interface ZoomAndFadeProps {
  className?: string
  delay?: number
  duration?: number
  cascade?: boolean
  triggerOnce?: boolean
  children?: ReactNode
}

export const SlideAndFade: FC<SlideAndFadeProps> = ({
  className,
  delay,
  duration,
  direction,
  cascade,
  damping,
  triggerOnce,
  children,
}) => {
  return (
    <Slide
      className={className}
      cascade={cascade}
      damping={damping}
      duration={duration}
      direction={direction}
      delay={delay ?? 0}
      triggerOnce={triggerOnce}
    >
      <Fade
        cascade={cascade}
        duration={duration}
        delay={delay}
        triggerOnce={triggerOnce}
      >
        {children}
      </Fade>
    </Slide>
  )
}
export const ZoomAndFade: FC<ZoomAndFadeProps> = ({
  className,
  delay,
  duration,
  cascade,
  triggerOnce,
  children,
}) => {
  return (
    <Zoom
      className={className}
      duration={duration ?? 1500}
      delay={delay ?? 0}
      triggerOnce={triggerOnce}
    >
      <Fade
        duration={duration}
        delay={delay ?? 0}
        cascade={cascade}
        triggerOnce={triggerOnce}
      >
        {children}
      </Fade>
    </Zoom>
  )
}
