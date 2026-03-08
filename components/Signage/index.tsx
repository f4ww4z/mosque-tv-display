"use client"

import LoadingIndicator from "components/LoadingIndicator"
import fetchJson from "lib/fetchJson"
import {
  getCarouselFromStorage,
  getProfileFromStorage,
  getSettingsFromStorage,
  getYearlyDataFromStorage,
  saveCarouselToStorage,
  saveProfileToStorage,
  saveSettingsToStorage,
  saveYearlyDataToStorage,
} from "lib/localStorage"
import { getPrayerTimeFromYearlyData } from "lib/prayerUtils"
import { toSentenceCase } from "lib/string"
import moment from "moment"
import { useEffect, useState } from "react"
import {
  MdFullscreen,
  MdFullscreenExit,
  MdZoomIn,
  MdZoomOut,
  MdWifiOff,
} from "react-icons/md"
import { toast } from "react-toastify"
import { CarouselItem } from "types/carousel"
import { MasjidProfileResponse, MasjidSettingsResponse } from "types/masjid"
import { JAKIMPrayerTimesResponse, PrayerTimeResponse } from "types/prayer"
import { AzanImagesResponse } from "types/azan"
import { getPrayerImageFieldName, PRAYER_NAME_MAP } from "lib/azanUtils"
import { preCacheUrls, registerServiceWorker } from "lib/mediaCache"
import DoNotDisturbScreen from "../DoNotDisturbScreen"
import MyClock from "../MyClock"
import AzanAnnouncement from "./AzanAnnouncement"
import AzanCountdown from "./AzanCountdown"
import Calendar from "./Calendar"
import DisplayCarousel from "./DisplayCarousel"
import IqamahCountdown from "./IqamahCountdown"
import NewsBanner from "./NewsBanner"
import PrayerTimetable from "./PrayerTimetable"
import Profile from "./Profile"

const Signage = ({ masjidId }: { masjidId?: string }) => {
  const [displayedMasjidId, setDisplayedMasjidId] = useState<string>("")
  const [profile, setProfile] = useState<MasjidProfileResponse>()
  const [settings, setSettings] = useState<MasjidSettingsResponse>()
  const [prayerTime, setPrayerTime] = useState<PrayerTimeResponse>()
  const [doNotDisturb, setDoNotDisturb] = useState<boolean>(false)
  const [showAzanAnnouncement, setShowAzanAnnouncement] =
    useState<boolean>(false)
  const [azanPrayerName, setAzanPrayerName] = useState<string>("")
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([])
  const [totalCarouselDuration, setTotalCarouselDuration] = useState<number>(0) // seconds
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false)
  const [jakimDown, setJakimDown] = useState<boolean>(false)
  const [zoomLevel, setZoomLevel] = useState<number>(0.85)
  const [azanImages, setAzanImages] = useState<AzanImagesResponse | null>(null)

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

  // Get the next prayer time and name
  const getNextPrayer = () => {
    if (!prayerTime) {
      return { time: undefined, name: undefined }
    }

    const ptLabels = {
      en: ["Fajr", "Syuruk", "Dhuhr", "Asr", "Maghrib", "Isha"],
      ms: ["Subuh", "Syuruk", "Zohor", "Asar", "Maghrib", "Isyak"],
    }

    const now = moment()

    // Find the next prayer (excluding Syuruk)
    for (let i = 0; i < ptLabels.en.length; i++) {
      const ptLabelEn = ptLabels.en[i].toLowerCase()

      if (ptLabelEn === "syuruk") {
        continue
      }

      const ptTime = moment(prayerTime[ptLabelEn], "HH:mm")

      if (now.isBefore(ptTime)) {
        return {
          time: prayerTime[ptLabelEn],
          name: ptLabels.ms[i],
        }
      }
    }

    // If all prayers have passed, return tomorrow's Fajr
    return {
      time: prayerTime.fajr,
      name: "Subuh",
    }
  }

  // Get the current prayer that has started (for Iqamah countdown)
  const getCurrentPrayer = () => {
    if (!prayerTime) {
      return { time: undefined, name: undefined, key: undefined }
    }

    const ptLabels = {
      en: ["Fajr", "Syuruk", "Dhuhr", "Asr", "Maghrib", "Isha"],
      ms: ["Subuh", "Syuruk", "Zohor", "Asar", "Maghrib", "Isyak"],
    }

    const now = moment()

    // Find the latest prayer that has passed (excluding Syuruk)
    for (let i = ptLabels.en.length - 1; i >= 0; i--) {
      const ptLabelEn = ptLabels.en[i].toLowerCase()

      if (ptLabelEn === "syuruk") {
        continue
      }

      const ptTime = moment(prayerTime[ptLabelEn], "HH:mm")

      if (now.isAfter(ptTime)) {
        return {
          time: prayerTime[ptLabelEn],
          name: ptLabels.ms[i],
          key: ptLabelEn,
        }
      }
    }

    // If no prayer has passed today, return last prayer (Isha)
    return {
      time: prayerTime.isha,
      name: "Isyak",
      key: "isha",
    }
  }

  // Get the iqamah time for the current prayer
  const getIqamahTimeForPrayer = (prayerKey?: string) => {
    if (!prayerKey || !settings?.settings) {
      return settings?.settings?.timeUntilIqamah || 10
    }

    switch (prayerKey) {
      case "fajr":
        return settings.settings.timeUntilIqamahFajr
      case "dhuhr":
        return settings.settings.timeUntilIqamahDhuhr
      case "asr":
        return settings.settings.timeUntilIqamahAsr
      case "maghrib":
        return settings.settings.timeUntilIqamahMaghrib
      case "isha":
        return settings.settings.timeUntilIqamahIsha
      default:
        return settings.settings.timeUntilIqamah
    }
  }

  // Get adjusted Hijri date — in Islamic calendar the new day begins at Maghrib (sunset)
  // After Maghrib: show tomorrow's Hijri date from the yearly data (accurate, no arithmetic)
  const getAdjustedHijriDate = () => {
    if (!prayerTime?.hijri || !prayerTime?.maghrib) {
      return prayerTime?.hijri
    }

    const now = moment()
    const maghribTime = moment(prayerTime.maghrib, "HH:mm")
    const midnight = moment().endOf("day")

    if (now.isAfter(maghribTime) && now.isBefore(midnight)) {
      return prayerTime.hijriTomorrow
    }

    return prayerTime.hijri
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
      // Try to load from cache first
      const cachedProfile = getProfileFromStorage(displayedMasjidId)
      if (cachedProfile) {
        setProfile(cachedProfile)
        document.title = `Paparan ${toSentenceCase(cachedProfile.type)} ${cachedProfile.name} | PTM`
      }

      // Fetch fresh data
      const data = await fetchJson<MasjidProfileResponse>(
        `/api/masjid/${displayedMasjidId}/profile`
      )

      setProfile(data)
      saveProfileToStorage(data, displayedMasjidId)
      setIsOfflineMode(false) // Successfully fetched, not offline

      document.title = `Paparan ${toSentenceCase(data.type)} ${data.name} | PTM`
    } catch (error) {
      // If API fails and we have cached data, use it silently
      const cachedProfile = getProfileFromStorage(displayedMasjidId)
      if (cachedProfile && !profile) {
        setProfile(cachedProfile)
        setIsOfflineMode(true) // Using cache, offline mode
        document.title = `Paparan ${toSentenceCase(cachedProfile.type)} ${cachedProfile.name} | PTM`
        console.warn("Using cached profile due to network error")
      } else if (!cachedProfile) {
        toast.error(
          error.message ?? "Error berlaku semasa mengakses profil masjid."
        )
      }
    }
  }

  const fetchPrayerTime = async (city: string, countryCode: string) => {
    const year = new Date().getFullYear()

    // Use localStorage yearly data for instant, offline-safe display
    const cachedYearly = getYearlyDataFromStorage(city, countryCode, year)
    if (cachedYearly) {
      const computed = getPrayerTimeFromYearlyData(cachedYearly, new Date())
      if (computed) {
        setPrayerTime(computed)
        setJakimDown(false)
      }
    }

    try {
      const freshYearly = await fetchJson<JAKIMPrayerTimesResponse>(
        `/api/prayer/yearly?city=${encodeURIComponent(city)}&countryCode=${countryCode}`
      )
      saveYearlyDataToStorage(freshYearly, city, countryCode, year)
      const computed = getPrayerTimeFromYearlyData(freshYearly, new Date())
      if (computed) {
        setPrayerTime(computed)
        setJakimDown(false)
      }
    } catch {
      if (!cachedYearly) {
        setJakimDown(true)
      } else {
        setIsOfflineMode(true)
        console.warn("Using cached yearly prayer data due to network error")
      }
    }
  }

  const fetchSettings = async () => {
    let resolvedSettings: MasjidSettingsResponse | null = null

    try {
      // Try to load from cache first
      const cachedSettings = getSettingsFromStorage(displayedMasjidId)
      if (cachedSettings) {
        setSettings(cachedSettings)
        setZoomLevel(cachedSettings.settings?.zoomLevel ?? 0.85)
        resolvedSettings = cachedSettings
      }

      // Fetch fresh settings
      const freshSettings = await fetchJson<MasjidSettingsResponse>(
        `/api/masjid/${displayedMasjidId}/settings`
      )

      setSettings(freshSettings)
      saveSettingsToStorage(freshSettings, displayedMasjidId)
      setZoomLevel(freshSettings.settings?.zoomLevel ?? 0.85)
      setIsOfflineMode(false)
      resolvedSettings = freshSettings

      // Pre-cache the configured notification sound and logo for offline use
      const urlsToCache: string[] = []
      if (freshSettings.settings?.notifyPrayerTimeSound) {
        urlsToCache.push(freshSettings.settings.notifyPrayerTimeSound)
      }
      if (freshSettings.settings?.logoFilename) {
        urlsToCache.push(
          `/api/masjid/${displayedMasjidId}/logo/${freshSettings.settings.logoFilename}`
        )
      }
      preCacheUrls(urlsToCache)
    } catch (error) {
      // If settings API fails, fall back to cached settings
      const cachedSettings = getSettingsFromStorage(displayedMasjidId)
      if (cachedSettings && !settings) {
        setSettings(cachedSettings)
        setZoomLevel(cachedSettings.settings?.zoomLevel ?? 0.85)
        setIsOfflineMode(true)
        resolvedSettings = cachedSettings
        console.warn("Using cached settings due to network error")
      } else if (!cachedSettings) {
        toast.error(
          error.message ?? "An error occurred while fetching settings."
        )
      } else {
        resolvedSettings = cachedSettings
      }
    }

    // Fetch prayer time separately so JAKIM errors are handled independently
    if (resolvedSettings) {
      await fetchPrayerTime(resolvedSettings.city, resolvedSettings.countryCode)
    }
  }

  const fetchCarousels = async () => {
    try {
      // Try to load from cache first
      const cachedCarousel = getCarouselFromStorage(displayedMasjidId)
      if (cachedCarousel) {
        setCarouselItems(cachedCarousel)
        if (settings?.settings && cachedCarousel.length > 0) {
          setTotalCarouselDuration(
            cachedCarousel.length * settings.settings.timeBetweenSlideshows
          )
        }
      }

      // Fetch fresh data
      let data = await fetchJson<CarouselItem[]>(
        `/api/masjid/${displayedMasjidId}/carousel`
      )

      if (data.length === 0) {
        toast.warn("No carousels found. Default displays are provided.")
      }

      data = data.filter((item) => !item.hidden)

      setCarouselItems(data)
      saveCarouselToStorage(data, displayedMasjidId)

      // Pre-cache all carousel media for offline use
      // Images are fetched eagerly so the entire slideshow works offline
      const carouselUrls = data.map(
        (item) => `/api/masjid/${displayedMasjidId}/carousel/${item.filename}`
      )
      preCacheUrls(carouselUrls)

      if (settings?.settings && data.length > 0) {
        setTotalCarouselDuration(
          data.length * settings.settings.timeBetweenSlideshows
        )
      }
    } catch (error) {
      // If API fails and we have cached data, use it silently
      const cachedCarousel = getCarouselFromStorage(displayedMasjidId)
      if (cachedCarousel && carouselItems.length === 0) {
        setCarouselItems(cachedCarousel)
        if (settings?.settings && cachedCarousel.length > 0) {
          setTotalCarouselDuration(
            cachedCarousel.length * settings.settings.timeBetweenSlideshows
          )
        }
        console.warn("Using cached carousel due to network error")
      } else if (!cachedCarousel) {
        toast.error(
          error.message ?? "An error occurred while fetching carousels."
        )
      }
    }
  }

  const fetchAzanImages = async () => {
    try {
      const data = await fetchJson<AzanImagesResponse>(
        `/api/masjid/${displayedMasjidId}/azan-images`
      )

      setAzanImages(data)

      // Pre-cache all custom azan images for offline use
      const azanImageUrls = [
        data.azanImageFajr,
        data.azanImageDhuhr,
        data.azanImageAsr,
        data.azanImageMaghrib,
        data.azanImageIsha,
      ]
        .filter(Boolean)
        .map(
          (filename) =>
            `/api/masjid/${displayedMasjidId}/azan-images/${filename}`
        )
      preCacheUrls(azanImageUrls)
    } catch (error) {
      console.error("Failed to fetch azan images:", error)
      // Silently fail - azan images are optional
    }
  }

  // Get the azan image path for a specific prayer
  const getAzanImagePath = (prayerName: string): string | undefined => {
    if (!azanImages) return undefined

    const prayerNameLower = prayerName.toLowerCase()

    // Map Malay/English prayer names to prayer keys
    const prayerKey = PRAYER_NAME_MAP[prayerNameLower]
    if (!prayerKey) return undefined

    // Get the field name using utility function
    const fieldName = getPrayerImageFieldName(prayerKey)
    const fileName = azanImages[fieldName]
    if (!fileName) return undefined

    return `/api/masjid/${displayedMasjidId}/azan-images/${fileName}`
  }

  useEffect(() => {
    registerServiceWorker()
    fetchMasjidId()
  }, [])

  // Preload cached data immediately when masjidId is available
  useEffect(() => {
    if (!displayedMasjidId) {
      return
    }

    // Load cached data immediately for offline capability
    const cachedProfile = getProfileFromStorage(displayedMasjidId)
    if (cachedProfile && !profile) {
      setProfile(cachedProfile)
      document.title = `Paparan ${toSentenceCase(cachedProfile.type)} ${cachedProfile.name} | PTM`
    }

    const cachedSettings = getSettingsFromStorage(displayedMasjidId)
    if (cachedSettings && !settings) {
      setSettings(cachedSettings)
      setZoomLevel(cachedSettings.settings?.zoomLevel ?? 0.85)

      // Prefer yearly data for accurate, offline-safe prayer times
      const year = new Date().getFullYear()
      const cachedYearly = getYearlyDataFromStorage(
        cachedSettings.city,
        cachedSettings.countryCode,
        year
      )
      if (cachedYearly) {
        const computed = getPrayerTimeFromYearlyData(cachedYearly, new Date())
        if (computed) setPrayerTime(computed)
      }
    }

    const cachedCarousel = getCarouselFromStorage(displayedMasjidId)
    if (cachedCarousel && carouselItems.length === 0) {
      setCarouselItems(cachedCarousel)
    }
  }, [displayedMasjidId])

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
    fetchCarousels()
    fetchAzanImages()

    // Fetch latest settings and carousel every minute
    const interval = setInterval(() => {
      fetchProfile()
      fetchSettings()
      fetchCarousels()
      fetchAzanImages()
    }, 60000) // 60 seconds = 1 minute

    return () => clearInterval(interval)
  }, [displayedMasjidId])

  if (!displayedMasjidId || !settings?.settings) {
    return (
      <div className="flex flex-col justify-center w-full h-screen bg-primary-darker">
        {jakimDown && (
          <div className="flex flex-col items-center justify-center w-full h-full p-8 text-white">
            <div className="text-9xl mb-8">⚠️</div>
            <h1 className="text-6xl font-bold mb-6 text-center text-yellow-300">
              JAKIM Tidak Dapat Dicapai
            </h1>
            <p className="text-3xl text-center mb-4 text-red-200">
              Tiada data waktu solat untuk tahun ini.
            </p>
            <p className="text-2xl text-center text-red-300">
              Sila semak sambungan internet atau hubungi pentadbir.
            </p>
          </div>
        )}
        {!jakimDown && <LoadingIndicator />}
      </div>
    )
  }

  return (
    <div
      className={`relative flex flex-col justify-start w-full h-screen bg-${settings.settings.theme}-darker overflow-hidden`}
    >
      {/* JAKIM down overlay — shown when prayer data is unavailable and API is unreachable */}
      {jakimDown && !prayerTime && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-red-900/95 text-white p-8">
          <div className="text-9xl mb-8">⚠️</div>
          <h1 className="text-6xl font-bold mb-6 text-center text-yellow-300">
            JAKIM Tidak Dapat Dicapai
          </h1>
          <p className="text-3xl text-center mb-4 text-red-200">
            Tiada data waktu solat untuk tahun ini.
          </p>
          <p className="text-2xl text-center text-red-300">
            Sila semak sambungan internet atau hubungi pentadbir.
          </p>
        </div>
      )}

      {/* Show Azan Announcement outside zoom container to cover entire screen */}
      {showAzanAnnouncement && azanPrayerName && prayerTime && (
        <AzanAnnouncement
          theme={settings.settings.theme}
          prayerName={azanPrayerName}
          duration={settings.settings.azanAnnouncementDuration || 5}
          imagePath={getAzanImagePath(azanPrayerName)}
          onComplete={() => {
            setShowAzanAnnouncement(false)
            setAzanPrayerName("")
          }}
        />
      )}

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
          logoFilename={settings.settings.logoFilename}
          masjidId={displayedMasjidId}
        />

        <Calendar
          theme={settings.settings.theme}
          gregorian={prayerTime?.date}
          hijri={getAdjustedHijriDate()}
        />

        <div className="flex w-full flex-nowrap">
          <div className="flex flex-col w-full max-w-64 h-full mt-2">
            <MyClock
              theme={settings.settings.theme}
              hourFormat={settings.settings.clockHourFormat}
            />
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

          <div className="w-[83vw] h-full relative">
            {/* Show countdown if within X minutes before next prayer */}
            {!showAzanAnnouncement && prayerTime && (
              <AzanCountdown
                theme={settings.settings.theme}
                minutesBeforeAzan={
                  settings.settings.minutesBeforeAzanCountdown || 10
                }
                nextPrayerTime={getNextPrayer().time}
                nextPrayerName={getNextPrayer().name}
                onAzanTimeReached={(prayerName: string) => {
                  // Only show azan if we have valid prayer data
                  if (prayerTime && getNextPrayer().time) {
                    setAzanPrayerName(prayerName)
                    setShowAzanAnnouncement(true)
                  }
                }}
              />
            )}

            {/* Show Iqamah countdown after Azan announcement completes */}
            {!showAzanAnnouncement && (
              <IqamahCountdown
                key={`iqamah-${getCurrentPrayer().time}-${showAzanAnnouncement}`}
                theme={settings.settings.theme}
                timeUntilIqamah={getIqamahTimeForPrayer(getCurrentPrayer().key)}
                timeUntilPrayerEnds={settings.settings.timeUntilPrayerEnds}
                prayerTime={getCurrentPrayer().time}
                prayerName={getCurrentPrayer().name}
                togglePrayerMode={(isOn: boolean) => setDoNotDisturb(isOn)}
              />
            )}

            {/* Display carousel - will be hidden when countdown is active */}
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

      {/* Offline Mode Indicator */}
      {isOfflineMode && (
        <div className="absolute z-20 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-lg top-2 right-2 bg-red-600/90 backdrop-blur-sm">
          <MdWifiOff className="text-xl" />
          <span>Mode Luar Talian</span>
        </div>
      )}

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
