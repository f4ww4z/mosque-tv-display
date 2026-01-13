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

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
