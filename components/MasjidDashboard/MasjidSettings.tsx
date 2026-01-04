"use client"

import { ZoomAndFade } from "components/Animations"
import Asterisk from "components/Asterisk"
import LoadingIndicator from "components/LoadingIndicator"
import fetchJson from "lib/fetchJson"
import { toSentenceCase } from "lib/string"
import { FormEvent, useEffect, useState } from "react"
import { FaPlus, FaTrash } from "react-icons/fa"
import { toast } from "react-toastify"
import {
  MasjidSettingsResponse,
  MasjidSettingsUpdateRequest,
} from "types/masjid"

const themeColors = ["teal", "gold", "magenta", "blue"]

const MasjidSettings = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [loadedSettings, setLoadedSettings] = useState<MasjidSettingsResponse>()
  const [settings, setSettings] = useState<MasjidSettingsUpdateRequest>()
  const [newsTexts, setNewsTexts] = useState<string[]>([])

  const fetchData = async () => {
    setLoading(true)

    if (!id) {
      return
    }

    try {
      const data = await fetchJson<MasjidSettingsResponse>(
        `/api/masjid/${id}/settings`
      )

      setLoadedSettings(data)
      setSettings(data.settings)
      setNewsTexts(data.settings.newsTexts)
    } catch (error) {
      toast.error(
        error.message ?? "Error berlaku semasa mengakses tetapan masjid."
      )
    }

    setLoading(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setLoadingSubmit(true)

    try {
      const body: MasjidSettingsUpdateRequest = {
        ...settings,
        newsTexts,
      }
      setSettings(body)

      await fetchJson(`/api/masjid/${id}/settings`, {
        method: "PUT",
        body: JSON.stringify(body),
      })

      toast.success("Tetapan masjid berjaya dikemaskini.")
      await fetchData()
    } catch (error) {
      toast.error(
        error.message ?? "Error berlaku semasa mengemaskini tetapan masjid."
      )
      setErrorMessage(
        error.message ?? "Error berlaku semasa mengemaskini tetapan masjid."
      )
    }

    setLoadingSubmit(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="flex flex-col w-full lg:max-w-xl">
      {loading ? (
        <div className="w-full h-screen">
          <LoadingIndicator />
        </div>
      ) : (
        <>
          <ZoomAndFade
            triggerOnce
            className="w-full"
          >
            <p className="mb-6 text-4xl font-bold">
              Tetapan&nbsp;
              {toSentenceCase(`${loadedSettings?.type}`)}
              &nbsp;{loadedSettings?.name}
            </p>
          </ZoomAndFade>
          <ZoomAndFade
            triggerOnce
            className="w-full lg:max-w-xl"
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full gap-3 py-4 border-white rounded-lg drop-shadow-lg"
            >
              {errorMessage && (
                <div className="w-full my-4 text-lg font-bold text-center text-error-light rounded-xl">
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="themeColors"
                  className="text-lg font-semibold"
                >
                  Warna Tema Paparan&nbsp;
                  <Asterisk />
                </label>

                <div className="flex flex-wrap gap-3">
                  {themeColors.map((color) => (
                    <div
                      key={color}
                      className="flex items-center gap-2 flex-nowrap"
                    >
                      <input
                        type="radio"
                        className="w-5 h-5"
                        name="themeColors"
                        id={color}
                        checked={settings?.theme === color}
                        onChange={() =>
                          setSettings({ ...settings, theme: color })
                        }
                      />
                      <label htmlFor={color}>{toSentenceCase(color)}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="language"
                  className="text-lg font-semibold"
                >
                  Bahasa&nbsp;
                  <Asterisk />
                </label>

                <div className="flex flex-wrap w-full gap-4">
                  <div className="flex items-center gap-2 flex-nowrap">
                    <input
                      type="radio"
                      className="w-5 h-5"
                      name="language"
                      id="ms"
                      checked={settings?.language === "ms"}
                      onChange={() =>
                        setSettings({ ...settings, language: "ms" })
                      }
                    />
                    <label htmlFor="ms">Melayu</label>
                  </div>
                  <div className="flex items-center gap-2 flex-nowrap">
                    <input
                      type="radio"
                      className="w-5 h-5"
                      name="language"
                      id="en"
                      checked={settings?.language === "en"}
                      onChange={() =>
                        setSettings({ ...settings, language: "en" })
                      }
                    />
                    <label htmlFor="en">English</label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="clockHourFormat"
                  className="text-lg font-semibold"
                >
                  Format Jam&nbsp;
                  <Asterisk />
                </label>

                <div className="flex flex-wrap w-full gap-4">
                  <div className="flex items-center gap-2 flex-nowrap">
                    <input
                      type="radio"
                      className="w-5 h-5"
                      name="clockHourFormat"
                      id="24hour"
                      checked={settings?.clockHourFormat === 24}
                      onChange={() =>
                        setSettings({ ...settings, clockHourFormat: 24 })
                      }
                    />
                    <label htmlFor="24hour">24 Jam</label>
                  </div>
                  <div className="flex items-center gap-2 flex-nowrap">
                    <input
                      type="radio"
                      className="w-5 h-5"
                      name="clockHourFormat"
                      id="12hour"
                      checked={settings?.clockHourFormat === 12}
                      onChange={() =>
                        setSettings({ ...settings, clockHourFormat: 12 })
                      }
                    />
                    <label htmlFor="12hour">12 Jam</label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="azanSound"
                  className="text-lg font-semibold"
                >
                  Suara Azan&nbsp;
                  <Asterisk />
                </label>

                <div className="flex flex-wrap w-full gap-4">
                  <div className="flex items-center gap-2 flex-nowrap">
                    <input
                      type="radio"
                      className="w-5 h-5"
                      name="azanSound"
                      id="notif1"
                      checked={
                        settings?.notifyPrayerTimeSound === "/sounds/notif1.wav"
                      }
                      onChange={() =>
                        setSettings({
                          ...settings,
                          notifyPrayerTimeSound: "/sounds/notif1.wav",
                        })
                      }
                    />
                    <label htmlFor="notif1">Bell 1</label>
                  </div>
                  <div className="flex items-center gap-2 flex-nowrap">
                    <input
                      type="radio"
                      className="w-5 h-5"
                      name="azanSound"
                      id="azan1"
                      checked={
                        settings?.notifyPrayerTimeSound === "/sounds/azan1.wav"
                      }
                      onChange={() =>
                        setSettings({
                          ...settings,
                          notifyPrayerTimeSound: "/sounds/azan1.wav",
                        })
                      }
                    />
                    <label htmlFor="azan1">Azan 1</label>
                  </div>
                  <div className="flex items-center gap-2 flex-nowrap">
                    <input
                      type="radio"
                      className="w-5 h-5"
                      name="azanSound"
                      id="beep1"
                      checked={
                        settings?.notifyPrayerTimeSound === "/sounds/beep1.mp3"
                      }
                      onChange={() =>
                        setSettings({
                          ...settings,
                          notifyPrayerTimeSound: "/sounds/beep1.mp3",
                        })
                      }
                    />
                    <label htmlFor="beep1">Beep 1</label>
                  </div>
                </div>

                {/* Preview sound */}
                <audio
                  controls
                  className="w-full mt-1"
                  src={settings?.notifyPrayerTimeSound}
                >
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
              </div>

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="timeUntilIqamah"
                  className="text-lg font-semibold"
                >
                  Masa Antara Azan & Iqamah (minit)&nbsp;
                  <Asterisk />
                </label>

                <input
                  id="timeUntilIqamah"
                  type="number"
                  placeholder="10..."
                  className="w-full px-4 py-2 text-lg bg-primary-light rounded-xl"
                  value={settings?.timeUntilIqamah}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      timeUntilIqamah: e.target.valueAsNumber,
                    })
                  }
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="timeUntilPrayerEnds"
                  className="text-lg font-semibold"
                >
                  Masa Sehingga Solat Selesai (minit)&nbsp;
                  <Asterisk />
                </label>

                <input
                  id="timeUntilPrayerEnds"
                  type="number"
                  placeholder="15..."
                  className="w-full px-4 py-2 text-lg bg-primary-light rounded-xl"
                  value={settings?.timeUntilPrayerEnds}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      timeUntilPrayerEnds: e.target.valueAsNumber,
                    })
                  }
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="timeBetweenSlideshows"
                  className="text-lg font-semibold"
                >
                  Masa untuk 1 Paparan Slaid (saat)&nbsp;
                  <Asterisk />
                </label>

                <input
                  id="timeBetweenSlideshows"
                  type="number"
                  placeholder="30..."
                  className="w-full px-4 py-2 text-lg bg-primary-light rounded-xl"
                  value={settings?.timeBetweenSlideshows}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      timeBetweenSlideshows: e.target.valueAsNumber,
                    })
                  }
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="zoomLevel"
                  className="text-lg font-semibold"
                >
                  Tahap Zum Paparan (0.5 - 1.5)&nbsp;
                  <Asterisk />
                </label>
                <p className="text-sm text-gray-400">
                  Laraskan saiz paparan untuk Android boxes dengan resolusi
                  lebih kecil. Default: 0.85
                </p>

                <input
                  id="zoomLevel"
                  type="number"
                  step="0.05"
                  min="0.5"
                  max="1.5"
                  placeholder="0.85..."
                  className="w-full px-4 py-2 text-lg bg-primary-light rounded-xl"
                  value={settings?.zoomLevel ?? 0.85}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      zoomLevel: e.target.valueAsNumber,
                    })
                  }
                />
              </div>

              {/* News text (a JSON array of strings) */}
              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="newsTexts"
                  className="text-lg font-semibold"
                >
                  Teks Berita&nbsp;
                  <Asterisk />
                </label>

                <div className="flex flex-col gap-2 p-3 rounded-xl bg-primary-dark">
                  {newsTexts.map((newsText, index) => (
                    <div
                      key={index}
                      className="relative w-full"
                    >
                      <input
                        id={`newsText-${index}`}
                        type="text"
                        placeholder="Teks berita..."
                        className="w-full py-2 pl-4 pr-10 text-lg bg-primary-light rounded-xl"
                        value={newsText}
                        onChange={(e) =>
                          setNewsTexts(
                            newsTexts.map((t, i) =>
                              i === index ? e.target.value : t
                            )
                          )
                        }
                      />
                      <div
                        className="absolute z-10 text-lg transition -translate-y-1/2 right-2 top-1/2 hover:text-accent hover:cursor-pointer"
                        onClick={() => {
                          setNewsTexts(newsTexts.filter((_, i) => i !== index))
                        }}
                      >
                        <FaTrash />
                      </div>
                    </div>
                  ))}
                  <div
                    className="flex items-center self-end gap-2 px-4 py-2 flex-nowrap bg-primary-lighter rounded-xl hover:bg-primary-lighter/70 hover:cursor-pointer"
                    onClick={() => {
                      setNewsTexts([...newsTexts, ""])
                    }}
                  >
                    <span className="text-xl">
                      <FaPlus />
                    </span>
                    Tambah Teks Berita
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-nowrap">
                <div
                  onClick={() => fetchData()}
                  className="flex items-center justify-center w-full py-2 text-lg font-semibold text-white transition bg-gray/20 hover:bg-gray/50 rounded-xl hover:cursor-pointer"
                >
                  Reset Tetapan
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center w-full py-2 text-lg font-semibold text-white transition bg-accent-dark hover:bg-accent-dark/80 rounded-xl disabled:bg-gray"
                  disabled={loadingSubmit}
                >
                  {loadingSubmit ? <LoadingIndicator /> : "Kemaskini Tetapan"}
                </button>
              </div>
            </form>
          </ZoomAndFade>
        </>
      )}
    </div>
  )
}

export default MasjidSettings
