import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0F",
        surface: "#12121A",
        surface2: "#1A1A26",
        border: "#2A2A3D",
        accent: "#CC785C",
        accent2: "#7B68EE",
        text: "#F0EEE6",
        muted: "#666655",
        r2fit: "#E8FF47",
        r2school: "#2D7DD2",
        r2finance: "#E53935",
        r2build: "#FFFFFF",
      },
      fontFamily: {
        display: ["Impact", "Haettenschweiler", "Arial Narrow Bold", "sans-serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["DM Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
