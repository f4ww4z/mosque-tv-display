"use client"

import { Inter } from "next/font/google"

import "react-multi-carousel/lib/styles.css"
import "react-toastify/dist/ReactToastify.css"
import "@/globals.css"

import { SessionProvider } from "next-auth/react"
import { ToastContainer } from "react-toastify"

const inter = Inter({ subsets: ["latin"] })

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
          {children}
        </body>
      </SessionProvider>
    </html>
  )
}
