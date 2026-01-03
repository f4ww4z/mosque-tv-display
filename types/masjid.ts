import { MasjidType } from "@prisma/client"

export interface BriefMasjidResponse {
  id: string
  type: MasjidType
  name: string
}

export interface MasjidDashboardResponse {
  type: MasjidType
  name: string
}

export interface ZoneWithCitiesResponse {
  code: string
  stateName: string
  cities: {
    id: number
    name: string
  }[]
}

export interface MasjidProfileResponse {
  type: MasjidType
  name: string
  registrationNumber: string
  email: string
  phone: string
  address: string
  city: {
    id: number
    name: string
  }
  zones: ZoneWithCitiesResponse[]
  postalCode: string
}

export interface MasjidProfileUpdateRequest {
  type: MasjidType
  name: string
  registrationNumber: string
  email: string
  phone: string
  address: string
  city: {
    id: number
    name: string
  }
  postalCode: string
}

export interface MasjidSettingsUpdateRequest {
  language: string
  timeUntilIqamah: number
  notifyPrayerTimeSound: string
  timeUntilPrayerEnds: number
  timeBetweenSlideshows: number
  newsTexts: string[]
  theme: string
  zoomLevel?: number
  worldClocks?: MasjidWorldClocksResponse[]
  worldClockBackground?: string
}

export interface MasjidSettingsResponse {
  type: MasjidType
  name: string
  city: string
  countryCode: string
  settings: MasjidSettingsUpdateRequest
}

export interface MasjidWorldClocksResponse {
  city: string
  timezone: string
}

export interface MasjidWorldClocksSettingsResponse {
  worldClocks: MasjidWorldClocksResponse[]
  worldClockBackground: string
}
