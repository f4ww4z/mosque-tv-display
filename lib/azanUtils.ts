import { PrayerName } from "types/azan"

/**
 * Maps a prayer name to the corresponding MasjidSettings field name
 * @param prayerName - The prayer name (fajr, dhuhr, asr, maghrib, isha)
 * @returns The corresponding field name in MasjidSettings
 */
export function getPrayerImageFieldName(
  prayerName: PrayerName
):
  | "azanImageFajr"
  | "azanImageDhuhr"
  | "azanImageAsr"
  | "azanImageMaghrib"
  | "azanImageIsha" {
  const fieldMap = {
    fajr: "azanImageFajr" as const,
    dhuhr: "azanImageDhuhr" as const,
    asr: "azanImageAsr" as const,
    maghrib: "azanImageMaghrib" as const,
    isha: "azanImageIsha" as const,
  }
  return fieldMap[prayerName]
}

/**
 * Sanitizes a filename to prevent path traversal attacks
 * @param filename - The filename to sanitize
 * @returns The sanitized filename (basename only)
 */
export function sanitizeFilename(filename: string): string {
  // Get only the base filename, removing any path components
  const basename = filename.split(/[/\\]/).pop() || ""
  // Remove any remaining dangerous characters
  return basename.replace(/[^a-zA-Z0-9._-]/g, "_")
}
