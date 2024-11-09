/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './views/**/*.{html,js,vue}',
    './components/**/*.{html,js,vue}',
    './src/**/*.{html,js,jsx,ts,tsx,vue}',
    './index.html',
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
       },
      colors: {
        'black': "#000000",
        'darkest': "#000814",
        'dark': "#0a121f",
        'blue': "#006cff",
        'light': "#e9f2ff",
        'white': "#ffffff",
        'shadow': "#000000"
      },
      fontSize: {
        'base': "1rem",
        'lg': "1.25rem",
        'xl': "1.5rem",
        '2xl': "2rem"
      },
    },
  },
  plugins: [],
}
