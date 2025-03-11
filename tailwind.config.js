/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5e17eb',
        secondary: '#b1bf9a',
        'primary-light': '#7c3aed',
        'secondary-light': '#c2cdb0',
        'primary-dark': '#4c11c7',
        'secondary-dark': '#9aaa82',
        'layout-bg': '#f6f6f6',
        'card-bg': '#ffffff',
      },
      boxShadow: {
        'modernize': '0 2px 6px 0 rgba(67, 89, 113, 0.12)',
      }
    },
  },
  plugins: [],
}