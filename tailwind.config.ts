import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'success': 'success 0.5s ease-in-out',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'success': {
          '0%': { transform: 'scale(1)', backgroundColor: 'rgb(167, 243, 208)' },
          '50%': { transform: 'scale(1.1)', backgroundColor: 'rgb(110, 231, 183)' },
          '100%': { transform: 'scale(1)', backgroundColor: 'rgb(167, 243, 208)' },
        },
        'fadeIn': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      scale: {
        '95': '0.95',
        '105': '1.05',
      },
    },
  },
  plugins: [],
}
export default config
