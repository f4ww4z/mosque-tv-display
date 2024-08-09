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
