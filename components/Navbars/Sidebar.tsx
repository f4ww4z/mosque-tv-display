"use client"

import Link from "next/link"

interface SidebarProps {
  open: boolean
  toggle: () => void
}

interface NavbarItemProps {
  scrollTo?: string
  href?: string
  text?: string
}

export default function Sidebar({ open, toggle }: SidebarProps) {
  const NavItem = ({ href, scrollTo, text }: NavbarItemProps) =>
    href ? (
      <Link
        href={href}
        className="flex items-center justify-between p-4 transition border-b-2 hover:bg-primary-dark"
        onClick={() => toggle()}
      >
        <span className="capitalize">{text}</span>
        <span className="fas fa-chevron-right" />
      </Link>
    ) : (
      <button
        className="flex items-center justify-between p-4 transition border-b-2 hover:bg-primary-dark"
        onClick={() => {
          if (scrollTo) {
            const elem = document.querySelector(scrollTo)
            elem?.scrollIntoView({ behavior: "smooth" })
          }
          toggle()
        }}
      >
        <span className="capitalize">{text}</span>
        <span className="fas fa-chevron-right" />
      </button>
    )

  const NavbarItems = () => (
    <>
      <NavItem
        href={`/login`}
        text="Log Masuk"
      />
      <NavItem
        href={`/about`}
        text="Tentang Kami"
      />
      <NavItem
        href={`/contact-us`}
        text="Hubungi Kami"
      />
    </>
  )

  return (
    <>
      <div
        className={`${
          open ? "opacity-70" : "opacity-0 pointer-events-none"
        } fixed z-20 w-screen h-screen bg-black transition duration-700`}
        onClick={toggle}
      ></div>
      <div
        className={`${
          open ? "-translate-x-72" : "translate-x-0"
        } fixed z-30 flex flex-col h-screen text-white transition duration-700 ease-in-out bg-dark transform-gpu -right-72 drop-shadow w-72 top-[56px]`}
      >
        <NavbarItems />
      </div>
    </>
  )
}
