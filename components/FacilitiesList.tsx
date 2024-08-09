"use client"

import { GoClockFill } from "react-icons/go"
import fetchJson from "lib/fetchJson"
import { getExtension } from "lib/string"
import Image from "next/image"
import { useEffect, useState } from "react"
import { MdLocationOn } from "react-icons/md"
import { toast } from "react-toastify"
import { EventResponse } from "types/event"
import { ZoomAndFade } from "./Animations"
import LoadingIndicator from "./LoadingIndicator"
import { FaCalendarDay } from "react-icons/fa6"
import moment from "moment"

moment.locale("ms")

const FacilitiesList = ({ masjidId }: { masjidId: string }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<EventResponse[]>()

  const fetchData = async () => {
    setLoading(true)

    try {
      const data = await fetchJson<EventResponse[]>(
        `/api/masjid/${masjidId}/events`
      )

      setItems(data)
    } catch (error) {
      toast.error(
        error.message ?? "Error berlaku semasa mengambil aktiviti-aktiviti."
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return <LoadingIndicator />
  }

  if (!loading && items.length === 0) {
    return <p>Tiada aktiviti-aktiviti ditemui.</p>
  }

  return (
    <div className="flex flex-wrap justify-center w-full gap-2 lg:max-w-5xl">
      {items.map((item) => (
        <ZoomAndFade
          key={item.id}
          className="relative flex items-center py-4 overflow-hidden text-white transition bg-primary hover:bg-primary-light w-[480px] hover:cursor-pointer rounded-2xl"
        >
          <div className="flex flex-col gap-2 p-2 mx-2 text-lg">
            <span className="mb-2 text-2xl font-bold">{item.title}</span>
            {item.firstPicture &&
              (["mp4", "mov", "avi"].includes(
                getExtension(item.firstPicture)
              ) ? (
                <video
                  className="w-full h-auto"
                  src={`/api/masjid/${masjidId}/events/${item.id}/picture/${item.firstPicture}`}
                  autoPlay
                  loop
                  muted
                  width={640}
                  height={480}
                />
              ) : (
                <Image
                  className="w-full h-auto"
                  src={`/api/masjid/${masjidId}/events/${item.id}/picture/${item.firstPicture}`}
                  alt={item.firstPicture}
                  width={640}
                  height={480}
                />
              ))}
            <p className="mt-2">{item.description}</p>
            <div className="flex w-full gap-2">
              <span className="text-2xl">
                <MdLocationOn />
              </span>
              <span>{item.location}</span>
            </div>
            <div className="flex w-full gap-2">
              <span className="text-2xl">
                <FaCalendarDay />
              </span>
              {new Date(item.startDateTime).toDateString() ===
              new Date(item.endDateTime).toDateString() ? (
                <>
                  <span>
                    {moment(item.startDateTime)
                      .locale("ms")
                      .format("dddd, DD MMM YYYY")}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {moment(item.startDateTime)
                      .locale("ms")
                      .format("DD/MM/YYYY")}
                  </span>
                  <span>-</span>
                  <span>
                    {moment(item.endDateTime).locale("ms").format("DD/MM/YYYY")}
                  </span>
                </>
              )}
            </div>
            <div className="flex w-full gap-2">
              <span className="text-2xl">
                <GoClockFill />
              </span>
              <span>{moment(item.startDateTime).format("HH:mm")}</span>
              <span>-</span>
              <span>{moment(item.endDateTime).format("HH:mm")}</span>
            </div>
          </div>
        </ZoomAndFade>
      ))}
    </div>
  )
}

export default FacilitiesList
