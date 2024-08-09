"use client"

import { ZoomAndFade } from "components/Animations"
import LoadingIndicator from "components/LoadingIndicator"
import Modal from "components/Modal"
import { getJWTToken } from "lib/auth"
import fetchJson from "lib/fetchJson"
import { formatFileSize, getExtension } from "lib/string"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { BiSolidImageAdd } from "react-icons/bi"
import { FaTrash } from "react-icons/fa"
import { IoMdAdd, IoMdRefresh } from "react-icons/io"
import { MdEdit } from "react-icons/md"
import { toast } from "react-toastify"
import {
  CreateEventRequest,
  CreateEventResponse,
  DeleteEventRequest,
  EventResponse,
  MasjidAndBriefEventsResponse,
  UpdateEventRequest,
} from "types/event"

const maxFileSizeInMb = 50

const MasjidEvents = ({ id }: { id: string }) => {
  const [data, setData] = useState<MasjidAndBriefEventsResponse>()
  const [loading, setLoading] = useState(true)
  const [createNewModalOpen, setCreateNewModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [uploadPictureModalOpen, setUploadPictureModalOpen] = useState(false)
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<EventResponse | null>(null)

  const fetchData = async () => {
    setLoading(true)

    try {
      const data = await fetchJson<MasjidAndBriefEventsResponse>(
        `/api/masjid/${id}/events`
      )

      setData(data)
    } catch (error) {
      toast.error(
        error.message ?? "Error berlaku semasa mengambil aktiviti-aktiviti."
      )
    }

    setLoading(false)
  }

  const EventItems = () => {
    if (loading) {
      return <LoadingIndicator />
    }

    if (!loading && data.events.length === 0) {
      return <p>Tiada aktiviti-aktiviti ditemui.</p>
    }

    return (
      <div className="flex flex-wrap justify-center gap-2">
        {data.events.map((item) => (
          <ZoomAndFade
            key={item.id}
            className="relative flex items-center py-4 overflow-hidden text-white transition bg-primary hover:bg-primary-light w-[480px] hover:cursor-pointer rounded-2xl"
          >
            <div className="flex flex-col p-2 mx-2 text-lg">
              <span className="text-sm">Tajuk:</span>
              <span className="mb-2 text-2xl font-bold">{item.title}</span>
              {item.firstPicture &&
                (["mp4", "mov", "avi"].includes(
                  getExtension(item.firstPicture)
                ) ? (
                  <video
                    className="w-full h-auto"
                    src={`/api/masjid/${id}/events/${item.id}/picture/${item.firstPicture}`}
                    autoPlay
                    loop
                    muted
                    width={640}
                    height={480}
                  />
                ) : (
                  <Image
                    className="w-full h-auto"
                    src={`/api/masjid/${id}/events/${item.id}/picture/${item.firstPicture}`}
                    alt={item.firstPicture}
                    width={640}
                    height={480}
                  />
                ))}
              <div className="flex flex-wrap items-end gap-2 mt-3">
                <button
                  className="flex items-center gap-1 px-3 py-2 transition rounded-lg bg-primary-lighter/40 hover:bg-primary-lighter flex-nowrap"
                  onClick={() => {
                    setSelectedItem({
                      ...item,
                      startDateTime: new Date(item.startDateTime),
                      endDateTime: new Date(item.endDateTime),
                    })
                    setUpdateModalOpen(true)
                  }}
                >
                  <span className="text-3xl">
                    <MdEdit />
                  </span>
                  <span className="text-base">Kemaskini</span>
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-2 transition rounded-lg bg-primary-lighter/40 hover:bg-primary-lighter flex-nowrap"
                  onClick={() => {
                    setSelectedItem({
                      ...item,
                      startDateTime: new Date(item.startDateTime),
                      endDateTime: new Date(item.endDateTime),
                    })
                    setUploadPictureModalOpen(true)
                  }}
                >
                  <span className="text-3xl">
                    <BiSolidImageAdd />
                  </span>
                  <span className="text-base">Muat naik gambar</span>
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-2 transition rounded-lg bg-red-light/40 hover:bg-red-light flex-nowrap"
                  onClick={() => {
                    setSelectedItem({
                      ...item,
                      startDateTime: new Date(item.startDateTime),
                      endDateTime: new Date(item.endDateTime),
                    })
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
          </ZoomAndFade>
        ))}
      </div>
    )
  }

  const CreateEventModal = () => {
    const [loadingCreate, setLoadingCreate] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [newEvent, setNewEvent] = useState<CreateEventRequest>({
      title: "",
      description: "",
      location: "",
      startDateTime: new Date(),
      endDateTime: new Date(),
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      setLoadingCreate(true)
      e.preventDefault()

      try {
        setErrorMessage("")
        await fetchJson<CreateEventResponse>(`/api/masjid/${id}/events`, {
          method: "POST",
          body: JSON.stringify(newEvent),
        })

        toast.success("Aktiviti berjaya ditambah!")

        fetchData()
        setCreateNewModalOpen(false)
      } catch (error) {
        setErrorMessage(
          error.message ??
            error.error ??
            "Error berlaku semasa membuat aktiviti baharu."
        )
        toast.error(
          error.message ??
            error.error ??
            "Error berlaku semasa membuat aktiviti baharu."
        )
      }

      setLoadingCreate(false)
    }

    return (
      <div className="flex flex-col max-w-screen-sm p-4 rounded-lg w-80 lg:w-[512px] bg-primary-darker">
        <h1 className="mb-4 text-2xl font-bold">Tambah Aktiviti Baharu</h1>

        {errorMessage && (
          <p className="mb-4 text-lg text-error-light">{errorMessage}</p>
        )}

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
              required
              placeholder="Contoh: Program Tadarus"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description">Penerangan</label>
            <textarea
              id="description"
              name="description"
              className="p-2 text-md rounded-xl bg-primary-light"
              required
              placeholder="Contoh: Program tadarus akan diadakan setiap malam Jumaat."
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="location">Tempat</label>
            <input
              type="text"
              id="location"
              name="location"
              className="p-2 text-md rounded-xl bg-primary-light"
              required
              placeholder="Contoh: Block A, Surau Al-Muttaqin, MSQ"
              value={newEvent.location}
              onChange={(e) =>
                setNewEvent({ ...newEvent, location: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="startDate">Tarikh Bermula</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="p-2 text-md rounded-xl bg-primary-light"
              required
              value={newEvent.startDateTime.toISOString().split("T")[0]}
              onChange={(e) => {
                try {
                  new Date(e.target.value).toISOString().split("T")[0]

                  setNewEvent({
                    ...newEvent,
                    startDateTime: new Date(e.target.value),
                  })
                } catch (error) {
                  console.error(error)
                }
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="endDate">Tarikh Tamat</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="p-2 text-md rounded-xl bg-primary-light"
              required
              value={newEvent.endDateTime.toISOString().split("T")[0]}
              onChange={(e) => {
                try {
                  new Date(e.target.value).toISOString().split("T")[0]

                  setNewEvent({
                    ...newEvent,
                    endDateTime: new Date(e.target.value),
                  })
                } catch (error) {
                  console.error(error)
                }
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="startTime">Masa Bermula</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              className="p-2 text-md rounded-xl bg-primary-light"
              required
              value={newEvent.startDateTime.toTimeString().split(" ")[0]}
              onChange={(e) => {
                try {
                  if (!e.target.value) {
                    throw new Error("Invalid time")
                  }

                  setNewEvent({
                    ...newEvent,
                    startDateTime: new Date(
                      `${newEvent.startDateTime.toISOString().split("T")[0]}T${e.target.value}`
                    ),
                  })
                } catch (error) {
                  console.error(error)
                }
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="endTime">Masa Tamat</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              className="p-2 text-md rounded-xl bg-primary-light"
              required
              value={newEvent.endDateTime.toTimeString().split(" ")[0]}
              onChange={(e) => {
                try {
                  if (!e.target.value) {
                    throw new Error("Invalid time")
                  }

                  setNewEvent({
                    ...newEvent,
                    endDateTime: new Date(
                      `${newEvent.endDateTime.toISOString().split("T")[0]}T${e.target.value}`
                    ),
                  })
                } catch (error) {
                  console.error(error)
                }
              }}
            />
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

  const UpdateEventModal = () => {
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [event, setEvent] = useState<UpdateEventRequest>({
      title: selectedItem?.title ?? "",
      description: selectedItem?.description ?? "",
      location: selectedItem?.location ?? "",
      startDateTime: selectedItem?.startDateTime ?? new Date(),
      endDateTime: selectedItem?.endDateTime ?? new Date(),
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      setLoadingUpdate(true)
      e.preventDefault()

      try {
        setErrorMessage("")
        await fetchJson(`/api/masjid/${id}/events/${selectedItem.id}`, {
          method: "PUT",
          body: JSON.stringify(event),
        })

        toast.success("Aktiviti berjaya dikemaskini!")

        fetchData()
        setUpdateModalOpen(false)
      } catch (error) {
        setErrorMessage(
          error.message ??
            error.error ??
            "Error berlaku semasa kemasikini aktiviti."
        )
        toast.error(
          error.message ??
            error.error ??
            "Error berlaku semasa kemasikini aktiviti."
        )
      }

      setLoadingUpdate(false)
    }

    if (!selectedItem) {
      setUpdateModalOpen(false)
      return <p>Aktiviti tidak ditemui.</p>
    }

    return (
      <div className="flex flex-col max-w-screen-sm p-4 rounded-lg w-[512px] bg-primary-darker">
        <h1 className="mb-4 text-2xl font-bold">Kemaskini Aktiviti</h1>

        {errorMessage && (
          <p className="mb-4 text-lg text-error-light">{errorMessage}</p>
        )}

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
              required
              placeholder="Contoh: Program Tadarus"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description">Penerangan</label>
            <textarea
              id="description"
              name="description"
              className="p-2 text-md rounded-xl bg-primary-light"
              required
              placeholder="Contoh: Program tadarus akan diadakan setiap malam Jumaat."
              value={event.description}
              onChange={(e) =>
                setEvent({ ...event, description: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="location">Tempat</label>
            <input
              type="text"
              id="location"
              name="location"
              className="p-2 text-md rounded-xl bg-primary-light"
              required
              placeholder="Contoh: Block A, Surau Al-Muttaqin, MSQ"
              value={event.location}
              onChange={(e) => setEvent({ ...event, location: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="startDate">Tarikh Bermula</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="p-2 text-md rounded-xl bg-primary-light"
              required
              value={event.startDateTime.toISOString().split("T")[0]}
              onChange={(e) =>
                setEvent({
                  ...event,
                  startDateTime: new Date(e.target.value),
                })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="endDate">Tarikh Tamat</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="p-2 text-md rounded-xl bg-primary-light"
              required
              value={event.endDateTime.toISOString().split("T")[0]}
              onChange={(e) =>
                setEvent({
                  ...event,
                  endDateTime: new Date(e.target.value),
                })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="startTime">Masa Bermula</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              className="p-2 text-md rounded-xl bg-primary-light"
              required
              value={event.startDateTime.toTimeString().split(" ")[0]}
              onChange={(e) =>
                setEvent({
                  ...event,
                  startDateTime: new Date(
                    `${event.startDateTime.toISOString().split("T")[0]}T${e.target.value}`
                  ),
                })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="endTime">Masa Tamat</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              className="p-2 text-md rounded-xl bg-primary-light"
              required
              value={event.endDateTime.toTimeString().split(" ")[0]}
              onChange={(e) =>
                setEvent({
                  ...event,
                  endDateTime: new Date(
                    `${event.endDateTime.toISOString().split("T")[0]}T${e.target.value}`
                  ),
                })
              }
            />
          </div>

          <button
            type="submit"
            className="py-2 pl-3 pr-4 ml-auto transition rounded-lg bg-accent-dark hover:bg-accent-dark/70 flex-nowrap disabled:opacity-50"
            disabled={loadingUpdate}
          >
            <span className="text-lg">
              {loadingUpdate ? "Memuat naik maklumat..." : "Kemaskini"}
            </span>
          </button>
        </form>
      </div>
    )
  }

  const UploadPictureForEventModal = () => {
    const [file, setFile] = useState<File | null>(null)
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

      try {
        const token = getJWTToken()

        if (!token) {
          throw new Error("Sila log masuk untuk memaut naik maklumat ini.")
        }

        const res = await fetch(
          `/api/masjid/${id}/events/${selectedItem.id}/picture`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        )

        if (!res.ok) {
          throw await res.json()
        }

        await res.json()

        toast.success(
          `Gambar untuk aktiviti "${selectedItem.title}" berjaya dimuat naik!`
        )

        fetchData()
        setUploadPictureModalOpen(false)
      } catch (error) {
        toast.error(
          error.message ??
            error.error ??
            "Error berlaku semasa memuat naik gambar."
        )
      }

      setLoadingCreate(false)
    }

    if (!selectedItem) {
      setUploadPictureModalOpen(false)
      return <p>Aktiviti tidak ditemui.</p>
    }

    return (
      <div className="flex flex-col max-w-screen-sm p-4 rounded-lg w-[512px] bg-primary-darker">
        <h1 className="mb-4 text-2xl font-bold">Muat Naik Gambar Baharu</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <p>
            Muat naik gambar untuk aktiviti<br></br>
            <span className="text-2xl italic font-bold">
              &quot;{selectedItem.title}&quot;
            </span>
          </p>
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
              {loadingCreate ? "Memuat naik..." : "Muat Naik"}
            </span>
          </button>
        </form>
      </div>
    )
  }

  const DeleteEventModal = () => {
    const [loadingDelete, setLoadingDelete] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      setLoadingDelete(true)
      e.preventDefault()

      const data: DeleteEventRequest = {
        id: selectedItem.id,
      }

      try {
        await fetchJson(`/api/masjid/${id}/events`, {
          method: "DELETE",
          body: JSON.stringify(data),
        })

        toast.success("Aktiviti berjaya dipadamkan!")

        fetchData()
        setSelectedItem(null)
        setConfirmDeleteModalOpen(false)
      } catch (error) {
        toast.error(
          error.message ??
            error.error ??
            "Error berlaku semasa memadamkan aktiviti."
        )
      }

      setLoadingDelete(false)
    }

    if (!selectedItem) {
      setConfirmDeleteModalOpen(false)
      return <p>Aktiviti tidak ditemui.</p>
    }

    return (
      <div className="flex flex-col max-w-screen-sm p-4 text-white rounded-lg w-[512px] bg-primary-light">
        <h1 className="mb-4 text-2xl font-bold">Pemadaman Aktiviti</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <p className="text-md">
            Adakah anda ingin memadamkan aktiviti<br></br>&nbsp;
            <span className="text-xl font-semibold">
              &quot;{selectedItem.title}&quot;
            </span>
            ?
          </p>
          {selectedItem.firstPicture &&
            (["mp4", "mov", "avi"].includes(
              getExtension(selectedItem.firstPicture)
            ) ? (
              <video
                className="w-full h-auto"
                src={`/api/masjid/${id}/events/${selectedItem.id}/picture/${selectedItem.firstPicture}`}
                autoPlay
                loop
                muted
              />
            ) : (
              <Image
                className="w-full h-auto"
                src={`/api/masjid/${id}/events/${selectedItem.id}/picture/${selectedItem.firstPicture}`}
                alt={selectedItem.firstPicture}
                width={1920}
                height={1080}
              />
            ))}

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
    fetchData()
  }, [])

  return (
    <div className="flex flex-col w-full lg:max-w-5xl">
      <Modal
        show={createNewModalOpen}
        onClose={() => setCreateNewModalOpen(false)}
      >
        <CreateEventModal />
      </Modal>
      <Modal
        show={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      >
        <UpdateEventModal />
      </Modal>
      <Modal
        show={uploadPictureModalOpen}
        onClose={() => setUploadPictureModalOpen(false)}
      >
        <UploadPictureForEventModal />
      </Modal>
      <Modal
        show={confirmDeleteModalOpen}
        onClose={() => setConfirmDeleteModalOpen(false)}
      >
        <DeleteEventModal />
      </Modal>

      <ZoomAndFade className="flex flex-col w-full mb-4">
        <h1 className="w-full mb-4 text-4xl font-bold">
          Aktiviti-aktiviti / Program Masjid
        </h1>
        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-1 py-2 pl-3 pr-4 transition rounded-lg bg-gray/50 hover:bg-gray/70 flex-nowrap"
            onClick={() => fetchData()}
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
        </div>
      </ZoomAndFade>
      <EventItems />
    </div>
  )
}

export default MasjidEvents
