/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Noir & gold: the stage ────────────────────────────────────────
        ink: '#0A0908',
        noir: '#100E0C',
        char: '#16130F',
        umber: '#211B15',
        gold: { DEFAULT: '#CDAA6E', hi: '#F3E0B5', lo: '#8C6C3B' },
        copper: '#B9773E',

        // ── Ivory & paper: the light interludes (and the booking flow) ────
        ivory: '#F7F3EC',
        porcelain: '#FCFAF6',
        sand: '#E9E1D4',
        beige: '#D9CCB8',
        charcoal: '#1A1917',
        graphite: '#2A2724',
        smoke: '#4A453E',
        taupe: '#8C8378',
        champagne: '#CDAA6E',
        brass: '#A9884E',
      },
      fontFamily: {
        display: ['"Bodoni Moda Variable"', '"Bodoni Moda"', 'Didot', 'Georgia', 'serif'],
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
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
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
        marquee: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-50%,0,0)' },
        },
        grain: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '20%': { transform: 'translate3d(-4%,3%,0)' },
          '40%': { transform: 'translate3d(3%,-5%,0)' },
          '60%': { transform: 'translate3d(-6%,-2%,0)' },
          '80%': { transform: 'translate3d(5%,4%,0)' },
          '100%': { transform: 'translate3d(0,0,0)' },
        },
        kenburns: {
          '0%': { transform: 'scale(1) translate3d(0,0,0)' },
          '100%': { transform: 'scale(1.07) translate3d(-0.6%,-0.8%,0)' },
        },
        scrollcue: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(260%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3.2s linear infinite',
        drift: 'drift 7s ease-in-out infinite',
        marquee: 'marquee 46s linear infinite',
        grain: 'grain 1.1s steps(1) infinite',
        kenburns: 'kenburns 26s ease-in-out infinite alternate',
        scrollcue: 'scrollcue 2.4s cubic-bezier(0.65,0,0.35,1) infinite',
      },
    },
  },
  plugins: [],
}
