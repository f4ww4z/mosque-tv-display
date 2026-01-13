import { PrayerName } from "types/azan"

/**
 * Valid prayer names for validation
 */
export const VALID_PRAYER_NAMES: PrayerName[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
]

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
 * Prayer name mapping for Malay to English and vice versa
 */
export const PRAYER_NAME_MAP: { [key: string]: PrayerName } = {
  subuh: "fajr",
  fajr: "fajr",
  zohor: "dhuhr",
  dhuhr: "dhuhr",
  asar: "asr",
  asr: "asr",
  maghrib: "maghrib",
  isyak: "isha",
  isha: "isha",
}

/**
 * Gets the current azan image filename for a specific prayer from settings
 * @param settings - MasjidSettings object
 * @param prayerName - The prayer name
 * @returns The filename or null
 */
export function getAzanImageFilename(
  settings: {
    azanImageFajr: string | null
    azanImageDhuhr: string | null
    azanImageAsr: string | null
    azanImageMaghrib: string | null
    azanImageIsha: string | null
  },
  prayerName: PrayerName
): string | null {
  const fieldName = getPrayerImageFieldName(prayerName)
  return settings[fieldName]
}

/**
 * Sanitizes a filename to prevent path traversal attacks
 * Preserves the file extension while sanitizing the base name
 * @param filename - The filename to sanitize
 * @returns The sanitized filename (basename only)
 */
export function sanitizeFilename(filename: string): string {
  // Get only the base filename, removing any path components
  const basename = filename.split(/[/\\]/).pop() || ""

  // Split into name and extension
  const lastDotIndex = basename.lastIndexOf(".")
  if (lastDotIndex === -1) {
    // No extension, sanitize entire name
    const sanitized = basename.replace(/[^a-zA-Z0-9_-]/g, "_")
    return sanitized || "file" // Fallback if name is empty
  }

  const name = basename.substring(0, lastDotIndex)
  const ext = basename.substring(lastDotIndex) // includes the dot

  // Sanitize the name part but preserve the extension
  const sanitizedName = name.replace(/[^a-zA-Z0-9_-]/g, "_")
  const sanitizedExt = ext.replace(/[^a-zA-Z0-9.]/g, "")

  // Ensure we have a valid name
  const finalName = sanitizedName || "file"

  return finalName + sanitizedExt
}
