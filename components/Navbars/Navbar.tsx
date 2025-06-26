"use client"

import LoadingIndicator from "components/LoadingIndicator"
import Shimmer from "components/Shimmer"
import { elMessiri } from "lib/fonts"
import Link from "next/link"
import { FC } from "react"
import { FaBars } from "react-icons/fa"
import { SessionUser } from "types/user"

interface NavbarProps {
  isLoading: boolean
  user?: SessionUser
  toggleUserSidebar: () => void
  toggleMasjidAdminSidebar: () => void
  onLogout: () => void
}

const Navbar: FC<NavbarProps> = ({
  isLoading,
  user,
  toggleUserSidebar,
  toggleMasjidAdminSidebar,
  onLogout,
}) => (
  <div className="pb-14">
    <nav className="fixed z-50 flex items-center justify-between w-full overflow-hidden text-white h-14 md:px-4 lg:px-16 xl:px-24 from-primary-dark to-primary bg-gradient-to-r drop-shadow-lg">
      <div className="flex gap-1 flex-nowrap">
        {isLoading ? (
          <Shimmer
            w={20}
            h={16}
          />
        ) : (
          user?.role === "MASJID_ADMIN" && (
            <button
              className="px-4 text-3xl transition hover:bg-primary-darker"
              onClick={() => toggleMasjidAdminSidebar()}
            >
              <FaBars />
            </button>
          )
        )}
        <Link
          href={"/"}
          className="flex items-center px-3 py-2 transition flex-nowrap hover:bg-primary-darker"
        >
          <span className={`${elMessiri.className} mt-1 text-2xl font-black`}>
            PTM
          </span>
        </Link>
      </div>

      <div className="flex items-center justify-center gap-1">
        {isLoading ? (
          <LoadingIndicator />
        ) : user ? (
          <>
            <Link
              href={`/masjid/${user.masjidId}/dashboard`}
              className="items-center justify-center hidden px-4 py-4 text-xl font-bold uppercase transition duration-300 ease-in-out md:flex hover:bg-primary-darker"
            >
              Papan Pemuka
            </Link>
            <button
              onClick={() => onLogout()}
              className="items-center justify-center hidden px-4 py-2 text-xl font-bold uppercase transition duration-300 ease-in-out rounded-lg md:flex hover:bg-primary-lighter bg-primary"
            >
              Log Keluar
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="items-center justify-center hidden px-4 py-2 text-xl font-bold uppercase transition duration-300 ease-in-out rounded-lg drop-shadow-lg md:flex hover:bg-accent bg-accent-dark"
            >
              Log Masuk
            </Link>
            <button
              className="pt-1 pl-4 pr-6 md:hidden"
              onClick={toggleUserSidebar}
            >
              <FaBars className="text-3xl" />
            </button>
          </>
        )}
      </div>
    </nav>
  </div>
)

export default Navbar
