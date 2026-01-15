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
    <div className="flex flex-wrap justify-center w-full gap-3 lg:max-w-5xl pb-8">
      <ZoomAndFade
        className={`drop-shadow-xl flex w-full max-w-4xl items-center gap-3 md:gap-4 px-4 md:pl-8 md:pr-16 py-3 md:py-4 rounded-2xl md:rounded-3xl bg-gradient-to-r from-${data.theme}-light to-${data.theme}-lighter flex-nowrap mb-2 md:mb-4`}
      >
        {data.logoFilename ? (
          <Image
            src={`/api/masjid/${masjidId}/logo/${data.logoFilename}`}
            alt="Logo"
            width={208}
            height={208}
            className="object-contain w-16 h-16 md:w-32 lg:w-52 md:h-32 lg:h-52 bg-white rounded-lg p-1 md:p-2"
          />
        ) : (
          <FaMosque className="text-white text-4xl md:text-6xl lg:text-8xl w-16 md:w-32 lg:w-52" />
        )}
        <div className="flex flex-col justify-start w-full gap-1 md:gap-2">
          {!data ? (
            <>
              <Shimmer h={44} />
              <Shimmer h={32} />
            </>
          ) : (
            <>
              <p className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className={data.theme !== "gold" && `text-[#FFCD6C]`}>
                  {toSentenceCase(data.masjidType)}
                </span>
                &nbsp;{data.masjidName}
              </p>
              <p className="text-sm md:text-base lg:text-lg font-normal leading-tight">
                {data.masjidAddress}
              </p>
            </>
          )}
        </div>
      </ZoomAndFade>

      {data.events.map((item) => (
        <ZoomAndFade
          key={item.id}
          className={`relative flex items-center py-3 md:py-4 overflow-hidden text-white transition bg-${data.theme} hover:bg-${data.theme}-light w-full md:w-[480px] hover:cursor-pointer rounded-xl md:rounded-2xl`}
        >
          <div className="flex flex-col gap-2 p-2 mx-2 text-base md:text-lg w-full">
            <span className="mb-1 md:mb-2 text-xl md:text-2xl font-bold">
              {item.title}
            </span>
            {item.firstPicture &&
              (["mp4", "mov", "avi"].includes(
                getExtension(item.firstPicture)
              ) ? (
                <video
                  className="w-full h-auto rounded-lg"
                  src={`/api/masjid/${masjidId}/events/${item.id}/picture/${item.firstPicture}`}
                  autoPlay
                  loop
                  muted
                  width={640}
                  height={480}
                />
              ) : (
                <Image
                  className="w-full h-auto rounded-lg"
                  src={`/api/masjid/${masjidId}/events/${item.id}/picture/${item.firstPicture}`}
                  alt={item.firstPicture}
                  width={640}
                  height={480}
                />
              ))}
            <p className="mt-1 md:mt-2 text-sm md:text-base">
              {item.description}
            </p>
            <div className="flex w-full gap-2 items-center">
              <span className="text-xl md:text-2xl flex-shrink-0">
                <MdLocationOn />
              </span>
              <span className="text-sm md:text-base">{item.location}</span>
            </div>
            <div className="flex w-full gap-2 items-center">
              <span className="text-xl md:text-2xl flex-shrink-0">
                <FaCalendarDay />
              </span>
              {new Date(item.startDateTime).toDateString() ===
              new Date(item.endDateTime).toDateString() ? (
                <>
                  <span className="text-sm md:text-base">
                    {moment(item.startDateTime)
                      .locale("ms")
                      .format("dddd, DD MMM YYYY")}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm md:text-base">
                    {moment(item.startDateTime)
                      .locale("ms")
                      .format("DD/MM/YYYY")}
                  </span>
                  <span className="text-sm md:text-base">-</span>
                  <span className="text-sm md:text-base">
                    {moment(item.endDateTime).locale("ms").format("DD/MM/YYYY")}
                  </span>
                </>
              )}
            </div>
            <div className="flex w-full gap-2 items-center">
              <span className="text-xl md:text-2xl flex-shrink-0">
                <GoClockFill />
              </span>
              <span className="text-sm md:text-base">
                {moment(item.startDateTime).format("HH:mm")}
              </span>
              <span className="text-sm md:text-base">-</span>
              <span className="text-sm md:text-base">
                {moment(item.endDateTime).format("HH:mm")}
              </span>
            </div>
          </div>
        </ZoomAndFade>
      ))}
    </div>
  )
}

export default EventsList
