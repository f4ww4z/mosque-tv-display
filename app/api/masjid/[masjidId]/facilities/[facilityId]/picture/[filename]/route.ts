import fs from "fs"
import { getContentType } from "lib/metadata"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

export async function GET(
  req: NextRequest,
  {
    params,
  }: { params: { filename: string; masjidId: string; facilityId: string } }
) {
  return handleRequest(
    req,
    async () => {
      const facilityDir = path.join(
        process.env.ROOT_FILES_PATH,
        "masjid",
        params.masjidId,
        "facilities",
        params.facilityId
      )

      const file = fs.readFileSync(path.join(facilityDir, params.filename))

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
