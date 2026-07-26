import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        os: {
          mist: "#EAEAEF", 
          lilac: "#D5D2E4", 
          pink: "#F1DDE6", 
          slate: "#BAB7CC", 
          ink: "#4A4657",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      boxShadow: {
        window: "0 20px 60px -15px rgba(74, 70, 87, 0.45)",
        icon: "0 8px 20px -6px rgba(74, 70, 87, 0.35)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "window-in": {
          "0%": { opacity: "0", transform: "scale(0.92) translateY(12px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "lock-out": {
          "0%": { opacity: "1", filter: "blur(0px)" },
          "100%": { opacity: "0", filter: "blur(6px)" },
        },
        "float-icon": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out forwards",
        "window-in": "window-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "lock-out": "lock-out 0.6s ease forwards",
      },
    },
  },
  plugins: [],
};
export default config;
