import fs from "fs"
import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { randomFileName } from "lib/string"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import {
  CarouselItem,
  CarouselItemDeleteRequest,
  CarouselSwapRequest,
} from "types/carousel"

export async function GET(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(
    req,
    async () => {
      const carouselItems: CarouselItem[] = await prisma.carouselItem.findMany({
        where: {
          masjidId: params.masjidId,
        },
        select: {
          id: true,
          title: true,
          filename: true,
          order: true,
          hidden: true,
        },
        orderBy: {
          order: "asc",
        },
      })

      return NextResponse.json(carouselItems)
    },
    false
  )
}

export async function POST(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(req, async () => {
    const formData = await req.formData()

    const title = formData.get("title") as string
    const file = formData.get("file") as unknown as File

    // console.log(file)

    // check if file is an image or video
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      throw new Error(
        "Jenis fail tidak sah. Hanya gambar dan video yang dibenarkan."
      )
    }

    // Check if file is more than 50 MB
    if (file.size > 50 * 1024 * 1024) {
      throw new Error(
        "Saiz fail terlalu besar. Saiz maksimum fail ialah 50 MB."
      )
    }

    const newFileName = `${randomFileName()}${path.extname(file.name)}`

    // Save file to disk

    const carouselDir = path.join(
      process.env.ROOT_FILES_PATH,
      "masjid",
      params.masjidId,
      "carousels"
    )

    if (!fs.existsSync(carouselDir)) {
      fs.mkdirSync(carouselDir, { recursive: true })
    }

    const filePath = path.join(carouselDir, newFileName)

    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath)
    }

    const fBuffer = Buffer.from(await file.arrayBuffer())

    fs.writeFileSync(filePath, fBuffer)

    const maxOrder = await prisma.carouselItem.findFirst({
      select: {
        order: true,
      },
      where: {
        masjidId: params.masjidId,
      },
      orderBy: {
        order: "desc",
      },
    })

    const carouselItem: CarouselItem = await prisma.carouselItem.create({
      data: {
        masjidId: params.masjidId,
        title,
        filename: newFileName,
        order: maxOrder ? maxOrder.order + 1 : 1,
      },
      select: {
        id: true,
        title: true,
        filename: true,
        order: true,
        hidden: true,
      },
    })

    return NextResponse.json(carouselItem)
  })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(req, async () => {
    const { itemSwapFromId, itemSwapToId }: CarouselSwapRequest =
      await req.json()

    const itemSwapFrom = await prisma.carouselItem.findFirstOrThrow({
      where: {
        masjidId: params.masjidId,
        id: itemSwapFromId,
      },
      select: {
        id: true,
        title: true,
        order: true,
      },
    })

    const itemSwapTo = await prisma.carouselItem.findFirstOrThrow({
      where: {
        masjidId: params.masjidId,
        id: itemSwapToId,
      },
      select: {
        id: true,
        title: true,
        order: true,
      },
    })

    await prisma.carouselItem.update({
      where: {
        id: itemSwapFrom.id,
        masjidId: params.masjidId,
      },
      data: {
        order: itemSwapTo.order,
      },
    })

    await prisma.carouselItem.update({
      where: {
        id: itemSwapTo.id,
        masjidId: params.masjidId,
      },
      data: {
        order: itemSwapFrom.order,
      },
    })

    return NextResponse.json({
      message: `Berjaya menukar slaid "${itemSwapFrom.title}" dengan "${itemSwapTo.title}".`,
    })
  })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { masjidId: string } }
) {
  return handleRequest(req, async () => {
    const { itemId }: CarouselItemDeleteRequest = await req.json()

    const item = await prisma.carouselItem.findFirstOrThrow({
      where: {
        id: itemId,
        masjidId: params.masjidId,
      },
      select: {
        id: true,
        title: true,
        filename: true,
      },
    })

    const masjidIdDir = path.join(
      process.env.ROOT_FILES_PATH,
      "masjid",
      params.masjidId
    )

    const filePath = path.join(masjidIdDir, "carousels", item.filename)

    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath)
    }

    await prisma.carouselItem.delete({
      where: {
        id: itemId,
        masjidId: params.masjidId,
      },
    })

    return NextResponse.json({
      message: `Slaid "${item.title}" berjaya dipadam.`,
    })
  })
}
