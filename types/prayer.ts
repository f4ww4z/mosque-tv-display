export interface PrayerTimeResponse {
  hijri: string
  hijriTomorrow?: string
  date: string
  method: string
  imsak: string
  fajr: string
  syuruk: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}

export interface JAKIMPrayerTimeResponse {
  hijri: string
  date: string
  day: string
  imsak: string
  fajr: string
  syuruk: string
  dhuha: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}

export interface JAKIMPrayerTimesResponse {
  prayerTime: JAKIMPrayerTimeResponse[]
  status: string
  serverTime: string
  periodType: string
  lang: string
  zone: string
  bearing: string
}
