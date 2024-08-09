import { ReactNode, useRef } from "react"
import { RxCross1 } from "react-icons/rx"

export interface ModalProps {
  show?: boolean
  children: ReactNode
  onClose?: () => void
}

const Modal = ({ show, onClose, children }: ModalProps) => {
  const innerDivRef = useRef(null)

  const isClickInsideInnerDiv = (clientX: number, clientY: number) => {
    if (innerDivRef.current) {
      const rect = innerDivRef.current.getBoundingClientRect()
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      )
    }
    return false
  }

  return (
    <div
      className={`fixed z-[100] left-0 top-0 pointer-events-none flex items-center justify-center w-screen h-screen bg-black/80 transition duration-500 ${
        show ? "opacity-100 pointer-events-auto" : "opacity-0"
      }`}
      onClick={(event) => {
        // check if mouse click inside innerDivRef
        if (!isClickInsideInnerDiv(event.clientX, event.clientY)) {
          onClose()
        }
      }}
    >
      <div
        className="relative p-1 mx-1 bg-white border-2 rounded-lg dark:bg-primary-darker"
        ref={innerDivRef}
      >
        <div
          className="absolute transition right-2 top-2 hover:text-yellow hover:cursor-pointer"
          onClick={() => onClose()}
        >
          <span className="text-3xl">
            <RxCross1 />
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
