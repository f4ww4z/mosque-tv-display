"use client"

import { ZoomAndFade } from "components/Animations"
import LoadingIndicator from "components/LoadingIndicator"
import Modal from "components/Modal"
import { getPrayerImageFieldName } from "lib/azanUtils"
import { getJWTToken } from "lib/auth"
import fetchJson from "lib/fetchJson"
import { formatFileSize } from "lib/string"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FaTrash, FaUpload } from "react-icons/fa"
import { IoIosExit, IoMdRefresh } from "react-icons/io"
import { toast } from "react-toastify"
import { AzanImagesResponse, PrayerName } from "types/azan"

const maxFileSizeInMb = 10

interface PrayerInfo {
  key: PrayerName
  label: string
  labelEn: string
}

const prayers: PrayerInfo[] = [
  { key: "fajr", label: "Subuh", labelEn: "Fajr" },
  { key: "dhuhr", label: "Zohor", labelEn: "Dhuhr" },
  { key: "asr", label: "Asar", labelEn: "Asr" },
  { key: "maghrib", label: "Maghrib", labelEn: "Maghrib" },
  { key: "isha", label: "Isyak", labelEn: "Isha" },
]

const MasjidAzanImages = ({ id }: { id: string }) => {
  const [azanImages, setAzanImages] = useState<AzanImagesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerInfo | null>(null)

  const fetchAzanImages = async () => {
    setLoading(true)

    try {
      const data = await fetchJson<AzanImagesResponse>(
        `/api/masjid/${id}/azan-images`
      )

      setAzanImages(data)
    } catch (error) {
      toast.error(
        error.message ?? "Error berlaku semasa mengambil imej-imej azan."
      )
    }

    setLoading(false)
  }

  const UploadAzanImageModal = () => {
    const [file, setFile] = useState<File | null>(null)
    const [loadingUpload, setLoadingUpload] = useState(false)

    const onDrop = (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0])
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      setLoadingUpload(true)
      e.preventDefault()

      if (!file || !selectedPrayer) {
        return
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("prayerName", selectedPrayer.key)

      try {
        const token = getJWTToken()

        if (!token) {
          throw new Error("Sila log masuk untuk memuat naik imej ini.")
        }

        const res = await fetch(`/api/masjid/${id}/azan-images`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (!res.ok) {
          throw await res.json()
        }

        const result = await res.json()

        toast.success(result.message)

        fetchAzanImages()

        setUploadModalOpen(false)
        setFile(null)
        setSelectedPrayer(null)
      } catch (error) {
        toast.error(
          error.message ??
            error.error ??
            "Error berlaku semasa memuat naik imej azan."
        )
      }

      setLoadingUpload(false)
    }

    if (!selectedPrayer) {
      return <p>Prayer not selected.</p>
    }

    return (
      <div className="flex flex-col max-w-screen-sm p-4 rounded-lg lg:w-[512px] bg-primary-darker">
        <h1 className="mb-4 text-2xl font-bold">
          Muat Naik Imej Azan - {selectedPrayer.label}
        </h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="file">
              Fail (disyorkan 1920x1080, max {maxFileSizeInMb}MB)
            </label>
            <div
              {...getRootProps()}
              className="relative flex flex-col items-center justify-center p-2 text-center transition border border-dashed rounded-md hover:cursor-pointer h-60 hover:bg-primary-light"
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="flex flex-col items-center">
                  <p className="mb-1 font-semibold">
                    {formatFileSize(file.size)} - {file.name}
                  </p>
                  <Image
                    className="h-44 w-fit"
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={1920}
                    height={1080}
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
                  <p>Letak fail imej di sini, atau klik untuk pilih fail...</p>
                  <p className="mt-1 font-semibold">
                    (Max {maxFileSizeInMb}MB)
                  </p>
                </>
              )}

              {isDragAccept && (
                <p className="font-bold text-approveGreen">Fail diterima!</p>
              )}
              {isDragReject && (
                <p className="font-bold text-error-light">
                  Fail tidak dapat diterima
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="py-2 pl-3 pr-4 ml-auto transition rounded-lg bg-accent-dark hover:bg-accent-dark/70 flex-nowrap disabled:opacity-50"
            disabled={loadingUpload || !file}
          >
            <span className="text-lg">
              {loadingUpload ? "Memuat naik..." : "Muat Naik"}
            </span>
          </button>
        </form>
      </div>
    )
  }

  const DeleteAzanImageModal = () => {
    const [loadingDelete, setLoadingDelete] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      setLoadingDelete(true)
      e.preventDefault()

      if (!selectedPrayer) {
        return
      }

      try {
        const res = await fetchJson<{ message: string }>(
          `/api/masjid/${id}/azan-images`,
          {
            method: "DELETE",
            body: JSON.stringify({ prayerName: selectedPrayer.key }),
          }
        )

        toast.success(res.message)

        fetchAzanImages()
        setSelectedPrayer(null)
        setDeleteModalOpen(false)
      } catch (error) {
        toast.error(
          error.message ??
            error.error ??
            "Error berlaku semasa memadamkan imej azan."
        )
      }

      setLoadingDelete(false)
    }

    if (!selectedPrayer) {
      return <p>Prayer not selected.</p>
    }

    const imageFieldKey = getPrayerImageFieldName(
      selectedPrayer.key
    ) as keyof AzanImagesResponse
    const imageFileName = azanImages?.[imageFieldKey]

    return (
      <div className="flex flex-col max-w-screen-sm p-4 text-white rounded-lg w-[512px] bg-primary-light">
        <h1 className="mb-4 text-2xl font-bold">Pemadaman Imej Azan</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <p className="text-md">
            Adakah anda ingin memadamkan imej azan untuk waktu&nbsp;
            <span className="font-semibold">{selectedPrayer.label}</span>?
          </p>
          {imageFileName && (
            <Image
              className="w-full h-auto"
              src={`/api/masjid/${id}/azan-images/${imageFileName}`}
              alt={`Azan ${selectedPrayer.label}`}
              width={1920}
              height={1080}
            />
          )}

          <p className="font-semibold text-red-400 text-md">
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <button
            type="submit"
            className="px-4 py-2 ml-auto transition rounded-lg bg-red hover:bg-red/80 flex-nowrap disabled:opacity-30"
            disabled={loadingDelete}
          >
            <span className="text-md">Padam</span>
          </button>
        </form>
      </div>
    )
  }

  useEffect(() => {
    fetchAzanImages()
  }, [])

  const getImageFileName = (prayerKey: PrayerName): string | null => {
    if (!azanImages) return null
    const fieldKey = getPrayerImageFieldName(
      prayerKey
    ) as keyof AzanImagesResponse
    return azanImages[fieldKey] || null
  }

  return (
    <div className="flex flex-col w-full">
      <Modal
        show={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      >
        <UploadAzanImageModal />
      </Modal>
      <Modal
        show={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DeleteAzanImageModal />
      </Modal>

      <ZoomAndFade className="flex flex-col items-center gap-2 mb-4 lg:gap-0 lg:flex-row">
        <h1 className="text-4xl font-bold">Imej Azan</h1>
        <button
          className="flex items-center gap-1 py-2 pl-3 pr-4 ml-4 transition rounded-lg bg-gray/50 hover:bg-gray/70 flex-nowrap"
          onClick={() => fetchAzanImages()}
        >
          <span className="text-3xl">
            <IoMdRefresh />
          </span>
          <span className="text-md">Muat semula</span>
        </button>
        <Link
          className="flex items-center gap-1 py-2 pl-3 pr-4 ml-3 transition rounded-lg bg-accent-dark hover:bg-accent-dark/80 flex-nowrap"
          href={`/signage/${id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-3xl">
            <IoIosExit />
          </span>
          <span className="text-md">Ke Paparan Digital TV</span>
        </Link>
      </ZoomAndFade>

      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
          {prayers.map((prayer) => {
            const imageFileName = getImageFileName(prayer.key)
            return (
              <div
                key={prayer.key}
                className="flex flex-col overflow-hidden transition bg-primary hover:bg-primary-light rounded-2xl"
              >
                <div className="relative w-full h-48 bg-primary-darker">
                  {imageFileName ? (
                    <Image
                      className="object-contain w-full h-full"
                      src={`/api/masjid/${id}/azan-images/${imageFileName}`}
                      alt={`Azan ${prayer.label}`}
                      width={640}
                      height={480}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      <p>Tiada imej</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col p-4 text-white">
                  <h3 className="mb-2 text-xl font-bold">{prayer.label}</h3>
                  <p className="mb-3 text-sm text-gray-300">{prayer.labelEn}</p>
                  <div className="flex gap-2">
                    <button
                      className="flex items-center justify-center flex-1 gap-2 px-3 py-2 transition rounded-lg bg-primary-lighter hover:bg-primary-lighter/80"
                      onClick={() => {
                        setSelectedPrayer(prayer)
                        setUploadModalOpen(true)
                      }}
                    >
                      <FaUpload />
                      <span>{imageFileName ? "Tukar" : "Muat Naik"}</span>
                    </button>
                    {imageFileName && (
                      <button
                        className="flex items-center justify-center gap-2 px-3 py-2 transition rounded-lg bg-red-light/40 hover:bg-red-light"
                        onClick={() => {
                          setSelectedPrayer(prayer)
                          setDeleteModalOpen(true)
                        }}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MasjidAzanImages
