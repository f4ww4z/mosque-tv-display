export type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha"

export interface AzanImagesResponse {
  azanImageFajr?: string | null
  azanImageDhuhr?: string | null
  azanImageAsr?: string | null
  azanImageMaghrib?: string | null
  azanImageIsha?: string | null
}

export interface AzanImageUploadRequest {
  prayerName: PrayerName
}

export interface AzanImageDeleteRequest {
  prayerName: PrayerName
}
