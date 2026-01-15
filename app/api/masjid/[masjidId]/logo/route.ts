import fs from "fs"
import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { randomFileName } from "lib/string"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(req, async () => {
    const formData = await req.formData()

    const file = formData.get("file") as unknown as File

    // check if file is an image
    if (!file.type.startsWith("image/")) {
      throw new Error("Jenis fail tidak sah. Hanya gambar yang dibenarkan.")
    }

    // Check if file is more than 5 MB
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Saiz fail terlalu besar. Saiz maksimum fail ialah 5 MB.")
    }

    const newFileName = `${randomFileName()}${path.extname(file.name)}`

    // Save file to disk

    const logoDir = path.join(
      process.env.ROOT_FILES_PATH,
      "masjid",
      params.masjidId,
      "logo"
    )

    if (!fs.existsSync(logoDir)) {
      fs.mkdirSync(logoDir, { recursive: true })
    }

    const filePath = path.join(logoDir, newFileName)

    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath)
    }

    const fBuffer = Buffer.from(await file.arrayBuffer())

    fs.writeFileSync(filePath, fBuffer)

    // Get existing settings to check if there's an old logo to delete
    const existingSettings = await prisma.masjidSettings.findFirst({
      where: {
        masjidId: params.masjidId,
      },
      select: {
        logoFilename: true,
      },
    })

    // Delete old logo file if exists
    if (existingSettings?.logoFilename) {
      const oldFilePath = path.join(logoDir, existingSettings.logoFilename)
      if (fs.existsSync(oldFilePath)) {
        fs.rmSync(oldFilePath)
      }
    }

    // Update settings with new logo filename
    await prisma.masjidSettings.update({
      where: {
        masjidId: params.masjidId,
      },
      data: {
        logoFilename: newFileName,
      },
    })

    return NextResponse.json({
      filename: newFileName,
      message: "Logo berjaya dimuat naik.",
    })
  })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(req, async () => {
    const settings = await prisma.masjidSettings.findFirst({
      where: {
        masjidId: params.masjidId,
      },
      select: {
        logoFilename: true,
      },
    })

    if (!settings?.logoFilename) {
      throw new Error("Logo tidak ditemukan.")
    }

    const logoDir = path.join(
      process.env.ROOT_FILES_PATH,
      "masjid",
      params.masjidId,
      "logo"
    )

    const filePath = path.join(logoDir, settings.logoFilename)

    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath)
    }

    await prisma.masjidSettings.update({
      where: {
        masjidId: params.masjidId,
      },
      data: {
        logoFilename: null,
      },
    })

    return NextResponse.json({
      message: "Logo berjaya dipadam.",
    })
  })
}
