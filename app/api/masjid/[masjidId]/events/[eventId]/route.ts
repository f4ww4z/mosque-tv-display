import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"
import { EventDetailResponse, UpdateEventRequest } from "types/event"

export async function GET(
  req: NextRequest,
  { params }: { params: { masjidId: string; eventId: string } }
) {
  return handleRequest(req, async () => {
    const data: EventDetailResponse = await prisma.event.findFirst({
      where: {
        id: params.eventId,
        masjidId: params.masjidId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        startDateTime: true,
        endDateTime: true,
        pictures: true,
      },
    })

    if (!data) {
      throw new Error("Aktiviti tidak dijumpai")
    }

    return NextResponse.json(data)
  })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { masjidId: string; eventId: string } }
) {
  return handleRequest(req, async () => {
    const data: UpdateEventRequest = await req.json()

    if (!data.title) {
      throw new Error("Sila masukkan tajuk aktiviti.")
    }

    if (!data.description) {
      throw new Error("Sila masukkan penerangan aktiviti.")
    }

    if (!data.location) {
      throw new Error("Sila masukkan tempat aktiviti.")
    }

    if (!data.startDateTime) {
      throw new Error("Sila masukkan tarikh mula aktiviti.")
    }

    if (!data.endDateTime) {
      throw new Error("Sila masukkan tarikh tamat aktiviti.")
    }

    await prisma.event.update({
      where: {
        id: params.eventId,
        masjidId: params.masjidId,
      },
      data,
    })

    return NextResponse.json({ success: true })
  })
}
