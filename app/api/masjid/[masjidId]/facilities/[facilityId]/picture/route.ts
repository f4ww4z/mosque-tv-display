import fs from "fs"
import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { randomFileName } from "lib/string"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { DeleteFacilityPictureRequest } from "types/facility"

export async function POST(
  req: NextRequest,
  { params }: { params: { masjidId: string; facilityId: string } }
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

    // Check if file is more than 20 MB
    if (file.size > 20 * 1024 * 1024) {
      throw new Error(
        "Saiz fail terlalu besar. Saiz maksimum fail ialah 20 MB."
      )
    }

    const newFileName = `${randomFileName()}${path.extname(file.name)}`

    // Save file to disk

    const facilityDir = path.join(
      process.env.ROOT_FILES_PATH,
      "masjid",
      params.masjidId,
      "facilities",
      params.facilityId
    )

    if (!fs.existsSync(facilityDir)) {
      fs.mkdirSync(facilityDir, { recursive: true })
    }

    const filePath = path.join(facilityDir, newFileName)

    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath)
    }

    const fBuffer = Buffer.from(await file.arrayBuffer())

    fs.writeFileSync(filePath, fBuffer)

    await prisma.facility.update({
      where: {
        id: params.facilityId,
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
  { params }: { params: { masjidId: string; facilityId: string } }
) {
  return handleRequest(req, async () => {
    const { filename }: DeleteFacilityPictureRequest = await req.json()

    const facilityPictures = await prisma.facility.findFirst({
      where: {
        id: params.facilityId,
      },
      select: {
        pictures: true,
      },
    })

    // Check if filename exists in pictures array
    const item = facilityPictures.pictures.find((pic) => pic === filename)

    if (!item) {
      throw new Error("Gambar fasiliti tidak dijumpai.")
    }

    const eventDir = path.join(
      process.env.ROOT_FILES_PATH,
      "masjid",
      params.masjidId,
      "facilities",
      params.facilityId
    )

    const filePath = path.join(eventDir, filename)

    if (!fs.existsSync(filePath)) {
      throw new Error("Gambar fasiliti tidak dijumpai.")
    }

    fs.rmSync(filePath)

    await prisma.facility.update({
      where: {
        id: params.facilityId,
      },
      data: {
        pictures: {
          set: facilityPictures.pictures.filter((pic) => pic !== filename),
        },
      },
    })

    return NextResponse.json({
      message: `Gambar fasiliti berjaya dipadam.`,
    })
  })
}
