import bcrypt from "bcrypt"
import fs from "fs"
import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { ChoosePlanResponse, NewSubscriptionRequest } from "types/plan"

export async function GET(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      const plan = await prisma.adminSettings.findFirst({
        select: {
          monthlyFee: true,
          yearlyFee: true,
          features: true,
        },
      })

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

      const res: ChoosePlanResponse = {
        monthlyFee: plan.monthlyFee,
        yearlyFee: plan.yearlyFee,
        features: plan.features,
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

export async function POST(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      const data: NewSubscriptionRequest = await req.json()

      if (!data.masjid.type) {
        throw new Error("Sila pilih jenis masjid.")
      }

      if (data.masjid.registrationNumber) {
        // check for duplicate registration number
        const existingMasjid = await prisma.masjid.findFirst({
          where: {
            registrationNumber: data.masjid.registrationNumber,
          },
        })

        if (existingMasjid) {
          throw new Error("Nombor pendaftaran ini telah wujud.")
        }
      }

      if (!data.masjid.name) {
        throw new Error("Sila masukkan nama masjid.")
      }

      if (!data.masjid.email) {
        throw new Error("Sila masukkan email masjid.")
      }

      // check for duplicate email
      const existingMasjid = await prisma.masjid.findFirst({
        where: {
          email: data.masjid.email,
        },
      })

      if (existingMasjid) {
        throw new Error("Email ini telah wujud.")
      }

      if (!data.masjid.address) {
        throw new Error("Sila masukkan alamat masjid.")
      }

      if (!data.masjid.city.id) {
        throw new Error("Sila pilih kawasan masjid.")
      }

      if (!data.masjid.postalCode) {
        throw new Error("Sila masukkan poskod masjid.")
      }

      const postalCodeRegex = /^[0-9]{5}$/
      if (!postalCodeRegex.test(data.masjid.postalCode)) {
        throw new Error("Poskod masjid tidak sah.")
      }

      if (!data.masjid.country) {
        throw new Error("Sila masukkan negara masjid.")
      }

      for (let i = 1; i < data.admins.length + 1; i++) {
        const admin = data.admins[i - 1]

        if (!admin.name) {
          throw new Error(`Sila masukkan nama pentadbir ${i}.`)
        }

        if (!admin.phoneNumber) {
          throw new Error(
            `Sila pastikan nombor telefon pentadbir ${i} adalah benar.`
          )
        }

        if (!admin.email) {
          throw new Error(`Sila masukkan email pentadbir ${i}.`)
        }

        if (admin.email === data.masjid.email) {
          throw new Error(
            `Email pentadbir ${i} tidak boleh sama dengan email masjid.`
          )
        }

        // check for duplicate email
        const existingAdmin = await prisma.user.findFirst({
          where: {
            email: admin.email,
          },
        })

        if (existingAdmin) {
          throw new Error(`Email pentadbir ${i} ini telah wujud.`)
        }

        if (!admin.password) {
          throw new Error(`Sila masukkan kata laluan pentadbir ${i}.`)
        }
      }

      if (data.admins[0].email === data.admins[1].email) {
        throw new Error("Email pentadbir 1 dan pentadbir 2 tidak boleh sama.")
      }

      if (data.admins[0].phoneNumber === data.admins[1].phoneNumber) {
        throw new Error(
          "Nombor telefon pentadbir 1 dan pentadbir 2 tidak boleh sama."
        )
      }

      const newsTexts = [
        "Sila matikan telefon anda semasa solat",
        "Sila jaga kebersihan masjid",
        "Sila derma dengan murah hati",
        "Sila ikuti SOP",
        "Ingatlah, solat adalah tiang agama",
        "Sila patuhi arahan petugas masjid",
        "Jaga solat, jaga diri, jaga keluarga",
      ]

      const worldTimezones = [
        {
          city: "Makkah",
          timezone: "Asia/Riyadh",
        },
        {
          city: "Madinah",
          timezone: "Asia/Riyadh",
        },
        {
          city: "Baitul Maqdis",
          timezone: "Asia/Jerusalem",
        },
        {
          city: "Jakarta",
          timezone: "Asia/Jakarta",
        },
        {
          city: "Dubai",
          timezone: "Asia/Dubai",
        },
        {
          city: "Istanbul",
          timezone: "Europe/Istanbul",
        },
        {
          city: "London",
          timezone: "Europe/London",
        },
      ]

      // Create masjid with 2 admins
      const masjid = await prisma.masjid.create({
        data: {
          type: data.masjid.type,
          registrationNumber: data.masjid.registrationNumber,
          name: data.masjid.name,
          email: data.masjid.email,
          address: data.masjid.address,
          cityId: data.masjid.city.id,
          postalCode: data.masjid.postalCode,
          country: data.masjid.country,
          phone: data.admins[0].phoneNumber,
          admins: {
            create: data.admins.map((admin) => ({
              role: "MASJID_ADMIN",
              fullName: admin.name,
              phoneNumber: admin.phoneNumber,
              email: admin.email,
              password: bcrypt.hashSync(admin.password, 10),
            })),
          },
          settings: {
            create: {
              newsTexts,
              worldClocks: {
                createMany: {
                  data: worldTimezones,
                },
              },
            },
          },
        },
        select: {
          id: true,
        },
      })

      const rootDir = process.env.ROOT_FILES_PATH

      const masjidDir = path.join(rootDir, "masjid", masjid.id)

      fs.mkdirSync(path.join(masjidDir, "carousels"), { recursive: true })

      const demoWorldClocksDir = path.join(
        __dirname,
        "../..",
        "_demo",
        "worldClocks"
      )

      const worldClocksDir = path.join(masjidDir, "worldClocks")

      fs.mkdirSync(worldClocksDir)

      // copy demo world clocks to masjid world clocks directory
      fs.readdirSync(demoWorldClocksDir).forEach((file) => {
        fs.copyFileSync(
          path.join(demoWorldClocksDir, file),
          path.join(worldClocksDir, file)
        )
      })

      return NextResponse.json(masjid, {
        status: 201,
      })
    },
    false
  )
}
