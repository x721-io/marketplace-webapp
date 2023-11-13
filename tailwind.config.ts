import type { Config } from 'tailwindcss'
import { colors } from '@/config/theme'

const config: Config = {
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
        surfaceSoft: colors.gray[100],
        surfaceMedium: colors.gray[200],
        surfaceHard: colors.gray[500],
        button: colors.gray[900],
        buttonSecondary: colors.gray[100],
        tab: colors.gray[0]
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
module.exports = config
