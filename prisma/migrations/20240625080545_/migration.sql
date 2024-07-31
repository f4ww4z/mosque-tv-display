/*
  Warnings:

  - You are about to drop the `MasjidSetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MasjidSetting" DROP CONSTRAINT "MasjidSetting_masjidId_fkey";

-- DropTable
DROP TABLE "MasjidSetting";

-- CreateTable
CREATE TABLE "MasjidSettings" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "masjidId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'ms',
    "timeUntilIqamah" INTEGER NOT NULL DEFAULT 10,
    "notifyPrayerTimeSound" TEXT NOT NULL DEFAULT '/sounds/azan1.wav',
    "timeUntilPrayerEnds" INTEGER NOT NULL DEFAULT 15,
    "timeBetweenSlideshows" INTEGER NOT NULL DEFAULT 30,
    "newsTexts" TEXT[],
    "theme" TEXT NOT NULL DEFAULT 'teal',

    CONSTRAINT "MasjidSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MasjidSettings_masjidId_key" ON "MasjidSettings"("masjidId");

-- AddForeignKey
ALTER TABLE "MasjidSettings" ADD CONSTRAINT "MasjidSettings_masjidId_fkey" FOREIGN KEY ("masjidId") REFERENCES "Masjid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
