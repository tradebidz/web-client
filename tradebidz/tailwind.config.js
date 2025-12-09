/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Logo-based colors
        "primary-light": "rgb(var(--color-primary-light) / <alpha-value>)",
        "primary": "rgb(var(--color-primary) / <alpha-value>)",
        "primary-dark": "rgb(var(--color-primary-dark) / <alpha-value>)",

        // Text colors
        "text-main": "rgb(var(--color-text-main) / <alpha-value>)",
        "text-light": "rgb(var(--color-text-light) / <alpha-value>)",

        // Accent
        "accent": "rgb(var(--color-accent) / <alpha-value>)",

        // Background
        "bg": "rgb(var(--color-bg) / <alpha-value>)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Bạn nhớ import font Inter ở index.css hoặc Google Fonts
      }
    },
  },
  plugins: [],
}