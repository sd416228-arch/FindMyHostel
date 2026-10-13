/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fm-blue': '#1a56db',
        'fm-blue-dark': '#0f3a8e',
        'fm-orange': '#e85d26',
        'fm-orange-dark': '#c94d1e',
        'fm-ink': '#0f172a',
        'fm-muted': '#64748b',
        'fm-line': '#e2e8f0',
        'fm-bg': '#f8fafc',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
