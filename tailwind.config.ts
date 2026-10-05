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
        canvas: "#FBFBF8",
        surface: "#FFFFFF",
        line: "#E8E8E1",
        ink: {
          DEFAULT: "#16211B",
          soft: "#3B4640",
          muted: "#6B756F",
          faint: "#98A19B",
        },
        sage: {
          50: "#F5F9EE",
          100: "#E7F0D8",
          200: "#D3E3B9",
          300: "#B6CF92",
          400: "#93B568",
          500: "#729A48",
          600: "#58803A",
          700: "#436429",
          800: "#334D21",
          900: "#243817",
        },
        /* Palette sobre : vert sauge + sable chaud */
        mint: "#E1EAD3",
        sand: "#EFE9DF",
        sky: { 50: "#EEF3F6", 100: "#DDE8EE", 600: "#3E7490" },
        cream: {
          50: "#FFFEFB",
          100: "#FCF7E4",
          200: "#F8EFCB",
          300: "#EEE2AE",
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
      },
      fontFamily: {
        sans: ["'Inter Variable'", "Inter", "system-ui", "sans-serif"],
        display: ["'Outfit Variable'", "Outfit", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "22px",
        "3xl": "32px",
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
