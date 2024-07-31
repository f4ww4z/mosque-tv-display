import path from "path"

export const generateMetadata = ({
  title,
  description,
}: {
  title: string
  description?: string
}) => {
  return {
    title: `${title} | PTM`,
    description:
      description ??
      "A digital signage solution for mosques to display prayer times, announcements, and more.",
  }
}

export const getContentType = (filename: string) => {
  const ext = path.extname(filename)

  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"
    case ".png":
      return "image/png"
    case ".gif":
      return "image/gif"
    case ".webp":
      return "image/webp"
    case ".mp4":
      return "video/mp4"
    case ".avi":
      return "video/avi"
    case ".mov":
      return "video/mov"
    case ".pdf":
      return "application/pdf"
    default:
      return "application/octet-stream"
  }
}

export const getExtensionFromMimeType = (mimeType: string): string => {
  const mimeMap: { [key: string]: string } = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "video/mp4": ".mp4",
    "video/avi": ".avi",
    "video/mov": ".mov",
    "application/pdf": ".pdf",
  }

  return mimeMap[mimeType] || ""
}
