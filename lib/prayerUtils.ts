import "moment/locale/ms"
import moment from "moment"
import { getHijriMonthName, incrementHijriDate } from "./string"
import { JAKIMPrayerTimesResponse, PrayerTimeResponse } from "types/prayer"

/**
 * Formats a raw JAKIM hijri string "YYYY-MM-DD" into display format "DD MonthName YYYYH"
 */
export function formatHijriEntry(hijriRaw: string): string {
  const [year, month, day] = hijriRaw.split("-")
  return `${day} ${getHijriMonthName(Number(month))} ${year}H`
}

/**
 * Computes a PrayerTimeResponse for the given date from a full yearly JAKIM dataset.
 * Returns null if the date is not found in the dataset (e.g. year boundary).
 * Safe to call in both browser and server environments.
 */
export function getPrayerTimeFromYearlyData(
  yearlyData: JAKIMPrayerTimesResponse,
  date: Date
): PrayerTimeResponse | null {
  moment.locale("en")

  const todayFormatted = moment(date).format("DD-MMM-YYYY")
  const tomorrow = new Date(date)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowFormatted = moment(tomorrow).format("DD-MMM-YYYY")

  const todayEntry = yearlyData.prayerTime.find(
    (p) => p.date === todayFormatted
  )
  if (!todayEntry) return null

  const tomorrowEntry = yearlyData.prayerTime.find(
    (p) => p.date === tomorrowFormatted
  )

  const hijriDateFormatted = formatHijriEntry(todayEntry.hijri)
  const hijriTomorrow = tomorrowEntry
    ? formatHijriEntry(tomorrowEntry.hijri)
    : incrementHijriDate(hijriDateFormatted)

  const dateM = moment(todayEntry.date, "DD-MMM-YYYY")
  dateM.locale("ms")
  const dateFormatted = dateM.format("dddd, Do MMMM yyyy")

  return {
    hijri: hijriDateFormatted,
    hijriTomorrow,
    date: dateFormatted,
    method: "Jabatan Kemajuan Islam Malaysia (JAKIM)",
    imsak: todayEntry.imsak.substring(0, 5),
    fajr: todayEntry.fajr.substring(0, 5),
    syuruk: todayEntry.syuruk.substring(0, 5),
    dhuhr: todayEntry.dhuhr.substring(0, 5),
    asr: todayEntry.asr.substring(0, 5),
    maghrib: todayEntry.maghrib.substring(0, 5),
    isha: todayEntry.isha.substring(0, 5),
  }
}
