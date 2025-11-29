import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // LA Cool brand colors - brutal and bold
        black: "#000000",
        white: "#FFFFFF",
        concrete: "#E5E5E5",
        "la-orange": "#FF6B35", // sunset orange
        "la-yellow": "#F7B801", // electric yellow
        "hot-pink": "#FF006E",
        "lime": "#CCFF00",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-bebas)", "Bebas Neue", "Impact", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      fontSize: {
        // Brutal type scale
        "display": ["5rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "hero": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "h1": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "h2": ["2rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "h3": ["1.5rem", { lineHeight: "1.4" }],
      },
      animation: {
        "fade-in": "fadeIn 0.15s ease-in",
        "slide-up": "slideUp 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;

