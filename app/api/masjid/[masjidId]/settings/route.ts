import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"
import {
  MasjidSettingsResponse,
  MasjidSettingsUpdateRequest,
} from "types/masjid"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(
    req,
    async () => {
      const masjid = await prisma.masjid.findFirst({
        where: {
          id: params.masjidId,
        },
        select: {
          type: true,
          name: true,
          country: true,
          city: {
            select: {
              name: true,
            },
          },
          settings: {
            select: {
              language: true,
              clockHourFormat: true,
              timeUntilIqamah: true,
              timeUntilIqamahFajr: true,
              timeUntilIqamahDhuhr: true,
              timeUntilIqamahAsr: true,
              timeUntilIqamahMaghrib: true,
              timeUntilIqamahIsha: true,
              notifyPrayerTimeSound: true,
              timeUntilPrayerEnds: true,
              timeBetweenSlideshows: true,
              minutesBeforeAzanCountdown: true,
              azanAnnouncementDuration: true,
              newsTexts: true,
              theme: true,
              zoomLevel: true,
              logoFilename: true,
              worldClocks: {
                select: {
                  city: true,
                  timezone: true,
                },
              },
            },
          },
        },
      })

      if (!masjid) {
        throw new Error("Masjid tidak ditemukan")
      }

      const res: MasjidSettingsResponse = {
        type: masjid.type,
        name: masjid.name,
        city: masjid.city.name,
        countryCode: masjid.country === "Malaysia" ? "MY" : "ID", // 'MY' or 'ID'
        settings: masjid.settings,
      }

      return NextResponse.json(res)
    },
    false
  )
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(
    req,
    async () => {
      const data: MasjidSettingsUpdateRequest = await req.json()

      await prisma.masjidSettings.update({
        where: {
          masjidId: params.masjidId,
        },
        data: {
          language: data.language,
          clockHourFormat: data.clockHourFormat,
          timeUntilIqamah: data.timeUntilIqamah,
          timeUntilIqamahFajr: data.timeUntilIqamahFajr,
          timeUntilIqamahDhuhr: data.timeUntilIqamahDhuhr,
          timeUntilIqamahAsr: data.timeUntilIqamahAsr,
          timeUntilIqamahMaghrib: data.timeUntilIqamahMaghrib,
          timeUntilIqamahIsha: data.timeUntilIqamahIsha,
          notifyPrayerTimeSound: data.notifyPrayerTimeSound,
          timeUntilPrayerEnds: data.timeUntilPrayerEnds,
          timeBetweenSlideshows: data.timeBetweenSlideshows,
          minutesBeforeAzanCountdown: data.minutesBeforeAzanCountdown,
          azanAnnouncementDuration: data.azanAnnouncementDuration,
          newsTexts: data.newsTexts,
          theme: data.theme,
          zoomLevel: data.zoomLevel,
        },
      })

      return NextResponse.json({ success: true })
    },
    false
  )
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(
    req,
    async () => {
      const data: Partial<MasjidSettingsUpdateRequest> = await req.json()

      // Extract worldClocks and worldClockBackground as they need special handling
      const { worldClocks, worldClockBackground, ...updateData } = data

      await prisma.masjidSettings.update({
        where: {
          masjidId: params.masjidId,
        },
        data: updateData,
      })

      return NextResponse.json({ success: true })
    },
    false
  )
}
