import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0F",
        accent: "#7C5CFF",
        accent2: "#00E0B8",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Inter", "sans-serif"],
        display: ["ui-serif", "Georgia", "serif"],
      },
      keyframes: {
        pulse: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.55" } },
      },
      animation: { pulse: "pulse 2.4s ease-in-out infinite" },
    },
  },
  plugins: [],
} satisfies Config;
