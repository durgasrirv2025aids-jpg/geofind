/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f8f7ff',
          surface: '#ffffff',
          alt: '#f3f1fb',
          dark: '#0b0f19',
          darkSurface: '#151c2c',
        },
        topic: {
          mining: {
            DEFAULT: '#ef4444',
            dark: '#dc2626',
            light: '#fef2f2',
            border: '#fca5a5'
          },
          deforestation: {
            DEFAULT: '#22c55e',
            dark: '#16a34a',
            light: '#f0fdf4',
            border: '#86efac'
          },
          construction: {
            DEFAULT: '#f97316',
            dark: '#ea580c',
            light: '#fff7ed',
            border: '#fdba74'
          },
          sandmining: {
            DEFAULT: '#3b82f6',
            dark: '#2563eb',
            light: '#eff6ff',
            border: '#93c5fd'
          },
          wetland: {
            DEFAULT: '#a855f7',
            dark: '#9333ea',
            light: '#faf5ff',
            border: '#d8b4fe'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
