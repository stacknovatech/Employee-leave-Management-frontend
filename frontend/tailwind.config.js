// =============================================
// Tailwind CSS Configuration
// Custom theme with premium dark & light modes
// =============================================

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // -- Poppins font family --
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },

      // -- Custom color palette for Leave Management App --
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },

        // dark mode surfaces
        surface: {
          DEFAULT: "#0f0f0f",
          card: "#171717",
          hover: "#1f1f1f",
          border: "#2a2a2a",
        },

        // light mode surfaces
        cream: {
          DEFAULT: "#ffffff",
          card: "#f9fafb",
          hover: "#f3f4f6",
          border: "#e5e7eb",
        },
      },

      // -- Border radius matching shadcn defaults --
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // -- Smooth animations --
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.25s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
