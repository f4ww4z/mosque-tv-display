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
      const worldClocksDir = path.join(
        process.env.ROOT_FILES_PATH,
        "masjid",
        params.masjidId,
        "worldClocks"
      )

      let filename: string
      let file: Buffer

      fs.readdirSync(worldClocksDir).forEach((f) => {
        filename = f
        file = fs.readFileSync(path.join(worldClocksDir, f))
      })

      return new NextResponse(file, {
        headers: {
          "Content-Type": getContentType(filename),
          "Content-Disposition": `attachment; filename=${filename}`,
        },
      })
    },
    false
  )
}
