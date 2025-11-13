import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f5ff",
          100: "#e6ebff",
          200: "#c5ccff",
          300: "#a3adff",
          400: "#7c82ff",
          500: "#5458ff",
          600: "#3b3be6",
          700: "#2a2cb3",
          800: "#1c1d80",
          900: "#0f104d"
        }
      }
    }
  },
  plugins: []
};

export default config;
