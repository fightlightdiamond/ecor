/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#166534', // xanh trà
          dark: '#14532d',
        },
      },
    },
  },
  plugins: [],
};
