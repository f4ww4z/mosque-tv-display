"use client"

import { useState } from "react"

interface SwitchProps {
  onChange: (on: boolean) => void
}

const Switch = ({ onChange }: SwitchProps) => {
  const [on, setOn] = useState(false)

  return (
    <div
      className={`relative h-8 p-2 border-white rounded-full bg-primary-dark w-14 hover:cursor-pointer transition ${on && "bg-primary-lighter"}`}
      onClick={() => {
        setOn(!on)
        onChange(!on)
      }}
    >
      <button
        className={`absolute left-0 w-5 h-5 mx-2 transition origin-center transform -translate-y-1/2 bg-white rounded-full top-1/2 ${on && "translate-x-6"}`}
      ></button>
    </div>
  )
}

export default Switch
