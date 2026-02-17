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
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Noto Sans', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji'],
        display: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Noto Sans', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      colors: {
        // GitHub Dark Theme Palette
        background: '#0d1117',    // canvas-default
        surface: '#161b22',       // canvas-subtle
        elevated: '#21262d',      // canvas-overlay
        active: '#30363d',        // border-default
        border: '#30363d',        // border-default
        'border-strong': '#8b949e', // border-muted/fg-muted
        'fg-default': '#e6edf3',
        'fg-muted': '#7d8590',

        // GitHub Brand Blue
        brand: {
          50: '#cae8ff',
          100: '#ade0ff',
          200: '#91d5ff',
          300: '#6cb6ff',
          400: '#4da5ff',
          500: '#2f81f7', // GitHub Accent
          600: '#1f6feb',
          700: '#1158c7',
          800: '#0d419d',
          900: '#0c2d6b',
        },

        // GitHub Status Colors (Success Green replaced with Brand Coral #FF785A)
        success: '#FF785A',
        warning: '#d29922',
        danger: '#da3633',
        info: '#2f81f7',
      },
      boxShadow: {
        'premium-sm': '0 1px 0 rgba(1, 4, 9, 0.4)',
        'premium-md': '0 3px 6px rgba(1, 4, 9, 0.5)',
        'premium-lg': '0 8px 24px rgba(1, 4, 9, 0.6)',
        'premium-xl': '0 12px 28px rgba(1, 4, 9, 0.8)',
        'inner-border': 'inset 0 0 0 1px rgba(240, 246, 252, 0.1)',
      },
      borderRadius: {
        'xl': '6px',
        '2xl': '12px',
        '3xl': '18px',
      },
      letterSpacing: {
        tightest: '-.075em',
        tighter: '-.05em',
        tight: '-.025em',
      }
    },
  },
  plugins: [],
}
