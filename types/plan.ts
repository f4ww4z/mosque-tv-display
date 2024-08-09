import { MasjidType } from "@prisma/client"
import { ZoneWithCitiesResponse } from "./masjid"

export interface ChoosePlanResponse {
  monthlyFee: number
  yearlyFee: number
  features: string[]
  zones: ZoneWithCitiesResponse[]
}

export interface NewSubscriptionRequest {
  type: "monthly" | "yearly"
  masjid: {
    type?: MasjidType
    registrationNumber?: string
    name: string
    email: string
    address: string
    city: {
      id: number
      name: string
    }
    postalCode: string
    country: string
  }
  admins: {
    name: string
    phoneNumber: string
    email: string
    password: string
  }[]
}

export interface NewSubscriptionResponse {
  id: true
}
