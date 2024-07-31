import fs from "fs"
import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { randomFileName } from "lib/string"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { MasjidWorldClocksResponse } from "types/masjid"

export async function GET(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(
    req,
    async () => {
      const data = await prisma.masjidSettings.findFirst({
        where: {
          masjidId: params.masjidId,
        },
        select: {
          worldClocks: {
            select: {
              city: true,
              timezone: true,
            },
          },
          worldClockBackground: true,
        },
      })

      if (!data) {
        throw new Error("Masjid tidak ditemukan")
      }

      return NextResponse.json(data)
    },
    false
  )
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(req, async () => {
    const formData = await req.formData()

    const rawWorldClocks = formData.get("worldClocks") as string
    const worldClocks = JSON.parse(
      rawWorldClocks.trim()
    ) as MasjidWorldClocksResponse[]

    if (worldClocks.length > 7) {
      throw new Error("Maksimum 7 jam dunia sahaja dibenarkan.")
    }

    const worldClockBackground = formData.get(
      "worldClockBackground"
    ) as unknown as File

    // console.log(file)

    // check if file is an image or video
    if (!worldClockBackground.type.startsWith("image/")) {
      throw new Error("Jenis fail tidak sah. Hanya gambar yang dibenarkan.")
    }

    // Check if file is more than 10 MB
    if (worldClockBackground.size > 10 * 1024 * 1024) {
      throw new Error(
        "Saiz gambar terlalu besar. Saiz maksimum fail ialah 10 MB."
      )
    }

    // remove existing world clock background file
    const existingBackground = await prisma.masjidSettings.findFirst({
      where: {
        masjidId: params.masjidId,
      },
      select: {
        worldClockBackground: true,
      },
    })

    const worldClockBackgroundDir = path.join(
      process.env.ROOT_FILES_PATH,
      "masjid",
      params.masjidId,
      "worldClocks"
    )

    if (existingBackground) {
      const existingFilePath = path.join(
        worldClockBackgroundDir,
        existingBackground.worldClockBackground
      )

      if (fs.existsSync(existingFilePath)) {
        fs.rmSync(existingFilePath)
      }
    }

    // Save file to disk
    const newFileName = `${randomFileName()}${path.extname(worldClockBackground.name)}`

    if (!fs.existsSync(worldClockBackgroundDir)) {
      fs.mkdirSync(worldClockBackgroundDir, { recursive: true })
    }

    const filePath = path.join(worldClockBackgroundDir, newFileName)

    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath)
    }

    const fBuffer = Buffer.from(await worldClockBackground.arrayBuffer())

    fs.writeFileSync(filePath, fBuffer)

    const masjidSettings = await prisma.masjidSettings.update({
      where: {
        masjidId: params.masjidId,
      },
      data: {
        worldClockBackground: newFileName,
        worldClocks: {
          deleteMany: {},
        },
      },
      select: {
        id: true,
      },
    })

    await prisma.masjidWorldClock.createMany({
      data: worldClocks.map((wc) => ({
        masjidSettingsId: masjidSettings.id,
        city: wc.city,
        timezone: wc.timezone,
      })),
    })

    return NextResponse.json({ success: true })
  })
}
