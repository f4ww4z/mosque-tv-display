import "moment/locale/ms"

import moment from "moment"

const response = {
  prayerTime: [
    {
      hijri: "1446-02-04",
      date: "09-Aug-2024",
      day: "Friday",
      imsak: "05:51:00",
      fajr: "06:01:00",
      syuruk: "07:11:00",
      dhuhr: "13:22:00",
      asr: "16:40:00",
      maghrib: "19:28:00",
      isha: "20:40:00",
    },
    {
      hijri: "1446-02-05",
      date: "10-Aug-2024",
      day: "Saturday",
      imsak: "05:51:00",
      fajr: "06:01:00",
      syuruk: "07:11:00",
      dhuhr: "13:21:00",
      asr: "16:40:00",
      maghrib: "19:28:00",
      isha: "20:40:00",
    },
  ],
  status: "OK!",
  serverTime: "2024-08-09 07:55:24",
  periodType: "duration",
  lang: "ms_my",
  zone: "WLY01",
}

moment.locale("en")

const date = moment(response.prayerTime[0].date, "DD-MMM-YYYY")

date.locale("ms")
const dateFormatted = date.format("dddd, Do MMMM yyyy")

console.log(dateFormatted)
