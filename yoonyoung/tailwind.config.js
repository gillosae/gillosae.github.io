/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['MaruBuri', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'maruburi': ['MaruBuri', 'sans-serif'],
        'maruburi-semibold': ['MaruBuriSemiBold', 'sans-serif'],
        'maruburi-bold': ['MaruBuriBold', 'sans-serif'],
        'maruburi-light': ['MaruBuriLight', 'sans-serif'],
        'maruburi-extralight': ['MaruBuriExtraLight', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

