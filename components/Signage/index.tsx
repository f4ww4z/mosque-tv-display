"use client"

import LoadingIndicator from "components/LoadingIndicator"
import fetchJson from "lib/fetchJson"
import { toSentenceCase } from "lib/string"
import { useEffect, useState } from "react"
import {
  MdFullscreen,
  MdFullscreenExit,
  MdZoomIn,
  MdZoomOut,
} from "react-icons/md"
import { toast } from "react-toastify"
import { CarouselItem } from "types/carousel"
import { MasjidProfileResponse, MasjidSettingsResponse } from "types/masjid"
import { PrayerTimeResponse } from "types/prayer"
import DoNotDisturbScreen from "../DoNotDisturbScreen"
import MyClock from "../MyClock"
import Calendar from "./Calendar"
import DisplayCarousel from "./DisplayCarousel"
import NewsBanner from "./NewsBanner"
import PrayerTimetable from "./PrayerTimetable"
import Profile from "./Profile"

const Signage = ({ masjidId }: { masjidId?: string }) => {
  const [displayedMasjidId, setDisplayedMasjidId] = useState<string>("")
  const [profile, setProfile] = useState<MasjidProfileResponse>()
  const [settings, setSettings] = useState<MasjidSettingsResponse>()
  const [prayerTime, setPrayerTime] = useState<PrayerTimeResponse>()
  const [doNotDisturb, setDoNotDisturb] = useState<boolean>(false)
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([])
  const [totalCarouselDuration, setTotalCarouselDuration] = useState<number>(0) // seconds
  const [zoomLevel, setZoomLevel] = useState<number>(0.85)

  const handleZoomIn = async () => {
    const newZoom = Math.min(zoomLevel + 0.05, 1.5)
    setZoomLevel(newZoom)
    await saveZoomLevel(newZoom)
  }

  const handleZoomOut = async () => {
    const newZoom = Math.max(zoomLevel - 0.05, 0.5)
    setZoomLevel(newZoom)
    await saveZoomLevel(newZoom)
  }

  const saveZoomLevel = async (zoom: number) => {
    try {
      await fetchJson(`/api/masjid/${displayedMasjidId}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zoomLevel: zoom }),
      })
    } catch (error) {
      console.error("Failed to save zoom level:", error)
    }
  }

  const getNewsTexts = () => {
    return settings?.settings?.newsTexts
  }

  const fetchMasjidId = async () => {
    if (masjidId) {
      setDisplayedMasjidId(masjidId)
      return
    }

    try {
      const demoMasjid = await fetchJson<{ id: string }>("/api/demoMasjidId")

      if (!demoMasjid?.id) {
        throw new Error("Demo Masjid tidak ditemukan.")
      }

      setDisplayedMasjidId(demoMasjid.id)
    } catch (error) {
      toast.error("An error occurred while fetching masjid profile.")
    }
  }

  const fetchProfile = async () => {
    try {
      const data = await fetchJson<MasjidProfileResponse>(
        `/api/masjid/${displayedMasjidId}/profile`
      )

      setProfile(data)

      document.title = `Paparan ${toSentenceCase(data.type)} ${data.name} | PTM`
    } catch (error) {
      toast.error(
        error.message ?? "Error berlaku semasa mengakses profil masjid."
      )
    }
  }

  const fetchSettings = async () => {
    try {
      const settings = await fetchJson<MasjidSettingsResponse>(
        `/api/masjid/${displayedMasjidId}/settings`
      )

      setSettings(settings)
      setZoomLevel(settings.settings?.zoomLevel ?? 0.85)

      const prayerTime = await fetchJson<PrayerTimeResponse>(
        `/api/prayer?city=${settings.city}&countryCode=${settings.countryCode}`
      )

      setPrayerTime(prayerTime)
    } catch (error) {
      // console.log(error)
      toast.error(error.message ?? "An error occurred while fetching settings.")
    }
  }

  const fetchCarousels = async () => {
    try {
      let data = await fetchJson<CarouselItem[]>(
        `/api/masjid/${displayedMasjidId}/carousel`
      )

      if (data.length === 0) {
        toast.warn("No carousels found. Default displays are provided.")
      }

      data = data.filter((item) => !item.hidden)

      setCarouselItems(data)

      if (settings?.settings && data.length > 0) {
        setTotalCarouselDuration(
          data.length * settings.settings.timeBetweenSlideshows
        )
      }
    } catch (error) {
      toast.error(
        error.message ?? "An error occurred while fetching carousels."
      )
    }
  }

  useEffect(() => {
    fetchMasjidId()
  }, [])

  useEffect(() => {
    if (!displayedMasjidId) {
      return
    }

    if (totalCarouselDuration === 0) {
      fetchCarousels()
    }

    const timeout = setTimeout(() => {
      setTotalCarouselDuration(0)
    }, totalCarouselDuration * 1000)

    return () => clearTimeout(timeout)
  }, [displayedMasjidId, totalCarouselDuration]) // Depend on `totalCarouselDuration` to refetch carousels

  useEffect(() => {
    if (!displayedMasjidId) {
      return
    }

    fetchProfile()
    fetchSettings()

    const interval = setInterval(() => {
      fetchProfile()
      fetchSettings()
    }, 10000)

    return () => clearInterval(interval)
  }, [displayedMasjidId])

  if (!displayedMasjidId || !settings?.settings) {
    return (
      <div className="flex flex-col justify-center w-full h-screen bg-primary-darker">
        <LoadingIndicator />
      </div>
    )
  }

  return (
    <div
      className={`relative flex flex-col justify-start w-full h-screen bg-${settings.settings.theme}-darker overflow-hidden`}
    >
      <div
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "top left",
          width: `${100 / zoomLevel}%`,
          height: `${100 / zoomLevel}%`,
        }}
      >
        {doNotDisturb && <DoNotDisturbScreen />}

        <Profile
          theme={settings.settings.theme}
          data={profile}
        />

        <Calendar
          theme={settings.settings.theme}
          gregorian={prayerTime?.date}
          hijri={prayerTime?.hijri}
        />

        <div className="flex w-full flex-nowrap">
          <div className="flex flex-col w-full max-w-64 h-full mt-6">
            <MyClock theme={settings.settings.theme} />
            <div className="flex-1">
              <PrayerTimetable
                theme={settings.settings.theme}
                lang={settings.settings.language}
                prayerTime={prayerTime}
                azanAudioPath={settings.settings.notifyPrayerTimeSound}
                timeUntilIqamah={settings.settings.timeUntilIqamah}
                timeUntilPrayerEnds={settings.settings.timeUntilPrayerEnds}
                togglePrayerMode={(isOn: boolean) => setDoNotDisturb(isOn)}
              />
            </div>
          </div>

          <div className="w-[83vw] h-full">
            <DisplayCarousel
              theme={settings.settings.theme}
              masjidId={displayedMasjidId}
              items={carouselItems}
              loading={!carouselItems}
              autoPlaySpeed={settings.settings.timeBetweenSlideshows * 1000}
              worldClocks={settings.settings.worldClocks}
            />
          </div>
        </div>

        <NewsBanner news={getNewsTexts()} />
      </div>

      <div className="absolute z-20 flex flex-col gap-2 bottom-2 left-2">
        <button
          className="p-2 text-4xl transition duration-500 transform rounded-lg bg-primary opacity-10 hover:opacity-100"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <MdZoomIn />
        </button>
        <button
          className="p-2 text-4xl transition duration-500 transform rounded-lg bg-primary opacity-10 hover:opacity-100"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <MdZoomOut />
        </button>
        <button
          className="p-2 text-4xl transition duration-500 transform rounded-lg bg-primary opacity-10 hover:opacity-100"
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen()
              setIsFullScreen(false)
            } else {
              document.documentElement.requestFullscreen()
              setIsFullScreen(true)
            }
          }}
          title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullScreen ? <MdFullscreenExit /> : <MdFullscreen />}
        </button>
      </div>
    </div>
  )
}

export default Signage
