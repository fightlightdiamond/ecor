/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f0',
          100: '#faefd9',
          200: '#f3dab0',
          300: '#e9c07f',
          400: '#dda04d',
          500: '#c9a86c',
          600: '#b8903a',
          700: '#9a7530',
          800: '#7d5e2b',
          900: '#664e25',
        },
        dark: {
          DEFAULT: '#1a1a1a',
          800: '#222222',
          700: '#2d2d2d',
          600: '#3d3d3d',
          500: '#555555',
        },
      },
      fontFamily: {
        // Đồng bộ toàn hệ thống về một font duy nhất: Inter.
        // Giữ nguyên các token (heading/body/condensed) để mọi class hiện có
        // (font-heading/font-condensed/...) vẫn hoạt động nhưng đều trỏ về Inter.
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        condensed: ['Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
        },
      },
    },
  },
  plugins: [],
}
