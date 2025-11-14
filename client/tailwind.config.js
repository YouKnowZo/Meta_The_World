/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'meta-blue': '#0066FF',
        'meta-purple': '#8B5CF6',
        'meta-dark': '#0A0E27',
      },
    },
  },
  plugins: [],
}
