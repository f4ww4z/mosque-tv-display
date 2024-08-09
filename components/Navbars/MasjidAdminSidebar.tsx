import LoadingIndicator from "components/LoadingIndicator"
import Link from "next/link"
import { FaInfoCircle } from "react-icons/fa"
import { FaClock } from "react-icons/fa6"
import { ImExit } from "react-icons/im"
import { IoMdSettings } from "react-icons/io"
import {
  MdEvent,
  MdOutlineViewCarousel,
  MdRoomPreferences,
  MdSpaceDashboard,
} from "react-icons/md"

const MasjidAdmiSidebar = ({
  isLoading,
  open,
  masjidId,
  onLogout,
}: {
  isLoading: boolean
  open: boolean
  masjidId?: string
  onLogout: () => void
}) => {
  return (
    <nav
      className={`absolute z-10 pt-3 flex flex-col h-auto text-white w-64 bg-dark transition duration-500 ease-out ${!open && "-translate-x-64"}`}
    >
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <Link
            className="flex items-center w-full px-4 py-3 transition flex-nowrap hover:bg-teal-700 hover:cursor-pointer hover:bg-primary-dark"
            href={`/masjid/${masjidId}/dashboard`}
          >
            <span className="mr-2 text-4xl">
              <MdSpaceDashboard />
            </span>
            <span className="text-md">Papan Pemuka</span>
          </Link>
          <Link
            className="flex items-center w-full px-4 py-3 transition flex-nowrap hover:bg-teal-700 hover:cursor-pointer hover:bg-primary-dark"
            href={`/masjid/${masjidId}/profile`}
          >
            <span className="mr-2 text-4xl">
              <FaInfoCircle />
            </span>
            <span className="text-md">Profil</span>
          </Link>
          <Link
            className="flex items-center w-full px-4 py-3 transition flex-nowrap hover:bg-teal-700 hover:cursor-pointer hover:bg-primary-dark"
            href={`/masjid/${masjidId}/world-clocks`}
          >
            <span className="ml-1 mr-3 text-3xl">
              <FaClock />
            </span>
            <span className="text-md">Jam Antarabangsa</span>
          </Link>
          <Link
            className="flex items-center w-full px-4 py-3 transition flex-nowrap hover:bg-teal-700 hover:cursor-pointer hover:bg-primary-dark"
            href={`/masjid/${masjidId}/slideshow`}
          >
            <span className="mr-2 text-4xl">
              <MdOutlineViewCarousel />
            </span>
            <span className="text-md">Paparan Slaid</span>
          </Link>
          {/* <Link
            className="flex items-center w-full px-4 py-3 transition flex-nowrap hover:bg-teal-700 hover:cursor-pointer hover:bg-primary-dark"
            href={`/masjid/${masjidId}/facilities`}
          >
            <span className="mr-2 text-4xl">
              <MdRoomPreferences />
            </span>
            <span className="text-md">Fasiliti</span>
          </Link> */}
          <Link
            className="flex items-center w-full px-4 py-3 transition flex-nowrap hover:bg-teal-700 hover:cursor-pointer hover:bg-primary-dark"
            href={`/masjid/${masjidId}/events`}
          >
            <span className="mr-2 text-4xl">
              <MdEvent />
            </span>
            <span className="text-md">Aktiviti / Program</span>
          </Link>
          <Link
            className="flex items-center w-full px-4 py-3 transition flex-nowrap hover:bg-teal-700 hover:cursor-pointer hover:bg-primary-dark"
            href={`/masjid/${masjidId}/settings`}
          >
            <span className="mr-2 text-4xl">
              <IoMdSettings />
            </span>
            <span className="text-md">Tetapan</span>
          </Link>
          <button
            className="flex items-center w-full px-4 py-3 transition flex-nowrap hover:bg-teal-700 hover:cursor-pointer hover:bg-primary-dark"
            onClick={onLogout}
          >
            <span className="ml-1 mr-2 text-3xl">
              <ImExit />
            </span>
            <span className="text-md">Log Keluar</span>
          </button>
        </>
      )}
    </nav>
  )
}

export default MasjidAdmiSidebar
