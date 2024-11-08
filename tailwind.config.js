/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/*.{html,js,vue}',
    './components/**/*.{html,js,vue}',
    './src/**/*.{html,js,jsx,ts,tsx,vue}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        "black": "#000000",
        "darkest": "#000814",
        "dark": "#0a121f",
        "blue": "#006cff",
        "light": "#e9f2ff",
        "white": "#ffffff",
        "shadow": "#000000"
      },
      fontSize: {
        "base": "1rem",
        "lg": "1.25rem",
        "xl": "1.5rem",
        "2xl": "2.25rem"
      },
      fontFamily: {
        "raleway": "Raleway",
        "roboto": "Roboto"
      },
      borderRadius: {
        "rounded-0": "0rem",
        "rounded-1": "4rem"
      }
    },
  },
  plugins: [],
}

