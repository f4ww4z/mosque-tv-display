import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  return handleRequest(req, async () => {
    const item = await prisma.carouselItem.findFirstOrThrow({
      where: {
        id: params.itemId,
      },
      select: {
        title: true,
        hidden: true,
      },
    })

    await prisma.carouselItem.update({
      where: {
        id: params.itemId,
      },
      data: {
        hidden: !item.hidden,
      },
    })

    return NextResponse.json({
      message: `Carousel item "${item.title}" ${item.hidden ? "REVEALED" : "HIDDEN"} successfully.`,
    })
  })
}
