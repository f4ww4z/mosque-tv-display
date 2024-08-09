"use client"

import "@/globals.css"
import "react-clock/dist/Clock.css"
import "react-multi-carousel/lib/styles.css"
import "react-phone-number-input/style.css"
import "react-toastify/dist/ReactToastify.css"

import Footer from "components/Footer"
import useScreenSize from "components/Hooks/useScreenSize"
import MasjidAdmiSidebar from "components/Navbars/MasjidAdminSidebar"
import Navbar from "components/Navbars/Navbar"
import Sidebar from "components/Navbars/Sidebar"
import { removeJWTToken } from "lib/auth"
import fetchJson from "lib/fetchJson"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import { SessionUser } from "types/user"
import { sourceSerifPro } from "lib/fonts"

const protectedPaths = ["/admin", "/masjid"]
const signagePaths = ["/demo", "/signage/*", "/events/*"]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isLoading, setIsLoading] = useState(true)

  const [user, setUser] = useState<SessionUser | undefined>()
  const [userSidebarOpen, setUserSidebarOpen] = useState(false)
  const [masjidAdminSidebarOpen, setMasjidAdminSidebarOpen] = useState(false)
  const { isMobile } = useScreenSize()

  const pathname = usePathname()
  const router = useRouter()

  const isSignagePath = () =>
    signagePaths.some((path) => {
      const regex = new RegExp(`^${path.replace("*", "\\w+")}$`)
      return regex.test(pathname)
    })

  const toggleSidebar = () => {
    setUserSidebarOpen(!userSidebarOpen)
  }

  const checkAuthentication = async () => {
    setIsLoading(true)
    setUser(undefined)
    try {
      const user = await fetchJson<SessionUser>("/api/auth/session")
      setUser(user)

      setMasjidAdminSidebarOpen(!isMobile)
      // console.log("is mobile: ", isMobile)
    } catch (error) {
      console.log("unauthenticated user")
      setMasjidAdminSidebarOpen(false)
    }

    setIsLoading(false)
  }

  const logout = async () => {
    setIsLoading(true)

    setMasjidAdminSidebarOpen(false)
    removeJWTToken()
    setUser(undefined)
    router.push("/login")

    await new Promise((resolve) => setTimeout(resolve, 400))
    toast.info("Anda telah berjaya log keluar.", {
      autoClose: 2000,
    })

    setIsLoading(false)
  }

  useEffect(() => {
    checkAuthentication()
  }, [pathname, isMobile])

  useEffect(() => {
    if (isLoading) {
      return
    }

    // Check if the current path is a protected path
    for (const protectedPath of protectedPaths) {
      if (pathname.startsWith(protectedPath)) {
        // If there is no authenticated user, redirect to login page
        if (!user) {
          setMasjidAdminSidebarOpen(false)
          router.push("/login")
        }
      }
    }
  }, [isLoading])

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`${sourceSerifPro.className} text-white relative bg-dark`}
      >
        <ToastContainer />
        {!isSignagePath() && (
          <>
            <Navbar
              isLoading={isLoading}
              user={user}
              toggleUserSidebar={toggleSidebar}
              toggleMasjidAdminSidebar={() =>
                setMasjidAdminSidebarOpen(!masjidAdminSidebarOpen)
              }
              onLogout={logout}
            />
            <Sidebar
              open={userSidebarOpen}
              toggle={toggleSidebar}
            />
            <MasjidAdmiSidebar
              isLoading={isLoading}
              open={masjidAdminSidebarOpen}
              masjidId={user?.masjidId}
              onLogout={logout}
            />
          </>
        )}
        <div
          className={`w-full transition duration-500 ease-out ${masjidAdminSidebarOpen && !isSignagePath() && "pl-64"}`}
        >
          {children}
        </div>
        {!isSignagePath() && (
          <>
            <Footer />
          </>
        )}
      </body>
    </html>
  )
}
