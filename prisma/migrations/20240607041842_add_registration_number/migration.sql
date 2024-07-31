/*
  Warnings:

  - A unique constraint covering the columns `[registrationNumber]` on the table `Masjid` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registrationNumber` to the `Masjid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Masjid" ADD COLUMN     "registrationNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Masjid_registrationNumber_key" ON "Masjid"("registrationNumber");
