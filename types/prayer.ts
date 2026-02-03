export interface PrayerTimeResponse {
  hijri: string
  date: string
  method: string
  imsak: string
  fajr: string
  syuruk: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  nextFajr: string
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

export interface AladhanPrayerTimesResponse {
  code: number
  status: string
  data: {
    timings: {
      Fajr: string
      Sunrise: string
      Dhuhr: string
      Asr: string
      Sunset: string
      Maghrib: string
      Isha: string
      Imsak: string
      Midnight: string
      Firstthird: string
      Lastthird: string
    }
    date: {
      readable: string
      timestamp: string
      hijri: {
        date: string
        format: string
        day: string
        weekday: {
          en: string
          ar: string
        }
        month: {
          number: number
          en: string
          ar: string
        }
        year: string
        designation: {
          abbreviated: string
          expanded: string
        }
        holidays: string[]
      }
      gregorian: {
        date: string
        format: string
        day: string
        weekday: {
          en: string
        }
        month: {
          number: number
          en: string
        }
        year: string
        designation: {
          abbreviated: string
          expanded: string
        }
      }
    }
    meta: {
      latitude: number
      longitude: number
      timezone: string
      method: {
        id: number
        name: string
        params: {
          Fajr: number
          Isha: number
        }
        location: {
          latitude: number
          longitude: number
        }
      }
      latitudeAdjustmentMethod: string
      midnightMode: string
      school: string
      offset: {
        Imsak: number
        Fajr: number
        Sunrise: number
        Dhuhr: number
        Asr: number
        Maghrib: number
        Sunset: number
        Isha: number
        Midnight: number
      }
    }
  }
}

// Countries of which they are behind by 1 day in Hijri date
export const countryCodesBehindByOneHijriDay: string[] = [
  "MY", // Malaysia
  "SG", // Singapore
  "BN", // Brunei
  "ID", // Indonesia
  "AU", // Australia
  "NZ", // New Zealand
  "CN", // China
  "HK", // Hong Kong
  "TW", // Taiwan
  "PH", // Philippines
  "KR", // South Korea
  "JP", // Japan
  "KP", // North Korea
  "RU", // Russia
  "MN", // Mongolia
  "TH", // Thailand
  "VN", // Vietnam
  "LA", // Laos
  "KH", // Cambodia
  "MM", // Myanmar
  "BD", // Bangladesh
  "IN", // India
  "LK", // Sri Lanka
  "NP", // Nepal
  "BT", // Bhutan
  "PK", // Pakistan
  "AF", // Afghanistan
  "TJ", // Tajikistan
  "UZ", // Uzbekistan
  "TM", // Turkmenistan
  "KG", // Kyrgyzstan
  "KZ", // Kazakhstan
  "IR", // Iran
  "IQ", // Iraq
  "SY", // Syria
  "JO", // Jordan
  "LB", // Lebanon
]
