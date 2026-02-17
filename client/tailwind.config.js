const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./store/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Redefine base grays to Slate (The "Linear/Notion" cool neutral)
        gray: colors.slate,
        // Brand logic
        brand: {
          50: '#eff6ff', // Light Blue/Indigo tint
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Neutral Blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Functional Colors
        success: colors.emerald,
        warning: colors.amber,
        danger: colors.rose,
      },
      boxShadow: {
        // Crisp borders, minimal shadow
        'xs': '0 0 0 1px rgba(0,0,0,0.05)',
        'sm': '0 1px 2px 0 rgba(0,0,0,0.05)',
        'md': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'lg': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'card': '0 0 0 1px rgba(0,0,0,0.05), 0 1px 3px 0 rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [],
}
