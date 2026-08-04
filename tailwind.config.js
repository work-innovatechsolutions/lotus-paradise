/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#C62828",
          burgundy: "#8B1E1E",
          indigo: "#2C2473",
          gold: "#C89D45",
          "gold-light": "#F3D27A",
          ivory: "#FBF8F3",
          green: "#355E3B",
          charcoal: "#1F1F1F",
          muted: "#666666",
          border: "#E5DEC9",
          dark: "#111111",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "sans-serif"],
        accent: ["Manrope", "sans-serif"],
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(180deg, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.78) 100%)",
        "gradient-luxury-red": "linear-gradient(135deg, #C62828 0%, #8B1E1E 100%)",
        "gradient-luxury-gold": "linear-gradient(135deg, #F3D27A 0%, #C89D45 100%)",
        "gradient-mountain": "linear-gradient(135deg, #355E3B 0%, #2C2473 100%)",
        "gradient-page": "linear-gradient(180deg, #FFFDF8 0%, #F8F5EE 100%)",
        "gradient-footer": "linear-gradient(180deg, #141414 0%, #090909 100%)",
        "gradient-card": "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(250,247,242,0.9) 100%)",
      },
      boxShadow: {
        luxury: "0 10px 40px -10px rgba(44, 36, 115, 0.12)",
        "luxury-hover": "0 20px 50px -15px rgba(198, 40, 40, 0.22)",
        glass: "0 8px 32px 0 rgba(44, 36, 115, 0.07)",
        "golden-glow": "0 0 40px rgba(200,157,69,0.25), 0 10px 40px -10px rgba(198,40,40,0.18)",
        cinematic: "0 30px 80px -20px rgba(0,0,0,0.4)",
        "red-glow": "0 0 30px rgba(198,40,40,0.35), 0 8px 24px -8px rgba(198,40,40,0.3)",
      },
      keyframes: {
        "fog-flow": {
          "0%, 100%": { transform: "translateX(-3%) scaleY(1)", opacity: "0.3" },
          "50%": { transform: "translateX(3%) scaleY(1.05)", opacity: "0.55" },
        },
        "shimmer-gold": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "blob-float": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(30px, -20px) scale(1.05)" },
          "50%": { transform: "translate(-20px, 30px) scale(0.95)" },
          "75%": { transform: "translate(-30px, -10px) scale(1.02)" },
        },
        "float-up": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "breathing-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(198,40,40,0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(198,40,40,0.35)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "counter-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        fog: "fog-flow 18s ease-in-out infinite",
        shimmer: "shimmer-gold 3s linear infinite",
        "blob-float": "blob-float 20s ease-in-out infinite",
        "float-up": "float-up 4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.8s ease forwards",
        "breathing-glow": "breathing-glow 4s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.5s ease forwards",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        reveal: "cubic-bezier(0.77, 0, 0.175, 1)",
      },
    },
  },
  plugins: [],
};
