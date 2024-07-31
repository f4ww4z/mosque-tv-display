import { Inter, El_Messiri } from "next/font/google"
import localFont from "next/font/local"

export const inter = Inter({ subsets: ["latin"] })

export const elMessiri = El_Messiri({ subsets: ["latin"] })

export const sourceSerifPro = localFont({
  src: [
    {
      path: "./fonts/SourceSerifPro-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/SourceSerifPro-BlackIt.otf",
      weight: "900",
      style: "italic",
    },
    {
      path: "./fonts/SourceSerifPro-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/SourceSerifPro-BoldIt.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/SourceSerifPro-ExtraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/SourceSerifPro-ExtraLightIt.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "./fonts/SourceSerifPro-It.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/SourceSerifPro-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/SourceSerifPro-LightIt.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/SourceSerifPro-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SourceSerifPro-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/SourceSerifPro-SemiboldIt.otf",
      weight: "600",
      style: "italic",
    },
  ],
})
