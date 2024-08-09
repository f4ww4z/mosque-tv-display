import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"
import {
  BriefFacilityResponse,
  CreateFacilityRequest,
  DeleteFacilityRequest,
} from "types/facility"

export async function GET(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(
    req,
    async () => {
      const data: BriefFacilityResponse[] = await prisma.facility.findMany({
        where: {
          masjidId: params.masjidId,
        },
        select: {
          id: true,
          updatedAt: true,
          name: true,
          pictures: true,
          maxCapacity: true,
        },
      })

      if (!data) {
        throw new Error("Belum ada fasiliti yang didaftarkan.")
      }

      return NextResponse.json(data)
    },
    false
  )
}

export async function POST(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(req, async () => {
    const data: CreateFacilityRequest = await req.json()

    const createdFacility = await prisma.facility.create({
      data: {
        masjidId: params.masjidId,
        name: data.name,
        description: data.description,
        maxCapacity: data.maxCapacity,
        rentPrice: data.rentPrice,
        rentUnit: data.rentUnit,
        picName: data.picName,
        picPhone: data.picPhone,
        pictures: [],
      },
    })

    return NextResponse.json({ id: createdFacility.id })
  })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(req, async () => {
    const data: DeleteFacilityRequest = await req.json()

    await prisma.facility.delete({
      where: {
        id: data.id,
        masjidId: params.masjidId,
      },
    })

    return NextResponse.json({ success: true })
  })
}
