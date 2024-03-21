import fs from "fs"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  return handleRequest(
    req,
    async () => {
      const file = fs.readFileSync(
        `${process.env.ROOT_FILES_PATH}${path.sep}images${path.sep}${params.filename}`
      )

      return new NextResponse(file, {
        headers: {
          "Content-Type": "image/jpeg",
          "Content-Disposition": `attachment; filename=${params.filename}`,
        },
      })
    },
    false
  )
}
