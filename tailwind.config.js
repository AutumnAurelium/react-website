import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            h1: {
              fontSize: '1.75rem', // 28px
              fontWeight: '500',
              letterSpacing: '-0.025em',
            },
            h2: {
              fontSize: '1.5rem', // 24px
              fontWeight: '500',
              letterSpacing: '-0.025em',
            },
            h3: {
              fontSize: '1.25rem', // 20px
              fontWeight: '500',
            },
            h4: {
              fontSize: '1.125rem', // 18px
              fontWeight: '500',
            },
            code: {
              backgroundColor: 'rgb(31 41 55)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            }
          }
        }
      }
    },
  },
  plugins: [
    typography,
  ],
} 