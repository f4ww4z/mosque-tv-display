import fs from "fs"
import { handleRequest } from "lib/requests"
import { getExtension } from "lib/string"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

export async function GET(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      const file = fs.readFileSync(
        `${process.env.ROOT_FILES_PATH}${path.sep}videos${path.sep}${process.env.VIDEO_FILENAME}`
      )

      return new NextResponse(file, {
        headers: {
          "Content-Type": `video/${getExtension(process.env.VIDEO_FILENAME)}`,
          "Content-Disposition": `attachment; filename=${process.env.VIDEO_FILENAME}`,
        },
      })
    },
    false
  )
}
