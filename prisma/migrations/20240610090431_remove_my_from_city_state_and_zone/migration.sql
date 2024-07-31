/*
  Warnings:

  - You are about to drop the `MYCity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MYState` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MYZone` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MYCity" DROP CONSTRAINT "MYCity_zoneId_fkey";

-- DropForeignKey
ALTER TABLE "MYZone" DROP CONSTRAINT "MYZone_stateId_fkey";

-- DropForeignKey
ALTER TABLE "Masjid" DROP CONSTRAINT "Masjid_cityId_fkey";

-- DropTable
DROP TABLE "MYCity";

-- DropTable
DROP TABLE "MYState";

-- DropTable
DROP TABLE "MYZone";

-- CreateTable
CREATE TABLE "State" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" INTEGER NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "State"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Zone_code_key" ON "Zone"("code");

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Masjid" ADD CONSTRAINT "Masjid_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
