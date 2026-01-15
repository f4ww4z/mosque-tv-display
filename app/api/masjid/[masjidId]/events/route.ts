import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"
import {
  CreateEventRequest,
  DeleteEventRequest,
  EventResponse,
  MasjidAndBriefEventsResponse,
} from "types/event"

export async function GET(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(
    req,
    async () => {
      const data = await prisma.masjid.findFirstOrThrow({
        where: {
          id: params.masjidId,
        },
        select: {
          id: true,
          type: true,
          name: true,
          address: true,
          settings: {
            select: {
              theme: true,
              logoFilename: true,
            },
          },
          events: {
            select: {
              id: true,
              title: true,
              description: true,
              location: true,
              pictures: true,
              startDateTime: true,
              endDateTime: true,
            },
          },
        },
      })

      if (!data) {
        throw new Error("Aktiviti-aktiviti tidak dijumpai")
      }

      const events: EventResponse[] = data.events.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        firstPicture: event.pictures[0],
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
      }))

      const res: MasjidAndBriefEventsResponse = {
        id: params.masjidId,
        masjidType: data.type,
        masjidName: data.name,
        masjidAddress: data.address,
        theme: data.settings.theme,
        logoFilename: data.settings.logoFilename,
        events,
      }

      return NextResponse.json(res)
    },
    false
  )
}

export async function POST(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(req, async () => {
    const data: CreateEventRequest = await req.json()

    const createdEvent = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        masjidId: params.masjidId,
      },
    })

    return NextResponse.json({ id: createdEvent.id })
  })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(req, async () => {
    const data: DeleteEventRequest = await req.json()

    await prisma.event.delete({
      where: {
        id: data.id,
        masjidId: params.masjidId,
      },
    })

    return NextResponse.json({ success: true })
  })
}
