import fs from "fs"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

const getContentType = (filename: string) => {
  const ext = path.extname(filename)

  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"
    case ".png":
      return "image/png"
    case ".gif":
      return "image/gif"
    case ".webp":
      return "image/webp"
    case ".mp4":
      return "video/mp4"
    case ".avi":
      return "video/avi"
    case ".mov":
      return "video/mov"
    case ".pdf":
      return "application/pdf"
    default:
      return "application/octet-stream"
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  return handleRequest(
    req,
    async () => {
      const file = fs.readFileSync(
        `${process.env.ROOT_FILES_PATH}${path.sep}carousel${path.sep}${params.filename}`
      )

      return new NextResponse(file, {
        headers: {
          "Content-Type": getContentType(params.filename),
          "Content-Disposition": `attachment; filename=${params.filename}`,
        },
      })
    },
    false
  )
}
