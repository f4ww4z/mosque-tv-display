import * as fs from "fs"
import * as path from "path"
import { HttpError } from "./requests"
import { JAKIMPrayerTimesResponse } from "types/prayer"

/**
 * Returns the full yearly JAKIM prayer timetable for the given zone.
 * Reads from a server-side file cache first; fetches from JAKIM API if missing.
 * Throws HttpError 503 if JAKIM is unreachable and no cache file exists.
 */
export async function getYearlyJakimData(
  zone: string
): Promise<JAKIMPrayerTimesResponse> {
  const year = new Date().getFullYear()
  const cacheFilePath = getYearlyCacheFilePath(zone, year)

  if (fs.existsSync(cacheFilePath)) {
    const fileContent = fs.readFileSync(cacheFilePath, "utf-8")
    return JSON.parse(fileContent) as JAKIMPrayerTimesResponse
  }

  // Cache file not found — fetch from JAKIM API
  const url = new URL(process.env.JAKIM_API_URL)
  url.searchParams.set("r", "esolatApi/takwimsolat")
  url.searchParams.set("period", "year")
  url.searchParams.set("zone", zone)

  try {
    const res = await fetch(url.toString(), { method: "GET" })
    if (!res.ok) throw new Error(`JAKIM responded with status ${res.status}`)

    const jakimData = (await res.json()) as JAKIMPrayerTimesResponse
    if (!jakimData?.prayerTime?.length) {
      throw new Error("JAKIM returned empty prayer time data")
    }

    // Save to cache
    fs.mkdirSync(path.dirname(cacheFilePath), { recursive: true })
    fs.writeFileSync(cacheFilePath, JSON.stringify(jakimData), "utf-8")

    return jakimData
  } catch {
    throw new HttpError("JAKIM_DOWN", 503)
  }
}

export function invalidateYearlyCache(zone: string, year: number): void {
  const cacheFilePath = getYearlyCacheFilePath(zone, year)
  if (fs.existsSync(cacheFilePath)) {
    fs.unlinkSync(cacheFilePath)
  }
}

function getYearlyCacheFilePath(zone: string, year: number): string {
  return path.join(
    process.env.ROOT_FILES_PATH,
    `prayer_times_${year}_${zone}.json`
  )
}
