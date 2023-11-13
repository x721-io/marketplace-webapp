/** @type {import('tailwindcss').Config} */
const { colors } = require('./config/theme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/**/*.js'
  ],
  theme: {
    extend: {
      screens: {
        mobile: '480px',
        tablet: '768px',
        desktop: '1280px'
      },
      colors: {
        ...colors,
        primary: colors.gray[800],
        secondary: colors.gray[600],
        tertiary: colors.gray[400],
        disabled: colors.gray[200]
      },
      backgroundColor: {
        'surface-soft': colors.gray[100],
        'surface-medium': colors.gray[200],
        'surface-hard': colors.gray[500],
        button: colors.gray[900],
        'button-secondary': colors.gray[100],
        tab: colors.gray[0]
      },
      fontSize: {
        'heading-xl': ['64px', {
          lineHeight: '77px',
          letterSpacing: '-1px'
        }],
        'heading-md': ['40px', {
          lineHeight: '48px',
          letterSpacing: '-1px'
        }],
        'heading-sm': ['32px', {
          lineHeight: '38px',
          letterSpacing: '-0.5px'
        }],
        'heading-xs': ['24px', {
          lineHeight: '24px',
          letterSpacing: '-0.5px'
        }],
        'body-18': ['18px', {
          lineHeight: '28px',
          letterSpacing: '0px'
        }],
        'body-16': ['16px', {
          lineHeight: '24px',
          letterSpacing: '0px'
        }],
        'body-14': ['14px', {
          lineHeight: '21px',
          letterSpacing: '0px'
        }],
        'body-12': ['12px', {
          lineHeight: '18px',
          letterSpacing: '0px'
        }],
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ]
}

