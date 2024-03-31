"use client"

import { Inter } from "next/font/google"

import "@/globals.css"
import "react-multi-carousel/lib/styles.css"

import { SessionProvider, signOut } from "next-auth/react"
import { IoMdSettings } from "react-icons/io"
import { MdLogout, MdOutlineViewCarousel } from "react-icons/md"
import { VscThreeBars } from "react-icons/vsc"
import { ToastContainer } from "react-toastify"

const inter = Inter({ subsets: ["latin"] })

const AdminNavbar = () => {
  return (
    <nav className="fixed z-50 w-full h-16 p-4 text-white bg-cyan-700">
      <ul className="flex justify-between w-full">
        <li className="px-2 py-1 text-2xl transition rounded-md hover:bg-cyan-900 hover:cursor-pointer">
          <VscThreeBars />
        </li>
        <li
          className="flex items-center px-2 py-1 text-2xl transition rounded-md flex-nowrap hover:bg-cyan-900 hover:cursor-pointer"
          onClick={() => {
            signOut()
          }}
        >
          <MdLogout />
          <span className="ml-2 text-base">Logout</span>
        </li>
      </ul>
    </nav>
  )
}

const scrollTo = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

const AdminSidebar = () => {
  return (
    <nav className="flex h-auto text-white w-52 bg-cyan-800">
      <ul className="w-full">
        <li
          className="flex items-center w-full px-4 py-3 transition flex-nowrap hover:bg-teal-700 hover:cursor-pointer"
          onClick={() => {
            scrollTo("carousel")
          }}
        >
          <span className="mr-2 text-4xl">
            <MdOutlineViewCarousel />
          </span>
          <span className="text-md">Carousel</span>
        </li>
        <li
          className="flex items-center w-full px-4 py-3 transition flex-nowrap hover:bg-teal-700 hover:cursor-pointer"
          onClick={() => {
            scrollTo("#settings")
          }}
        >
          <span className="mr-2 text-4xl">
            <IoMdSettings />
          </span>
          <span className="text-md">Settings</span>
        </li>
      </ul>
    </nav>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <SessionProvider>
        <body className={inter.className}>
          <ToastContainer />
          <AdminNavbar />
          <div className="flex w-full pt-16">
            <AdminSidebar />
            <div className="flex w-full">{children}</div>
          </div>
        </body>
      </SessionProvider>
    </html>
  )
}
