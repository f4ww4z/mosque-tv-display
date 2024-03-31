"use client"

import { CarouselItem } from "@prisma/client"
import fetchJson from "lib/fetchJson"
import { formatFileSize, getExtension } from "lib/string"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { BiSolidHide } from "react-icons/bi"
import { FaTrash } from "react-icons/fa"
import { GrFormViewHide } from "react-icons/gr"
import { IoMdAdd, IoMdRefresh } from "react-icons/io"
import { toast } from "react-toastify"
import Sortable from "sortablejs"
import { CarouselItemDeleteRequest, CarouselSwapRequest } from "types/carousel"
import Modal from "./Modal"

const maxFileSizeInMb = 50

const AdminCarouselSection = () => {
  const [items, setItems] = useState<CarouselItem[]>([])
  const [loading, setLoading] = useState(true)
  const [createNewModalOpen, setCreateNewModalOpen] = useState(false)
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<CarouselItem | null>(null)

  const fetchCarouselData = async () => {
    setLoading(true)

    try {
      const data = await fetchJson<CarouselItem[]>("/api/carousel")

      setItems(data)
    } catch (error) {
      toast.error(
        error.message ?? "An error occurred while fetching carousels."
      )
    }

    setLoading(false)
  }

  const onItemHideOrUnhide = async (itemId: string) => {
    try {
      const res = await fetchJson<{ message: string }>(
        `/api/carousel/hide/${itemId}`,
        {
          method: "PATCH",
        }
      )

      toast.success(res.message)

      fetchCarouselData()
    } catch (error) {
      toast.error(
        error.message ??
          "An error occurred while hiding/unhiding carousel item."
      )
    }
  }

  const CarouselItems = () => {
    if (loading) {
      return <p>Loading...</p>
    }

    if (!loading && items.length === 0) {
      return <p>No items found.</p>
    }

    return (
      <ul
        id="carousel-items"
        className="flex flex-wrap gap-2 p-4"
      >
        {items.map((item) => (
          <li
            key={item.id}
            className={`${item.hidden ? "bg-gray-800 hover:bg-gray-700" : "bg-cyan-800 hover:bg-teal-700"} flex relative items-center w-[600px] text-white overflow-hidden transition hover:cursor-move h-48 rounded-2xl`}
          >
            {["mp4", "mov", "avi"].includes(getExtension(item.filename)) ? (
              <video
                className={`${item.hidden && "grayscale"} w-auto h-full`}
                src={`/api/carousel/${item.filename}`}
                autoPlay
                loop
                muted
              />
            ) : (
              <Image
                className={`${item.hidden && "grayscale"} w-auto h-full`}
                src={`/api/carousel/${item.filename}`}
                alt={item.filename}
                width={1920}
                height={1080}
              />
            )}
            <div className="flex flex-col p-2 mx-2 text-lg">
              <span className="font-bold">Title:</span>
              <span>{item.title}</span>
              <div className="flex items-end gap-2 mt-3 flex-nowrap">
                <button
                  className={`${item.hidden ? "bg-teal-600 hover:bg-teal-500" : "bg-gray-600 hover:bg-cyan-500"} flex items-center gap-1 px-3 py-2 transition rounded-lg flex-nowrap`}
                  onClick={() => onItemHideOrUnhide(item.id)}
                >
                  <span className="text-3xl">
                    {item.hidden ? <GrFormViewHide /> : <BiSolidHide />}
                  </span>
                  <span className="text-base">
                    {item.hidden ? "Unhide" : "Hide"}
                  </span>
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-2 transition bg-gray-600 rounded-lg hover:bg-red-700 flex-nowrap"
                  onClick={() => {
                    setItemToDelete(item)
                    setConfirmDeleteModalOpen(true)
                  }}
                >
                  <span className="text-2xl py-[3px]">
                    <FaTrash />
                  </span>
                  <span className="text-base">Remove</span>
                </button>
              </div>
            </div>
            <div className="absolute flex items-center justify-center w-8 h-8 font-semibold text-center rounded-full top-2 right-2 bg-black/60">
              {item.order}
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
        const res = await fetch("/api/carousel", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          throw await res.json()
        }

        const item = (await res.json()) as CarouselItem

        toast.success(`Carousel item ${item.order} created successfully!`)

        fetchCarouselData()

        setCreateNewModalOpen(false)
      } catch (error) {
        toast.error(
          error.message ??
            error.error ??
            "An error occurred while creating carousel item."
        )
      }

      setLoadingCreate(false)
    }

    return (
      <div className="flex flex-col max-w-screen-sm p-4 text-white rounded-lg w-[512px] bg-cyan-900">
        <h1 className="mb-4 text-2xl font-bold">Create Carousel Item</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="p-2 border border-gray-300 rounded-md bg-cyan-800 hover:bg-cyan-700 focus:bg-cyan-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="file">File</label>
            <div
              {...getRootProps()}
              className="relative flex flex-col items-center justify-center p-2 text-center transition border border-dashed rounded-md hover:cursor-pointer h-60 hover:bg-cyan-700"
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
                <p>Drop the file here...</p>
              ) : fileRejections.length > 0 ? (
                <p className="font-bold text-red-500">
                  {fileRejections[0].errors[0].message}
                </p>
              ) : (
                <>
                  <p>
                    Drag & drop an image or video file here, or click to select
                    files...
                  </p>
                  <p className="mt-1 font-semibold">
                    (Max {maxFileSizeInMb}MB)
                  </p>
                </>
              )}

              {isDragAccept && (
                <p className="font-bold text-green-500">File accepted!</p>
              )}
              {isDragReject && (
                <p className="font-bold text-red-500">File not accepted</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="py-2 pl-3 pr-4 ml-auto transition bg-teal-700 rounded-lg hover:bg-teal-800 flex-nowrap disabled:opacity-30"
            disabled={loadingCreate}
          >
            <span className="text-md">Create</span>
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
        const res = await fetchJson<{ message: string }>("/api/carousel", {
          method: "DELETE",
          body: JSON.stringify(data),
        })

        toast.success(res.message)

        fetchCarouselData()
        setItemToDelete(null)
        setConfirmDeleteModalOpen(false)
      } catch (error) {
        toast.error(
          error.message ??
            error.error ??
            "An error occurred while deleting carousel item."
        )
      }

      setLoadingDelete(false)
    }

    if (!itemToDelete) {
      setConfirmDeleteModalOpen(false)
      return <p>Item not found.</p>
    }

    return (
      <div className="flex flex-col max-w-screen-sm p-4 text-white rounded-lg w-[512px] bg-cyan-900">
        <h1 className="mb-4 text-2xl font-bold">Removing Carousel Item</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <p className="text-md">
            Are you sure to permanently remove carousel&nbsp;
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
              src={`/api/carousel/${itemToDelete.filename}`}
              autoPlay
              loop
              muted
            />
          ) : (
            <Image
              className="w-full h-auto"
              src={`/api/carousel/${itemToDelete.filename}`}
              alt={itemToDelete.filename}
              width={1920}
              height={1080}
            />
          )}

          <p className="font-semibold text-red-400 text-md">
            This action cannot be undone.
          </p>

          <button
            type="submit"
            className="px-4 py-2 ml-auto transition bg-red-700 rounded-lg hover:bg-red-600 flex-nowrap disabled:opacity-30"
            disabled={loadingDelete}
          >
            <span className="text-md">Remove</span>
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

          const res = await fetchJson<{ message: string }>(`/api/carousel`, {
            method: "PATCH",
            body: JSON.stringify(data),
          })

          toast.success(res.message)

          fetchCarouselData()
        } catch (error) {
          toast.error(
            error.message ??
              error.error ??
              "An error occurred while swapping carousel items."
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

      <div className="flex items-center">
        <h1 className="text-4xl font-bold">Carousel Items</h1>
        <button
          className="flex items-center gap-1 py-2 pl-3 pr-4 ml-4 transition bg-gray-700 rounded-lg hover:bg-cyan-900 flex-nowrap"
          onClick={() => fetchCarouselData()}
        >
          <span className="text-3xl">
            <IoMdRefresh />
          </span>
          <span className="text-md">Refresh</span>
        </button>
        <button
          className="flex items-center gap-1 py-2 pl-3 pr-4 ml-3 transition bg-teal-700 rounded-lg hover:bg-cyan-900 flex-nowrap"
          onClick={() => setCreateNewModalOpen(true)}
        >
          <span className="text-3xl">
            <IoMdAdd />
          </span>
          <span className="text-md">Add New</span>
        </button>
      </div>
      <CarouselItems />
    </div>
  )
}

export default AdminCarouselSection
