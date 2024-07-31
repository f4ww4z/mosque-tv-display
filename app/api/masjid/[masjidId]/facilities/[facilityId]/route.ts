import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"
import { FacilityDetailResponse, UpdateFacilityRequest } from "types/facility"

export async function GET(
  req: NextRequest,
  { params }: { params: { masjidId: string; facilityId: string } }
) {
  return handleRequest(req, async () => {
    const data: FacilityDetailResponse = await prisma.facility.findFirst({
      where: {
        id: params.facilityId,
        masjidId: params.masjidId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        maxCapacity: true,
        rentPrice: true,
        rentUnit: true,
        picName: true,
        picPhone: true,
        pictures: true,
        updatedAt: true,
      },
    })

    if (!data) {
      throw new Error("Fasiliti tidak dijumpai")
    }

    return NextResponse.json(data)
  })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { masjidId: string; facilityId: string } }
) {
  return handleRequest(req, async () => {
    const data: UpdateFacilityRequest = await req.json()

    if (!data.name) {
      throw new Error("Sila masukkan nama fasiliti.")
    }

    if (!data.description) {
      throw new Error("Sila masukkan penerangan fasiliti.")
    }

    if (!data.maxCapacity) {
      throw new Error("Sila masukkan kapasiti maksimum fasiliti.")
    }

    if (!data.rentPrice) {
      throw new Error("Sila masukkan harga sewa fasiliti.")
    }

    if (!data.rentUnit) {
      throw new Error("Sila masukkan unit harga sewa fasiliti.")
    }

    if (!data.picName) {
      throw new Error("Sila masukkan nama PIC fasiliti.")
    }

    if (!data.picPhone) {
      throw new Error("Sila masukkan nombor telefon PIC fasiliti.")
    }

    await prisma.facility.update({
      where: {
        id: params.facilityId,
        masjidId: params.masjidId,
      },
      data,
    })

    return NextResponse.json({ success: true })
  })
}
