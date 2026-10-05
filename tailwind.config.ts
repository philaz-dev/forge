import type { Config } from "tailwindcss";

/**
 * Design tokens de Vita.
 * - `canvas` / `surface` / `line` / `ink` : neutres chauds, très discrets.
 * - `sage` : la couleur de marque (vert sauge → vert profond).
 * - `cream` : fond de l'espace propriétaire, plus chaleureux.
 * Les couleurs sémantiques (amber / rose) sont volontairement désaturées.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F6F6F2",
        surface: "#FFFFFF",
        line: "#E8E8E1",
        ink: {
          DEFAULT: "#16211B",
          soft: "#3B4640",
          muted: "#6B756F",
          faint: "#98A19B",
        },
        sage: {
          50: "#F3F7F4",
          100: "#E4EDE7",
          200: "#C9DACF",
          300: "#A4BFAF",
          400: "#7BA18B",
          500: "#588469",
          600: "#436C54",
          700: "#325541",
          800: "#294535",
          900: "#1C3126",
        },
        cream: {
          50: "#FDFBF7",
          100: "#FAF6EE",
          200: "#F3ECDD",
          300: "#E9DFC9",
        },
        amber: {
          50: "#FBF5E8",
          100: "#F5E8C8",
          600: "#A87614",
          700: "#85600F",
        },
        rose: {
          50: "#FBF0EE",
          100: "#F5DCD7",
          600: "#B5473A",
          700: "#923A2F",
        },
        sky: {
          50: "#EFF5F8",
          100: "#DCE9F0",
          600: "#3E7490",
        },
      },
      fontFamily: {
        sans: ["'Inter Variable'", "Inter", "system-ui", "sans-serif"],
        display: ["'Fraunces Variable'", "Georgia", "serif"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
        "3xl": "26px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(22,33,27,0.04), 0 0 0 1px rgba(22,33,27,0.02)",
        lift: "0 8px 30px -12px rgba(22,33,27,0.18), 0 1px 2px rgba(22,33,27,0.05)",
        pop: "0 24px 60px -20px rgba(22,33,27,0.30), 0 2px 6px rgba(22,33,27,0.06)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96) translateY(6px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-right": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(88,132,105,0.35)" },
          "100%": { boxShadow: "0 0 0 10px rgba(88,132,105,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "fade-up": "fade-up .5s cubic-bezier(.2,.7,.2,1) both",
        "fade-in": "fade-in .25s ease-out both",
        "scale-in": "scale-in .22s cubic-bezier(.2,.7,.2,1) both",
        "slide-up": "slide-up .3s cubic-bezier(.2,.7,.2,1) both",
        "slide-right": "slide-right .28s cubic-bezier(.2,.7,.2,1) both",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
