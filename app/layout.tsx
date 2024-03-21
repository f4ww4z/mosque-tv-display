import { Inter } from "next/font/google"

import "react-multi-carousel/lib/styles.css"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Mosque TV Display",
  description: "A TV display for mosques",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={inter.className}>{children}</body>
    </html>
  )
}
