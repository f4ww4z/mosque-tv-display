import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  return handleRequest(req, async ({ sessionUser }) => {
    return NextResponse.json(sessionUser)
  })
}
