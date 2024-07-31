"use client"

import { ZoomAndFade } from "components/Animations"
import LoadingIndicator from "components/LoadingIndicator"
import fetchJson from "lib/fetchJson"
import { toSentenceCase, unsecuredCopyToClipboard } from "lib/string"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { MasjidDashboardResponse } from "types/masjid"

const MasjidDashboard = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<MasjidDashboardResponse>()

  const qrCodeSignageRef = useRef<HTMLDivElement>(null)
  const qrCodeEventsRef = useRef<HTMLDivElement>(null)

  const getSignageUrl = () =>
    new URL(`/signage/${id}`, window.location.origin).toString()

  const getEventsUrl = () =>
    new URL(`/events/${id}`, window.location.origin).toString()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetchJson<MasjidDashboardResponse>(
        `/api/masjid/${id}/dashboard`
      )

      setData(res)
    } catch (error) {
      toast.error(error.message ?? "Kesalahan ketika memuatkan data")
    }

    setLoading(false)
  }

  const handleCopySignageUrl = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(getSignageUrl())
    } else {
      unsecuredCopyToClipboard(getSignageUrl())
    }

    toast.success(`Pautan paparan digital berjaya disalin.`)
  }

  const handleCopyEventsUrl = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(getEventsUrl())
    } else {
      unsecuredCopyToClipboard(getEventsUrl())
    }

    toast.success(`Pautan senarai aktiviti berjaya disalin.`)
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (loading || !data) return

    // Dynamically import qr-code-styling only client-side
    if (typeof window !== "undefined") {
      import("qr-code-styling").then(({ default: QRCodeStyling }) => {
        const qrCodeSignage = new QRCodeStyling({
          width: 270,
          height: 270,
          data: getSignageUrl(),
          image: "/android-chrome-512x512.png",
          margin: 0,
          qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: "Q",
          },
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.5,
            margin: 4,
          },
          dotsOptions: {
            type: "extra-rounded",
            // color: "#1A4A4C",
            gradient: {
              type: "linear",
              colorStops: [
                {
                  color: "#1C5153",
                  offset: 0,
                },
                {
                  color: "#188D92",
                  offset: 1,
                },
              ],
              rotation: 0,
            },
          },
          backgroundOptions: {
            color: "#ffffff",
          },
          cornersSquareOptions: {
            type: "extra-rounded",
            color: "#133D3E",
          },
          cornersDotOptions: {
            type: "dot",
            color: "#133D3E",
          },
        })

        // empty the ref
        qrCodeSignageRef.current.innerHTML = ""

        qrCodeSignage.append(qrCodeSignageRef.current)

        const qrCodeEvents = new QRCodeStyling({
          width: 270,
          height: 270,
          data: getEventsUrl(),
          image: "/android-chrome-512x512.png",
          margin: 0,
          qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: "Q",
          },
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.5,
            margin: 4,
          },
          dotsOptions: {
            type: "extra-rounded",
            // color: "#1A4A4C",
            gradient: {
              type: "linear",
              colorStops: [
                {
                  color: "#1C5153",
                  offset: 0,
                },
                {
                  color: "#188D92",
                  offset: 1,
                },
              ],
              rotation: 0,
            },
          },
          backgroundOptions: {
            color: "#ffffff",
          },
          cornersSquareOptions: {
            type: "extra-rounded",
            color: "#133D3E",
          },
          cornersDotOptions: {
            type: "dot",
            color: "#133D3E",
          },
        })

        qrCodeEventsRef.current.innerHTML = ""

        qrCodeEvents.append(qrCodeEventsRef.current)
      })
    }
  }, [loading])

  return (
    <div className="flex flex-col items-center justify-center w-full lg:max-w-4xl">
      {loading ? (
        <div className="w-full h-screen">
          <LoadingIndicator />
        </div>
      ) : (
        <>
          <ZoomAndFade
            triggerOnce
            className="w-full text-center"
          >
            <p className="mb-6 text-4xl font-bold">
              Papan Pemuka&nbsp;
              {toSentenceCase(`${data?.type}`)}
              &nbsp;{data?.name}
            </p>
          </ZoomAndFade>
          <div className="flex flex-wrap items-start justify-center w-full gap-4">
            <div className="flex flex-col items-center">
              <div
                className="p-3 bg-white border-2 w-fit rounded-3xl"
                ref={qrCodeSignageRef}
              ></div>
              <Link
                className="px-4 py-2 mt-2 text-lg transition rounded-lg hover:drop-shadow-xl bg-accent-dark hover:bg-accent-dark/80"
                href={getSignageUrl()}
                rel="noopener noreferrer"
                target="_blank"
              >
                Ke Paparan Digital TV
              </Link>
              <button
                className="px-4 py-2 mt-2 text-lg transition rounded-lg hover:drop-shadow-xl bg-approveGreen hover:bg-approveGreen/80"
                onClick={handleCopySignageUrl}
              >
                Salin Pautan
              </button>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="p-3 bg-white border-2 w-fit rounded-3xl"
                ref={qrCodeEventsRef}
              ></div>
              <Link
                className="px-4 py-2 mt-2 text-lg transition rounded-lg hover:drop-shadow-xl bg-accent-dark hover:bg-accent-dark/80"
                href={getEventsUrl()}
                rel="noopener noreferrer"
                target="_blank"
              >
                Ke Senarai Aktiviti
              </Link>
              <button
                className="px-4 py-2 mt-2 text-lg transition rounded-lg hover:drop-shadow-xl bg-approveGreen hover:bg-approveGreen/80"
                onClick={handleCopyEventsUrl}
              >
                Salin Pautan
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MasjidDashboard
