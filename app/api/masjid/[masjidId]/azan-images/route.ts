import fs from "fs"
import { getPrayerImageFieldName, sanitizeFilename } from "lib/azanUtils"
import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { randomFileName } from "lib/string"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { AzanImagesResponse, PrayerName } from "types/azan"

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(
    req,
    async () => {
      const settings = await prisma.masjidSettings.findFirstOrThrow({
        where: {
          masjidId: params.masjidId,
        },
        select: {
          azanImageFajr: true,
          azanImageDhuhr: true,
          azanImageAsr: true,
          azanImageMaghrib: true,
          azanImageIsha: true,
        },
      })

      const response: AzanImagesResponse = settings

      return NextResponse.json(response)
    },
    false
  )
}

export async function POST(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(req, async () => {
    const formData = await req.formData()

    const prayerName = formData.get("prayerName") as PrayerName
    const file = formData.get("file") as unknown as File

    if (
      !prayerName ||
      !["fajr", "dhuhr", "asr", "maghrib", "isha"].includes(prayerName)
    ) {
      throw new Error("Nama waktu solat tidak sah.")
    }

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      throw new Error("Jenis fail tidak sah. Hanya gambar yang dibenarkan.")
    }

    // Check if file is more than 10 MB
    if (file.size > 10 * 1024 * 1024) {
      throw new Error(
        "Saiz fail terlalu besar. Saiz maksimum fail ialah 10 MB."
      )
    }

    // Sanitize the file extension to prevent path traversal
    const sanitizedExt = sanitizeFilename(path.extname(file.name))
    const newFileName = `azan-${prayerName}-${randomFileName()}${sanitizedExt}`

    // Save file to disk
    const azanImagesDir = path.join(
      process.env.ROOT_FILES_PATH,
      "masjid",
      params.masjidId,
      "azan-images"
    )

    if (!fs.existsSync(azanImagesDir)) {
      fs.mkdirSync(azanImagesDir, { recursive: true })
    }

    const filePath = path.join(azanImagesDir, newFileName)

    const fBuffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filePath, fBuffer)

    // Get existing settings to delete old image if exists
    const settings = await prisma.masjidSettings.findFirstOrThrow({
      where: {
        masjidId: params.masjidId,
      },
    })

    // Delete old image if exists
    const fieldMap = {
      fajr: settings.azanImageFajr,
      dhuhr: settings.azanImageDhuhr,
      asr: settings.azanImageAsr,
      maghrib: settings.azanImageMaghrib,
      isha: settings.azanImageIsha,
    }

    const oldFileName = fieldMap[prayerName]
    if (oldFileName) {
      const oldFilePath = path.join(azanImagesDir, oldFileName)
      if (fs.existsSync(oldFilePath)) {
        fs.rmSync(oldFilePath)
      }
    }

    // Update database with new filename
    const fieldName = getPrayerImageFieldName(prayerName)

    await prisma.masjidSettings.update({
      where: {
        masjidId: params.masjidId,
      },
      data: {
        [fieldName]: newFileName,
      },
    })

    return NextResponse.json({
      message: `Imej azan untuk ${prayerName} berjaya dimuat naik!`,
      filename: newFileName,
    })
  })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(req, async () => {
    const { prayerName }: { prayerName: PrayerName } = await req.json()

    if (
      !prayerName ||
      !["fajr", "dhuhr", "asr", "maghrib", "isha"].includes(prayerName)
    ) {
      throw new Error("Nama waktu solat tidak sah.")
    }

    // Get existing settings to find the file to delete
    const settings = await prisma.masjidSettings.findFirstOrThrow({
      where: {
        masjidId: params.masjidId,
      },
    })

    const fieldMap = {
      fajr: settings.azanImageFajr,
      dhuhr: settings.azanImageDhuhr,
      asr: settings.azanImageAsr,
      maghrib: settings.azanImageMaghrib,
      isha: settings.azanImageIsha,
    }

    const fileName = fieldMap[prayerName]
    if (fileName) {
      const azanImagesDir = path.join(
        process.env.ROOT_FILES_PATH,
        "masjid",
        params.masjidId,
        "azan-images"
      )
      const filePath = path.join(azanImagesDir, fileName)

      if (fs.existsSync(filePath)) {
        fs.rmSync(filePath)
      }
    }

    // Update database to remove filename
    const fieldName = getPrayerImageFieldName(prayerName)

    await prisma.masjidSettings.update({
      where: {
        masjidId: params.masjidId,
      },
      data: {
        [fieldName]: null,
      },
    })

    return NextResponse.json({
      message: `Imej azan untuk ${prayerName} berjaya dipadam.`,
    })
  })
}
