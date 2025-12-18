/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        inter: ["Inter","sans-serif"],
        josefin:["Josefin Sans", "sans-serif"],
        caveat: ["Caveat","cursive"],
        marker: ["Permanent Marker", 'cursive'],
        shadows: ["Shadows Into Light", 'cursive'],
      },
    },
  },
  plugins: [

  ],
}

