import { handleRequest } from "lib/requests"
import moment from "moment-timezone"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      const allTimezones = moment.tz.names()

      return NextResponse.json(allTimezones)
    },
    false
  )
}
