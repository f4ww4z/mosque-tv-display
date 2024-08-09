import fs from "fs"
import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { randomFileName } from "lib/string"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { DeleteEventPictureRequest } from "types/event"

export async function POST(
  req: NextRequest,
  { params }: { params: { masjidId: string; eventId: string } }
) {
  return handleRequest(req, async () => {
    const formData = await req.formData()

    const file = formData.get("file") as unknown as File

    // console.log(file)

    // check if file is an image or video
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      throw new Error(
        "Jenis fail tidak sah. Hanya gambar dan video yang dibenarkan."
      )
    }

    // Check if file is more than 50 MB
    if (file.size > 50 * 1024 * 1024) {
      throw new Error(
        "Saiz fail terlalu besar. Saiz maksimum fail ialah 50 MB."
      )
    }

    const newFileName = `${randomFileName()}${path.extname(file.name)}`

    // Save file to disk

    const eventDir = path.join(
      process.env.ROOT_FILES_PATH,
      "masjid",
      params.masjidId,
      "events",
      params.eventId
    )

    if (!fs.existsSync(eventDir)) {
      fs.mkdirSync(eventDir, { recursive: true })
    }

    const filePath = path.join(eventDir, newFileName)

    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath)
    }

    const fBuffer = Buffer.from(await file.arrayBuffer())

    fs.writeFileSync(filePath, fBuffer)

    await prisma.event.update({
      where: {
        id: params.eventId,
      },
      data: {
        pictures: {
          push: newFileName,
        },
      },
    })

    return NextResponse.json({ success: true })
  })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { masjidId: string; eventId: string } }
) {
  return handleRequest(req, async () => {
    const { filename }: DeleteEventPictureRequest = await req.json()

    const eventPictures = await prisma.event.findFirst({
      where: {
        id: params.eventId,
      },
      select: {
        pictures: true,
      },
    })

    // Check if filename exists in pictures array
    const item = eventPictures.pictures.find((pic) => pic === filename)

    if (!item) {
      throw new Error("Gambar aktiviti tidak dijumpai.")
    }

    const eventDir = path.join(
      process.env.ROOT_FILES_PATH,
      "masjid",
      params.masjidId,
      "events",
      params.eventId
    )

    const filePath = path.join(eventDir, filename)

    if (!fs.existsSync(filePath)) {
      throw new Error("Gambar aktiviti tidak dijumpai.")
    }

    fs.rmSync(filePath)

    await prisma.event.update({
      where: {
        id: params.eventId,
      },
      data: {
        pictures: {
          set: eventPictures.pictures.filter((pic) => pic !== filename),
        },
      },
    })

    return NextResponse.json({
      message: `Gambar aktiviti berjaya dipadam.`,
    })
  })
}
