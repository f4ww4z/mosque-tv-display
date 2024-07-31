import { RentUnit } from "@prisma/client"

export interface BriefFacilityResponse {
  id: string
  updatedAt: Date
  name: string
  pictures: string[]
  maxCapacity: number
}

export interface FacilityDetailResponse {
  id: string
  updatedAt: Date
  name: string
  description: string
  maxCapacity: number
  rentPrice: number
  rentUnit: RentUnit
  pictures: string[]
  picName: string
  picPhone: string
}

export interface CreateFacilityRequest {
  name: string
  description: string
  maxCapacity: number
  rentPrice: number
  rentUnit: RentUnit
  picName: string
  picPhone: string
}

export interface UpdateFacilityRequest {
  name: string
  description: string
  maxCapacity: number
  rentPrice: number
  rentUnit: RentUnit
  picName: string
  picPhone: string
}

export interface CreateFacilityResponse {
  id: string
}

export interface DeleteFacilityRequest {
  id: string
}

export interface DeleteFacilityPictureRequest {
  filename: string
}
