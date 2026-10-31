/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette officielle de la direction artistique
        forest: {
          50: '#f1f7f3',
          100: '#deeee3',
          200: '#bedfc9',
          300: '#91caa7',
          400: '#5fae80',
          500: '#3d9361',
          600: '#2d764d',
          700: '#255e3e',
          800: '#234B35', // Vert forêt exact
          900: '#1b3c2a',
          950: '#11261a',
          main: '#234B35',
          nature: '#557A46', // Vert naturel exact
        },
        earth: {
          50: '#fbf8f5',
          100: '#f5eee8',
          200: '#ebdcd1',
          300: '#dcc1b0',
          400: '#c59d87',
          500: '#af7e64',
          600: '#8A6246', // Brun terre exact
          700: '#734e37',
          800: '#5f412f',
          900: '#4f372a',
          950: '#2b1c14',
          brown: '#8A6246',
        },
        cream: {
          50: '#FCFBF7',  // Blanc cassé exact
          100: '#F6F2E9', // Fond crème exact
          200: '#eee8dc',
          300: '#dfd5c1',
          400: '#cbbda1',
          500: '#b8a383',
        },
        anthracite: '#292D29', // Texte anthracite exact
        warm: {
          50: '#FCFBF7',
          100: '#F6F2E9',
          200: '#eee8dc',
          300: '#e2d7c5',
          400: '#cfbea6',
          500: '#bca386',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      }
    },
  },
  plugins: [],
}
