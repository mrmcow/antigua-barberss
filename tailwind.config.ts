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
        // Antigua Cool brand colors - Caribbean meets brutal
        black: "#000000",
        white: "#FFFFFF",
        concrete: "#E5E5E5",
        "antigua-coral": "#FF6B47", // Caribbean coral sunset
        "antigua-blue": "#0077BE", // Deep Caribbean blue
        "antigua-turquoise": "#40E0D0", // Crystal waters
        "antigua-gold": "#FFD700", // Island gold/sand
        "antigua-navy": "#001F3F", // Deep sea navy
        "antigua-sand": "#FDE7C8", // Warm sand tone
        "antigua-seafoam": "#CFF5E7", // Gentle lagoon hue
        // Official Flag Colors
        "flag-red": "#CE1126",
        "flag-blue": "#0072C6",
        "flag-gold": "#FCD116",
        "hot-pink": "#FF006E",
        "lime": "#CCFF00",
        // Keep LA colors for backwards compatibility during transition
        "la-orange": "#FF6B47", // Map to coral for now
        "la-yellow": "#FFD700", // Map to gold
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
  plugins: [],
};
export default config;

