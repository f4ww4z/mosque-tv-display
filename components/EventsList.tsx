"use client"

import fetchJson from "lib/fetchJson"
import { getExtension, toSentenceCase } from "lib/string"
import moment from "moment"
import "moment/locale/ms"
import Image from "next/image"
import { useEffect, useState } from "react"
import { FaCalendarDay, FaMosque } from "react-icons/fa6"
import { GoClockFill } from "react-icons/go"
import { MdLocationOn } from "react-icons/md"
import { toast } from "react-toastify"
import { MasjidAndBriefEventsResponse } from "types/event"
import { ZoomAndFade } from "./Animations"
import LoadingIndicator from "./LoadingIndicator"
import Shimmer from "./Shimmer"

moment.locale("ms")

const EventsList = ({ masjidId }: { masjidId: string }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<MasjidAndBriefEventsResponse>()

  const fetchData = async () => {
    setLoading(true)

    try {
      const data = await fetchJson<MasjidAndBriefEventsResponse>(
        `/api/masjid/${masjidId}/events`
      )

      setData(data)
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

  if (!loading && (!data || data?.events?.length === 0)) {
    return <p>Tiada aktiviti-aktiviti ditemui.</p>
  }

  return (
    <div className="flex flex-wrap justify-center w-full gap-2 lg:max-w-5xl">
      <ZoomAndFade
        className={`drop-shadow-xl flex w-full max-w-4xl items-center gap-4 pl-8 pr-16 py-4 rounded-3xl bg-gradient-to-r from-${data.theme}-light to-${data.theme}-lighter flex-nowrap mb-4`}
      >
        <FaMosque className="text-white text-8xl w-52" />
        <div className="flex flex-col justify-start w-full gap-2">
          {!data ? (
            <>
              <Shimmer h={44} />
              <Shimmer h={32} />
            </>
          ) : (
            <>
              <p className="text-5xl font-bold">
                <span className={data.theme !== "gold" && `text-[#FFCD6C]`}>
                  {toSentenceCase(data.masjidType)}
                </span>
                &nbsp;{data.masjidName}
              </p>
              <p className="text-lg font-normal leading-tight">
                {data.masjidAddress}
              </p>
            </>
          )}
        </div>
      </ZoomAndFade>

      {data.events.map((item) => (
        <ZoomAndFade
          key={item.id}
          className={`relative flex items-center py-4 overflow-hidden text-white transition bg-${data.theme} hover:bg-${data.theme}-light w-[480px] hover:cursor-pointer rounded-2xl`}
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

export default EventsList
