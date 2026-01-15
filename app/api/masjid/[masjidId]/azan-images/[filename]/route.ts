import fs from "fs"
import { sanitizeFilename } from "lib/azanUtils"
import { getContentType } from "lib/metadata"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  { params }: { params: { masjidId: string; filename: string } }
) {
  // Sanitize filename to prevent path traversal attacks
  const sanitizedFilename = sanitizeFilename(params.filename)

  const filePath = path.join(
    process.env.ROOT_FILES_PATH,
    "masjid",
    params.masjidId,
    "azan-images",
    sanitizedFilename
  )

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "Fail tidak ditemukan." },
      { status: 404 }
    )
  }

  const fileBuffer = fs.readFileSync(filePath)

  // Get content type based on file extension
  const contentType = getContentType(sanitizedFilename)

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
