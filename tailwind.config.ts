import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f2f7fa",
          100: "#e5eff4",
          200: "#c2d9e5",
          300: "#88b4c9",
          400: "#35657c", // Gradient light stop
          500: "#234c60", // Primary: Buttons, links, active states
          600: "#1b3e50",
          700: "#14313f", // Gradient deep stop
          800: "#102632",
          900: "#0d212d",
        },
        accent: {
          50: "#fef7f1",
          100: "#fdeee2",
          200: "#fbd8c1",
          300: "#f8be97",
          400: "#f5a873",
          500: "#f09a57", // Accent: Small highlights/CTAs
          600: "#e08945",
          700: "#c7641e",
          800: "#a04e14",
          900: "#7a380a",
        },
        mint: {
          50: "#f4fbf8",
          100: "#d4ece5", // Mint: Verified/success elements
          200: "#bce2d7",
          300: "#92d3c0",
          400: "#5dbca3",
          500: "#359e83",
          600: "#257d67",
          700: "#1d5e4e",
        },
        softblue: "#e5eff4",
        surface: "#f8fafc", // Main background
        card: "#ffffff",    // Card background
        dark: "#0d212d",    // Dark text (headings)
        secondary: "#2d4756", // Secondary text (descriptions)
        border: "#cbd8df",  // Cards and dividers
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Outfit", "Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Poppins", "Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 14px 0 rgba(59, 130, 160, 0.08)",
        "card-hover": "0 8px 30px 0 rgba(59, 130, 160, 0.14)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
