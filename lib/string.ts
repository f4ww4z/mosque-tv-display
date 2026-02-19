export function toSentenceCase(sentence?: string): string {
  if (!sentence) {
    return ""
  }

  // Split the sentence into words
  sentence = sentence.replaceAll("_", " ")
  const words = sentence.split(" ")

  // Capitalize the first letter of each word
  const sentenceCaseWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  })

  // Join the words back to form the sentence
  return sentenceCaseWords.join(" ")
}

export function formatDateSimple(date?: Date): string {
  if (!date) {
    return ""
  }

  date = new Date(date.toString())

  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const dayOfWeekAbbreviation = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(date)

  return `${dayOfWeekAbbreviation} ${day}/${month}`
}

export function formatDate(date?: Date): string {
  if (!date) {
    return ""
  }

  date = new Date(date)

  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0") // Month is 0-indexed
  const year = date.getFullYear().toString()
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export function formatNumber(num: number): string {
  // format with thousand separator
  return num.toLocaleString()
}

export function roundUpNumber(num: number, dp = 2): number {
  return Math.ceil(num * Math.pow(10, dp)) / Math.pow(10, dp)
}

export function toCurrency(price: number, dp = 2, roundUp = true): string {
  if (roundUp) {
    price = roundUpNumber(price, dp)
  } else {
    price = Math.round(price * Math.pow(10, dp)) / Math.pow(10, dp)
  }

  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  })
}

export const formatFileSize = (size: number) => {
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

export const getExtension = (filename: string) => {
  return filename.split(".").pop()
}

export function extractProtocolAndPath(url: string) {
  // Use a regular expression to match the protocol part of the URL
  const protocolMatch = url.match(/^https?:\/\//)

  if (protocolMatch) {
    // If a match is found, extract the protocol, and path
    return {
      protocol: protocolMatch[0],
      path: url.substring(protocolMatch[0].length),
    }
  } else {
    // If no match is found, return an empty object
    return {}
  }
}

export function getHijriMonthName(monthNumber: number): string {
  switch (monthNumber) {
    case 1:
      return "Muharram"
    case 2:
      return "Safar"
    case 3:
      return "Rabiul Awwal"
    case 4:
      return "Rabiul Akhir"
    case 5:
      return "Jamadil Awwal"
    case 6:
      return "Jamadil Akhir"
    case 7:
      return "Rejab"
    case 8:
      return "Syaaban"
    case 9:
      return "Ramadhan"
    case 10:
      return "Syawal"
    case 11:
      return "Zulkaedah"
    case 12:
      return "Zulhijjah"
    default:
      return "N/A"
  }
}

export function getHijriMonthNumber(monthName: string): number {
  // Normalize the month name (handle variations like Sya'ban/Syaaban)
  const normalizedName = monthName.toLowerCase().replace(/['\s]/g, "")

  switch (normalizedName) {
    case "muharram":
      return 1
    case "safar":
      return 2
    case "rabiulawwal":
    case "rabialawwal":
      return 3
    case "rabiulakhir":
    case "rabialakhir":
    case "rabiulthani":
      return 4
    case "jamadilawwal":
    case "jamadalawwal":
    case "jumaadaalawwal":
      return 5
    case "jamadilakhir":
    case "jamadalakhir":
    case "jumaadaalakhir":
    case "jamadilthani":
      return 6
    case "rejab":
    case "rajab":
      return 7
    case "syaaban":
    case "shaban":
    case "syaban":
      return 8
    case "ramadhan":
    case "ramadan":
      return 9
    case "syawal":
    case "shawwal":
      return 10
    case "zulkaedah":
    case "zulqadah":
    case "dhulqadah":
    case "zulqidah":
      return 11
    case "zulhijjah":
    case "dhulhijjah":
    case "zulhijja":
      return 12
    default:
      return 0
  }
}

export function getHijriMonthDays(monthNumber: number): number {
  // Islamic calendar months alternate between 29 and 30 days
  // Odd months (1, 3, 5, 7, 9, 11) have 30 days
  // Even months (2, 4, 6, 8, 10) have 29 days
  // Month 12 (Dhul Hijjah) has 29 or 30 days depending on the year
  // For simplicity, we'll use 29 days for month 12 and let it overflow to next year
  if (monthNumber === 12) {
    return 29 // Will be 30 in leap years, but we'll handle overflow
  }
  return monthNumber % 2 === 1 ? 30 : 29
}

/**
 * Parse a Hijri date string and return its components
 * Expected format: "30 Sya'ban 1447H" or "1 Ramadhan 1447H"
 */
export function parseHijriDate(hijriDateString: string): {
  day: number
  monthName: string
  monthNumber: number
  year: number
} | null {
  if (!hijriDateString) {
    return null
  }

  // Match pattern: "day monthName yearH"
  const regex = /(\d+)\s+([a-zA-Z'\s]+)\s+(\d+)H?/
  const match = hijriDateString.match(regex)

  if (!match) {
    return null
  }

  const day = parseInt(match[1], 10)
  const monthName = match[2].trim()
  const year = parseInt(match[3], 10)
  const monthNumber = getHijriMonthNumber(monthName)

  if (monthNumber === 0) {
    return null
  }

  return {
    day,
    monthName,
    monthNumber,
    year,
  }
}

/**
 * Increment a Hijri date by one day
 * Handles month and year transitions
 */
export function incrementHijriDate(hijriDateString: string): string {
  const parsed = parseHijriDate(hijriDateString)

  if (!parsed) {
    return hijriDateString // Return original if parsing fails
  }

  let { day, monthNumber, year } = parsed

  // Increment day
  day++

  // Check if we need to move to next month
  const daysInMonth = getHijriMonthDays(monthNumber)
  if (day > daysInMonth) {
    day = 1
    monthNumber++

    // Check if we need to move to next year
    if (monthNumber > 12) {
      monthNumber = 1
      year++
    }
  }

  // Format back to string
  const newMonthName = getHijriMonthName(monthNumber)
  return `${day} ${newMonthName} ${year}H`
}

export function randomFileName(): string {
  return Math.random().toString(36).substring(6)
}

export function unsecuredCopyToClipboard(text: string) {
  const textArea = document.createElement("textarea")
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    document.execCommand("copy")
  } catch (err) {
    console.error("Unable to copy to clipboard", err)
  }
  document.body.removeChild(textArea)
}
