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
          50: "#e8f1fb",
          100: "#c5d9f5",
          200: "#9fc0ee",
          300: "#79a7e7",
          400: "#5c93e2",
          500: "#3f7fdd",
          600: "#2a68c4",
          700: "#1a4f9a",
          800: "#0F4C81",
          900: "#0a3460",
        },
        accent: {
          50: "#fff2ed",
          100: "#ffdccc",
          200: "#ffbfa3",
          300: "#ffa07a",
          400: "#ff8558",
          500: "#FF6B35",
          600: "#e85a22",
          700: "#c44814",
          800: "#a0380a",
          900: "#7c2a04",
        },
        surface: "#F9FAFB",
        dark: "#1A1A2E",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(15, 76, 129, 0.08)",
        "card-hover": "0 8px 32px 0 rgba(15, 76, 129, 0.16)",
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
