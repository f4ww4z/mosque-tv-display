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

export function hijriMonthToLatin(monthNumber: string): string {
  const hijriMonths = {
    "01": "Muharram",
    "02": "Safar",
    "03": "Rabi al-Awwal",
    "04": "Rabi al-Akhir",
    "05": "Jumada al-Awwal",
    "06": "Jumada al-Akhir",
    "07": "Rajab",
    "08": "Sha'ban",
    "09": "Ramadhan",
    "10": "Shawwal",
    "11": "Dhu al-Qi'dah",
    "12": "Dhu al-Hijjah",
  }

  return hijriMonths[monthNumber] || "Invalid month number"
}
