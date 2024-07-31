import fs from "fs"
import { getContentType } from "lib/metadata"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string; masjidId: string } }
) {
  return handleRequest(
    req,
    async () => {
      const masjidIdDir = path.join(
        process.env.ROOT_FILES_PATH,
        "masjid",
        params.masjidId
      )

      const file = fs.readFileSync(
        path.join(masjidIdDir, "carousels", params.filename)
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
