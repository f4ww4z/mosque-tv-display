export interface PrayerTime {
  hijri: string
  date: string
  day: string
  imsak: string
  fajr: string
  syuruk: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}

export interface PrayerTimesResponse {
  prayerTime: PrayerTime[]
  status: string
  serverTime: string
  periodType: string
  lang: string
  zone: string
}
