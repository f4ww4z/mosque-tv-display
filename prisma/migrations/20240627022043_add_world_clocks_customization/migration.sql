-- AlterTable
ALTER TABLE "MasjidSettings" ADD COLUMN     "worldClockBackground" TEXT NOT NULL DEFAULT '/clock_background.png';

-- CreateTable
CREATE TABLE "MasjidWorldClock" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "masjidSettingsId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,

    CONSTRAINT "MasjidWorldClock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MasjidWorldClock" ADD CONSTRAINT "MasjidWorldClock_masjidSettingsId_fkey" FOREIGN KEY ("masjidSettingsId") REFERENCES "MasjidSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
