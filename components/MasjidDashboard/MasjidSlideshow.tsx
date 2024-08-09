"use client"

import { CarouselItem } from "@prisma/client"
import { ZoomAndFade } from "components/Animations"
import LoadingIndicator from "components/LoadingIndicator"
import Modal from "components/Modal"
import { getJWTToken } from "lib/auth"
import fetchJson from "lib/fetchJson"
import { formatFileSize, getExtension } from "lib/string"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { BiSolidHide } from "react-icons/bi"
import { FaTrash } from "react-icons/fa"
import { GrFormViewHide } from "react-icons/gr"
import { IoIosExit, IoMdAdd, IoMdRefresh } from "react-icons/io"
import { toast } from "react-toastify"
import Sortable from "sortablejs"
import { CarouselItemDeleteRequest, CarouselSwapRequest } from "types/carousel"

const maxFileSizeInMb = 50

const MasjidSlideshow = ({ id }: { id: string }) => {
  const [items, setItems] = useState<CarouselItem[]>([])
  const [loading, setLoading] = useState(true)
  const [createNewModalOpen, setCreateNewModalOpen] = useState(false)
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<CarouselItem | null>(null)

  const fetchCarouselData = async () => {
    setLoading(true)

    try {
      const data = await fetchJson<CarouselItem[]>(`/api/masjid/${id}/carousel`)

      setItems(data)
    } catch (error) {
      toast.error(
        error.message ?? "Error berlaku semasa mengambil slaid-slaid."
      )
    }

    setLoading(false)
  }

  const onItemHideOrUnhide = async (itemId: string) => {
    try {
      const res = await fetchJson<{ message: string }>(
        `/api/masjid/${id}/carousel/hide/${itemId}`,
        {
          method: "PATCH",
        }
      )

      toast.success(res.message)

      fetchCarouselData()
    } catch (error) {
      toast.error(
        error.message ??
          "Error berlaku semasa menyembunyikan/menunjukkan semula slaid."
      )
    }
  }

  const CarouselItems = () => {
    if (loading) {
      return <LoadingIndicator />
    }

    if (!loading && items.length === 0) {
      return <p>Tiada slaid ditemui.</p>
    }

    return (
      <ul
        id="carousel-items"
        className="flex flex-wrap gap-2 p-4"
      >
        {items.map((item, idx) => (
          <li
            key={item.id}
            className={`${item.hidden ? "bg-gray hover:bg-gray/80" : "bg-primary hover:bg-primary-light"} flex relative items-center w-[600px] text-white overflow-hidden transition hover:cursor-move h-48 rounded-2xl`}
          >
            {["mp4", "mov", "avi"].includes(getExtension(item.filename)) ? (
              <video
                className={`${item.hidden && "grayscale"} w-auto max-w-60 md:max-w-80 h-full`}
                src={`/api/masjid/${id}/carousel/${item.filename}`}
                autoPlay
                loop
                muted
                width={640}
                height={480}
              />
            ) : (
              <Image
                className={`${item.hidden && "grayscale"} w-auto max-w-60 md:max-w-80 h-full object-cover`}
                src={`/api/masjid/${id}/carousel/${item.filename}`}
                alt={item.filename}
                width={640}
                height={480}
              />
            )}
            <div className="flex flex-col p-2 mx-2 text-lg">
              <span className="text-sm">Tajuk:</span>
              <span className="font-bold">{item.title}</span>
              <div className="flex flex-wrap items-end gap-2 mt-3">
                <button
                  className={`${item.hidden ? "bg-primary-lighter/40 hover:bg-primary-lighter" : "bg-gray/60 hover:bg-gray/80"} flex items-center gap-1 px-3 py-2 transition rounded-lg flex-nowrap`}
                  onClick={() => onItemHideOrUnhide(item.id)}
                >
                  <span className="text-3xl">
                    {item.hidden ? <GrFormViewHide /> : <BiSolidHide />}
                  </span>
                  <span className="text-base">
                    {item.hidden ? "Kemukakan" : "Sembunyikan"}
                  </span>
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-2 transition rounded-lg bg-red-light/40 hover:bg-red-light flex-nowrap"
                  onClick={() => {
                    setItemToDelete(item)
                    setConfirmDeleteModalOpen(true)
                  }}
                >
                  <span className="text-2xl py-[3px]">
                    <FaTrash />
                  </span>
                  <span className="text-base">Padam</span>
                </button>
              </div>
            </div>
            <div className="absolute flex items-center justify-center w-8 h-8 font-semibold text-center rounded-full top-2 right-2 bg-black/60">
              {idx + 1}
            </div>
          </li>
        ))}
      </ul>
    )
  }

  const CreateCarouselItemModal = () => {
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState("")
    const [loadingCreate, setLoadingCreate] = useState(false)

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
        "video/*": [".mp4", ".mov", ".avi"],
      },
      maxFiles: 1,
      maxSize: maxFileSizeInMb * 1024 * 1024,
      multiple: false,
      onDrop,
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      setLoadingCreate(true)
      e.preventDefault()

      if (!file) {
        return
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)

      try {
        const token = getJWTToken()

        if (!token) {
          throw new Error("Sila log masuk untuk memaut naik slaid ini.")
        }

        const res = await fetch(`/api/masjid/${id}/carousel`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (!res.ok) {
          throw await res.json()
        }

        const item = (await res.json()) as CarouselItem

        toast.success(`Slaid "${item.title}" berjaya dimuat naik!`)

        fetchCarouselData()

        setCreateNewModalOpen(false)
      } catch (error) {
        toast.error(
          error.message ?? error.error ?? "Error berlaku semasa membuat slaid."
        )
      }

      setLoadingCreate(false)
    }

    return (
      <div className="flex flex-col max-w-screen-sm p-4 rounded-lg lg:w-[512px] bg-primary-darker">
        <h1 className="mb-4 text-2xl font-bold">Tambah Slaid Baharu</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="title">Tajuk</label>
            <input
              type="text"
              id="title"
              name="title"
              className="p-2 text-md rounded-xl bg-primary-light"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="file">
              Fail (disyorkan 1080p, max {maxFileSizeInMb}MB)
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
                  {file.type.startsWith("image") ? (
                    <Image
                      className="h-44 w-fit"
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={1280}
                      height={720}
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      className="h-44 w-fit"
                      autoPlay
                      muted
                      loop
                    />
                  )}
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
                    Letak fail imej atau video di sini, atau klik untuk pilih
                    fail...
                  </p>
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
            disabled={loadingCreate}
          >
            <span className="text-lg">
              {loadingCreate ? "Memuat naik..." : "Tambah"}
            </span>
          </button>
        </form>
      </div>
    )
  }

  const DeleteCarouselItemModal = () => {
    const [loadingDelete, setLoadingDelete] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      setLoadingDelete(true)
      e.preventDefault()

      const data: CarouselItemDeleteRequest = {
        itemId: itemToDelete.id,
      }

      try {
        const res = await fetchJson<{ message: string }>(
          `/api/masjid/${id}/carousel`,
          {
            method: "DELETE",
            body: JSON.stringify(data),
          }
        )

        toast.success(res.message)

        fetchCarouselData()
        setItemToDelete(null)
        setConfirmDeleteModalOpen(false)
      } catch (error) {
        toast.error(
          error.message ??
            error.error ??
            "Error berlaku semasa memadamkan slaid."
        )
      }

      setLoadingDelete(false)
    }

    if (!itemToDelete) {
      setConfirmDeleteModalOpen(false)
      return <p>Item not found.</p>
    }

    return (
      <div className="flex flex-col max-w-screen-sm p-4 text-white rounded-lg w-[512px] bg-primary-light">
        <h1 className="mb-4 text-2xl font-bold">Pemadaman Slaid</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <p className="text-md">
            Adakah anda ingin memadamkan slaid&nbsp;
            <span className="font-semibold">
              &quot;{itemToDelete.title}&quot;
            </span>
            ?
          </p>
          {["mp4", "mov", "avi"].includes(
            getExtension(itemToDelete.filename)
          ) ? (
            <video
              className="w-full h-auto"
              src={`/api/masjid/${id}/carousel/${itemToDelete.filename}`}
              autoPlay
              loop
              muted
            />
          ) : (
            <Image
              className="w-full h-auto"
              src={`/api/masjid/${id}/carousel/${itemToDelete.filename}`}
              alt={itemToDelete.filename}
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
    fetchCarouselData()
  }, [])

  useEffect(() => {
    if (items.length === 0) {
      return
    }

    const carousel = document.getElementById("carousel-items")
    Sortable.create(carousel, {
      animation: 400,
      easing: "cubic-bezier(1, 0, 0, 1)",
      onEnd: async (event) => {
        const { oldIndex, newIndex } = event
        const itemSwapFrom = items[oldIndex]
        const itemSwapTo = items[newIndex]

        try {
          const data: CarouselSwapRequest = {
            itemSwapFromId: itemSwapFrom.id,
            itemSwapToId: itemSwapTo.id,
          }

          const res = await fetchJson<{ message: string }>(
            `/api/masjid/${id}/carousel`,
            {
              method: "PATCH",
              body: JSON.stringify(data),
            }
          )

          toast.success(res.message)

          fetchCarouselData()
        } catch (error) {
          toast.error(
            error.message ??
              error.error ??
              "Error berlaku semasa menukar slaid-slaid."
          )
        }
      },
    })
  }, [items])

  return (
    <div className="flex flex-col w-full">
      <Modal
        show={confirmDeleteModalOpen}
        onClose={() => setConfirmDeleteModalOpen(false)}
      >
        <DeleteCarouselItemModal />
      </Modal>
      <Modal
        show={createNewModalOpen}
        onClose={() => setCreateNewModalOpen(false)}
      >
        <CreateCarouselItemModal />
      </Modal>

      <ZoomAndFade className="flex flex-col items-center gap-2 mb-4 lg:gap-0 lg:flex-row">
        <h1 className="text-4xl font-bold">Paparan Slaid</h1>
        <button
          className="flex items-center gap-1 py-2 pl-3 pr-4 ml-4 transition rounded-lg bg-gray/50 hover:bg-gray/70 flex-nowrap"
          onClick={() => fetchCarouselData()}
        >
          <span className="text-3xl">
            <IoMdRefresh />
          </span>
          <span className="text-md">Muat semula</span>
        </button>
        <button
          className="flex items-center gap-1 py-2 pl-3 pr-4 ml-3 transition rounded-lg bg-primary-lighter hover:bg-primary-lighter/80 flex-nowrap"
          onClick={() => setCreateNewModalOpen(true)}
        >
          <span className="text-3xl">
            <IoMdAdd />
          </span>
          <span className="text-md">Tambah Baharu</span>
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
      <CarouselItems />
    </div>
  )
}

export default MasjidSlideshow
