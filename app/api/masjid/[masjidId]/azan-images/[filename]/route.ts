import fs from "fs"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  { params }: { params: { masjidId: string; filename: string } }
) {
  const filePath = path.join(
    process.env.ROOT_FILES_PATH,
    "masjid",
    params.masjidId,
    "azan-images",
    params.filename
  )

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "Fail tidak ditemukan." },
      { status: 404 }
    )
  }

  const fileBuffer = fs.readFileSync(filePath)

  // Determine content type based on file extension
  const ext = path.extname(params.filename).toLowerCase()
  const contentTypeMap: { [key: string]: string } = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
  }
  const contentType = contentTypeMap[ext] || "image/jpeg"

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
