import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        'background-dark': "var(--background-dark)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        'primary-light': "var(--primary-light)",
        'primary-transparent': "var(--primary-transparent)",
        secondary: "var(--secondary)",
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--foreground)',
            a: {
              color: 'var(--primary)',
              '&:hover': {
                color: 'var(--primary-light)',
              },
            },
            h1: {
              color: 'var(--foreground)',
              fontSize: '24px',
              lineHeight: '1.2',
              letterSpacing: '-0.75px',
              marginTop: '0',
              marginBottom: 'calc(0.75rem * 0.5)',
              fontWeight: 'normal',
            },
            h2: {
              color: 'var(--foreground)',
              fontSize: '22px',
              lineHeight: '1.3',
              letterSpacing: '-0.5px',
              marginTop: 'calc(0.75rem * 1.5)',
              marginBottom: 'calc(0.75rem * 0.5)',
              fontWeight: 'normal',
            },
            h3: {
              color: 'var(--foreground)',
              fontSize: '20px',
              lineHeight: '1.3',
              letterSpacing: '-0.5px',
              marginTop: 'calc(0.75rem * 1.5)',
              marginBottom: 'calc(0.75rem * 0.5)',
              fontWeight: 'normal',
            },
            h4: {
              color: 'var(--foreground)',
              fontSize: '18px',
              lineHeight: '1.4',
              letterSpacing: '-0.25px',
              marginTop: 'calc(0.75rem * 1.25)',
              marginBottom: 'calc(0.75rem * 0.5)',
              fontWeight: 'normal',
            },
            h5: {
              color: 'var(--foreground)',
              fontSize: '16px',
              lineHeight: '1.5',
              letterSpacing: '-0.25px',
              marginTop: 'calc(0.75rem * 1.25)',
              marginBottom: 'calc(0.75rem * 0.5)',
              fontWeight: 'normal',
            },
            h6: {
              color: 'var(--foreground)',
              fontSize: '16px',
              lineHeight: '1.5',
              letterSpacing: '-0.25px',
              marginTop: 'calc(0.75rem * 1.25)',
              marginBottom: 'calc(0.75rem * 0.5)',
              fontWeight: 'normal',
            },
            strong: {
              color: 'var(--foreground)',
            },
            code: {
              color: 'var(--primary-light)',
            },
            pre: {
              backgroundColor: 'var(--background-dark)',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
