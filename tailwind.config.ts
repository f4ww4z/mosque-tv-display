import type { Config } from "tailwindcss"

const variants = ["darker", "dark", "DEFAULT", "light", "lighter", "dim"]

const masjidSignageThemes = ["teal", "gold", "magenta", "blue"]

const safelistClasses = []
for (const theme of masjidSignageThemes) {
  for (const variant of variants) {
    safelistClasses.push(
      variant === "DEFAULT" ? `from-${theme}` : `from-${theme}-${variant}`
    )
    safelistClasses.push(
      variant === "DEFAULT" ? `to-${theme}` : `to-${theme}-${variant}`
    )
    safelistClasses.push(
      variant === "DEFAULT" ? `bg-${theme}` : `bg-${theme}-${variant}`
    )
    safelistClasses.push(
      variant === "DEFAULT" ? `bg-${theme}/50` : `bg-${theme}-${variant}/50`
    )
    safelistClasses.push(
      variant === "DEFAULT" ? `bg-${theme}/80` : `bg-${theme}-${variant}/80`
    )
    safelistClasses.push(
      variant === "DEFAULT" ? `border-${theme}` : `border-${theme}-${variant}`
    )
  }
}

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: safelistClasses,
  theme: {
    colors: {
      current: "currentColor",
      transparent: "transparent",
      white: "#FFFFFF",
      black: "#030303",
      dark: "#121212",
      gray: {
        DEFAULT: "#B5B5B5",
        light: "#eeeeee",
        lighter: "#c7c7c7",
      },
      accent: {
        DEFAULT: "#F6AF58",
        dark: "#b06d00",
      },
      orange: "#b75c00",
      red: {
        DEFAULT: "#ff4444",
        light: "#ff8181",
      },
      primary: {
        darker: "#102A2B",
        dark: "#133D3E",
        DEFAULT: "#1A4A4C",
        light: "#1C5153",
        lighter: "#188D92",
        dim: "#5D8082",
      },
      error: {
        DEFAULT: "#8a0000",
        light: "#ff9b9b",
      },
      waGreen: "#25D366",
      approveGreen: "#00C851",
      declineRed: "#ff4444",
      teal: {
        darker: "#102A2B",
        dark: "#133D3E",
        DEFAULT: "#1A4A4C",
        light: "#1C5153",
        lighter: "#188D92",
        dim: "#5D8082",
      },
      gold: {
        darker: "#151500",
        dark: "#383302",
        DEFAULT: "#443c0f",
        light: "#685b11",
        lighter: "#ab951e",
        dim: "#fff2aa",
      },
      magenta: {
        darker: "#1e0014",
        dark: "#440022",
        DEFAULT: "#4c021f",
        light: "#680035",
        lighter: "#96104f",
        dim: "#FF00FF",
      },
      blue: {
        darker: "#020020",
        dark: "#020046",
        DEFAULT: "#000059",
        light: "#000070",
        lighter: "#1414a1",
        dim: "#8080ff",
      },
    },
    screens: {
      xs: "450px",
      // => @media (min-width: 450px) { ... }

      sm: "575px",
      // => @media (min-width: 576px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "992px",
      // => @media (min-width: 992px) { ... }

      xl: "1200px",
      // => @media (min-width: 1200px) { ... }

      "2xl": "1400px",
      // => @media (min-width: 1400px) { ... }

      "3xl": "1600px",
      // => @media (min-width: 1600px) { ... }
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}
export default config
