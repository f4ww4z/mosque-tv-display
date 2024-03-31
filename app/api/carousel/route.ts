import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"
import {
  CarouselItem,
  CarouselItemDeleteRequest,
  CarouselSwapRequest,
} from "types/carousel"
import path from "path"
import fs from "fs"
import { randomFileName } from "lib/string"

export async function GET(req: NextRequest) {
  return handleRequest(
    req,
    async () => {
      const carouselItems: CarouselItem[] = await prisma.carouselItem.findMany({
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

export async function POST(req: NextRequest) {
  return handleRequest(req, async () => {
    const formData = await req.formData()

    const title = formData.get("title") as string
    const file = formData.get("file") as unknown as File

    // console.log(file)

    // check if file is an image or video
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      throw new Error("Invalid file type. Only images and videos are allowed.")
    }

    // Check if file is more than 50 MB
    if (file.size > 50 * 1024 * 1024) {
      throw new Error("File size is too large. Maximum file size is 50 MB.")
    }

    const newFileName = `${randomFileName()}${path.extname(file.name)}`

    // Save file to disk
    const filePath = path.join(
      process.env.ROOT_FILES_PATH,
      `/carousel/${newFileName}`
    )

    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath)
    }

    const fBuffer = Buffer.from(await file.arrayBuffer())

    fs.writeFileSync(filePath, fBuffer)

    const maxOrder = await prisma.carouselItem.findFirst({
      select: {
        order: true,
      },
      orderBy: {
        order: "desc",
      },
    })

    const carouselItem: CarouselItem = await prisma.carouselItem.create({
      data: {
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

export async function PATCH(req: NextRequest) {
  return handleRequest(req, async () => {
    const { itemSwapFromId, itemSwapToId }: CarouselSwapRequest =
      await req.json()

    const itemSwapFrom = await prisma.carouselItem.findFirstOrThrow({
      where: {
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
      },
      data: {
        order: itemSwapTo.order,
      },
    })

    await prisma.carouselItem.update({
      where: {
        id: itemSwapTo.id,
      },
      data: {
        order: itemSwapFrom.order,
      },
    })

    return NextResponse.json({
      message: `Carousel item "${itemSwapFrom.title}" swapped with "${itemSwapTo.title}" successfully.`,
    })
  })
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req, async () => {
    const { itemId }: CarouselItemDeleteRequest = await req.json()

    const item = await prisma.carouselItem.findFirstOrThrow({
      where: {
        id: itemId,
      },
      select: {
        id: true,
        title: true,
        filename: true,
      },
    })

    const filePath = path.join(
      process.env.ROOT_FILES_PATH,
      `/carousel/${item.filename}`
    )

    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath)
    }

    await prisma.carouselItem.delete({
      where: {
        id: itemId,
      },
    })

    return NextResponse.json({
      message: `Carousel item "${item.title}" removed successfully.`,
    })
  })
}
