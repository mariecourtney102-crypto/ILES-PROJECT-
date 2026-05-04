/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#14b8a6",   // teal-500
          dark: "#0f766e",      // teal-700
          light: "#5eead4"      // teal-300
        }
      }
    },
  },
  plugins: [],
};