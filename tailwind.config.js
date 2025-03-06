/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust this if your files are in a different location
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        gray: {
          light: "#F5F5F5",
          DEFAULT: "#E0E0E0",
          dark: "#A0A0A0",
        },
      },
    },
  },
  plugins: [],
};
