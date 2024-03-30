/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `CarouselItem` table. All the data in the column will be lost.
  - Added the required column `filename` to the `CarouselItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CarouselItem" DROP COLUMN "fileUrl",
ADD COLUMN     "filename" TEXT NOT NULL;
