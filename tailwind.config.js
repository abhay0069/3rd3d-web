/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0D0C0A',
        charcoal: '#1A1917',
        graphite: '#2A2724',
        smoke: '#4A453E',
        taupe: '#8C8378',
        ivory: '#F7F3EC',
        porcelain: '#FCFAF6',
        sand: '#E9E1D4',
        beige: '#D9CCB8',
        champagne: '#C8A87C',
        brass: '#A9884E',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.32em',
        wide2: '0.18em',
      },
      fontSize: {
        '10xl': ['9rem', { lineHeight: '0.86' }],
        '11xl': ['12rem', { lineHeight: '0.84' }],
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
        cinema: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      screens: {
        xs: '420px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        drift: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3.2s linear infinite',
        drift: 'drift 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
