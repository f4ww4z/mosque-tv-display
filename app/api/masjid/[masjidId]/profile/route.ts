import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"
import { MasjidProfileResponse, MasjidProfileUpdateRequest } from "types/masjid"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(
    req,
    async () => {
      const data = await prisma.masjid.findFirst({
        where: {
          id: params.masjidId,
        },
        select: {
          type: true,
          name: true,
          registrationNumber: true,
          email: true,
          phone: true,
          address: true,
          city: {
            select: {
              id: true,
              name: true,
            },
          },
          postalCode: true,
        },
      })

      if (!data) {
        throw new Error("Masjid tidak ditemukan")
      }

      const zonesWithCities = await prisma.zone.findMany({
        select: {
          code: true,
          cities: {
            select: {
              id: true,
              name: true,
            },
          },
          state: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          state: {
            name: "asc",
          },
        },
      })

      const res: MasjidProfileResponse = {
        ...data,
        zones: zonesWithCities.map((zone) => ({
          code: zone.code,
          stateName: zone.state.name,
          cities: zone.cities.map((city) => ({
            id: city.id,
            name: city.name,
          })),
        })),
      }

      return NextResponse.json(res)
    },
    false
  )
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(req, async () => {
    const data: MasjidProfileUpdateRequest = await req.json()

    if (!data.type) {
      throw new Error("Sila pilih jenis masjid.")
    }

    if (!data.name) {
      throw new Error("Sila masukkan nama masjid.")
    }

    if (!data.email) {
      throw new Error("Sila masukkan email masjid.")
    }

    if (!data.address) {
      throw new Error("Sila masukkan alamat masjid.")
    }

    if (!data.city.id) {
      throw new Error("Sila pilih kawasan masjid.")
    }

    if (!data.postalCode) {
      throw new Error("Sila masukkan poskod masjid.")
    }

    const postalCodeRegex = /^[0-9]{5}$/
    if (!postalCodeRegex.test(data.postalCode)) {
      throw new Error("Poskod masjid tidak sah.")
    }

    await prisma.masjid.update({
      where: {
        id: params.masjidId,
      },
      data: {
        type: data.type,
        name: data.name,
        registrationNumber: data.registrationNumber,
        email: data.email,
        phone: data.phone,
        address: data.address,
        cityId: data.city.id,
        postalCode: data.postalCode,
      },
    })

    return NextResponse.json({ success: true })
  })
}
