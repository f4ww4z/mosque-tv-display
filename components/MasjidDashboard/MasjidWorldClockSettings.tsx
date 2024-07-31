"use client"

import Select from "react-select"
import { ZoomAndFade } from "components/Animations"
import Asterisk from "components/Asterisk"
import LoadingIndicator from "components/LoadingIndicator"
import { getJWTToken } from "lib/auth"
import fetchJson from "lib/fetchJson"
import { formatFileSize } from "lib/string"
import Image from "next/image"
import { FormEvent, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "react-toastify"
import {
  MasjidWorldClocksResponse,
  MasjidWorldClocksSettingsResponse,
} from "types/masjid"
import moment from "moment-timezone"
import { FaPlus, FaTrash } from "react-icons/fa6"
import { getExtensionFromMimeType } from "lib/metadata"

const maxFileSizeInMb = 10

const allTimezones = moment.tz.names()

const MasjidWorldClockSettings = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [worldClocks, setWorldClocks] = useState<MasjidWorldClocksResponse[]>(
    []
  )
  const [wcBg, setWcBg] = useState<File | null>(null)

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setWcBg(acceptedFiles[0])
    }
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    fileRejections,
  } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxFiles: 1,
    maxSize: maxFileSizeInMb * 1024 * 1024,
    multiple: false,
    onDrop,
  })

  const fetchWorldClockBackground = async () => {
    try {
      const response = await fetch(
        `/api/masjid/${id}/settings/world-clocks/background`,
        { method: "GET" }
      )
      const blob = await response.blob()
      const file = new File(
        [blob],
        `background${getExtensionFromMimeType(blob.type)}`,
        {
          type: blob.type,
        }
      )
      setWcBg(file)
    } catch (error) {
      toast.error(
        "Error berlaku semasa memuatkan gambar latar belakang jam dunia."
      )
    }
  }

  const fetchData = async () => {
    setLoading(true)

    if (!id) {
      return
    }

    try {
      const data = await fetchJson<MasjidWorldClocksSettingsResponse>(
        `/api/masjid/${id}/settings/world-clocks`
      )

      setWorldClocks(data.worldClocks)

      await fetchWorldClockBackground()
    } catch (error) {
      toast.error(
        error.message ??
          "Error berlaku semasa mengakses tetapan jam dunia masjid."
      )
    }

    setLoading(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setLoadingSubmit(true)

    try {
      const token = getJWTToken()

      if (!token) {
        throw new Error("Sila log masuk semula.")
      }

      if (worldClocks.length === 0) {
        throw new Error("Sila tambah sekurang-kurangnya 1 jam dunia.")
      }

      if (!wcBg) {
        throw new Error("Sila pilih gambar latar belakang jam dunia.")
      }

      const formData = new FormData()
      formData.append("worldClocks", JSON.stringify(worldClocks))
      formData.append("worldClockBackground", wcBg)

      const res = await fetch(`/api/masjid/${id}/settings/world-clocks`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Error berlaku semasa mengemaskini tetapan jam dunia.")
      }

      toast.success("Jam dunia masjid berjaya dikemaskini.")
      await fetchData()
    } catch (error) {
      toast.error(
        error.message ?? "Error berlaku semasa mengemaskini tetapan jam dunia."
      )
      setErrorMessage(
        error.message ?? "Error berlaku semasa mengemaskini tetapan jam dunia."
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
            <p className="mb-6 text-4xl font-bold">Tetapan Jam Antarabangsa</p>
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
                  Gambar Latar Belakang&nbsp;
                  <Asterisk />
                </label>

                <div className="flex flex-col gap-2">
                  <label htmlFor="worldClockBackground">
                    Fail (disyorkan 1080p, max {maxFileSizeInMb}MB)
                  </label>
                  <div
                    {...getRootProps()}
                    className="relative flex flex-col items-center justify-center p-2 text-center transition border border-dashed rounded-md hover:cursor-pointer h-80 hover:bg-primary-light"
                  >
                    <input {...getInputProps()} />
                    {wcBg ? (
                      <div className="flex flex-col items-center">
                        <p className="mb-1 font-semibold">
                          {formatFileSize(wcBg.size)} - {wcBg.name}
                        </p>
                        <Image
                          className="h-64 w-fit"
                          src={URL.createObjectURL(wcBg)}
                          alt={wcBg.name}
                          width={1280}
                          height={720}
                        />
                      </div>
                    ) : isDragActive ? (
                      <p>Letak fail disini...</p>
                    ) : fileRejections.length > 0 ? (
                      <p className="font-bold text-error-light">
                        {fileRejections[0].errors[0].message}
                      </p>
                    ) : (
                      <>
                        <p>
                          Letak fail imej di sini, atau klik untuk pilih fail...
                        </p>
                        <p className="mt-1 font-semibold">
                          (Max {maxFileSizeInMb}MB)
                        </p>
                      </>
                    )}

                    {isDragAccept && (
                      <p className="font-bold text-approveGreen">
                        Fail diterima!
                      </p>
                    )}
                    {isDragReject && (
                      <p className="font-bold text-error-light">
                        Fail tidak dapat diterima
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="newsTexts"
                  className="text-lg font-semibold"
                >
                  Jam-jam dunia&nbsp;
                  <Asterisk />
                </label>

                <div className="flex flex-col gap-2 p-3 rounded-xl bg-primary-dark">
                  {worldClocks.map((wc, index) => (
                    <div
                      key={index}
                      className="flex w-full gap-2 p-3 rounded-2xl bg-primary-darker"
                    >
                      <div className="relative flex flex-col w-full gap-2">
                        <input
                          id={`wc-${index}`}
                          type="text"
                          placeholder="Masukkan nama bandar..."
                          className="w-full py-2 pl-4 pr-10 text-lg bg-primary-light rounded-xl"
                          value={wc.city}
                          onChange={(e) =>
                            setWorldClocks(
                              worldClocks.map((wc, i) =>
                                i === index
                                  ? { ...wc, city: e.target.value }
                                  : wc
                              )
                            )
                          }
                        />
                        <Select
                          id={`wc-tz-${index}`}
                          className="w-full text-lg text-white border-none bg-primary-light rounded-xl"
                          options={allTimezones.map((tz) => ({
                            value: tz,
                            label: tz,
                          }))}
                          isClearable
                          placeholder="Pilih zon masa..."
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: "#1C5153",
                              borderRadius: "0.75rem",
                              borderColor: state.isFocused
                                ? "#188D92"
                                : "#1C5153",
                              height: "3rem",
                            }),
                            input: (base) => ({
                              ...base,
                              color: "white",
                            }),
                            singleValue: (base) => ({
                              ...base,
                              color: "white",
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: "#c7c7c7",
                            }),
                            menu: (base) => ({
                              ...base,
                              backgroundColor: "#133D3E",
                            }),
                            groupHeading: (base) => ({
                              ...base,
                              backgroundColor: "#133D3E",
                              color: "white",
                              fontSize: "1.25rem",
                              padding: "0 0.5rem 0.5rem 0.5rem",
                            }),
                            option: (base, state) => ({
                              ...base,
                              backgroundColor: state.isFocused
                                ? "#188D92"
                                : "#1C5153",
                              color: "white",
                            }),
                          }}
                          value={
                            wc.timezone
                              ? {
                                  value: wc.timezone,
                                  label: wc.timezone,
                                }
                              : null
                          }
                          onChange={(selected) => {
                            if (!selected?.value) {
                              return
                            }

                            setWorldClocks(
                              worldClocks.map((wc, i) =>
                                i === index
                                  ? { ...wc, timezone: selected.value }
                                  : wc
                              )
                            )
                          }}
                        />
                      </div>
                      <div
                        className="flex items-center justify-center px-3 text-xl transition rounded-lg bg-red hover:bg-red/80 hover:cursor-pointer"
                        onClick={() => {
                          setWorldClocks(
                            worldClocks.filter((wc, i) => i !== index)
                          )
                        }}
                      >
                        <FaTrash />
                      </div>
                    </div>
                  ))}
                  <div
                    className="flex items-center self-end gap-2 px-4 py-2 flex-nowrap bg-primary-lighter rounded-xl hover:bg-primary-lighter/70 hover:cursor-pointer"
                    onClick={() => {
                      if (worldClocks.length >= 7) {
                        toast.error("Maksimum 7 jam dunia sahaja dibenarkan.")
                        return
                      }

                      setWorldClocks([
                        ...worldClocks,
                        { city: "", timezone: "" },
                      ])
                    }}
                  >
                    <span className="text-xl">
                      <FaPlus />
                    </span>
                    Tambah Jam Dunia
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
                  {loadingSubmit ? <LoadingIndicator /> : "Kemaskini Jam Dunia"}
                </button>
              </div>
            </form>
          </ZoomAndFade>
        </>
      )}
    </div>
  )
}

export default MasjidWorldClockSettings
