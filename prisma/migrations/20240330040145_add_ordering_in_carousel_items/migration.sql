/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `CarouselItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `CarouselItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CarouselItem" ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CarouselItem_order_key" ON "CarouselItem"("order");
