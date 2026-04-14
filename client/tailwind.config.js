/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#111111',
        secondary: '#E53935',
        accent: '#FFFFFF',
        navy: '#1E3A8A',
        'navy-dark': '#172554',
        'navy-light': '#DBEAFE',
        'dark-card': '#1A1A1A',
        'dark-border': '#2A2A2A',
        muted: '#888888',
        success: '#2E7D32',
        warning: '#FB8C00',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
