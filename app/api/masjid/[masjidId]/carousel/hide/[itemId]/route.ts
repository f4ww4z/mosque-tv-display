import prisma from "lib/prisma"
import { handleRequest } from "lib/requests"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { itemId: string; masjidId: string } }
) {
  return handleRequest(req, async () => {
    const item = await prisma.carouselItem.findFirstOrThrow({
      where: {
        id: params.itemId,
        masjidId: params.masjidId,
      },
      select: {
        title: true,
        hidden: true,
      },
    })

    await prisma.carouselItem.update({
      where: {
        id: params.itemId,
        masjidId: params.masjidId,
      },
      data: {
        hidden: !item.hidden,
      },
    })

    return NextResponse.json({
      message: `Slaid "${item.title}" berjaya ${item.hidden ? "dikemukakan" : "disembunyikan"}.`,
    })
  })
}
