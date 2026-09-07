/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        cream: '#FFFFFF',
        muted: '#6B7280',
        brand: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          400: '#FB923C',
          500: '#F5A623', // laranja principal (assinatura da marca)
          600: '#EA8A00',
          700: '#C2670A',
        },
      },
      fontFamily: {
        display: ['Archivo Black', 'Arial Black', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '.25em',
      },
      boxShadow: {
        card: '0 10px 40px -12px rgba(17, 17, 17, 0.18)',
        glow: '0 0 0 4px rgba(245, 166, 35, 0.15)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(245, 166, 35, 0.5)' },
          '70%': { boxShadow: '0 0 0 12px rgba(245, 166, 35, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(245, 166, 35, 0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up .6s cubic-bezier(.16,1,.3,1) both',
        'fade-in': 'fade-in .5s ease both',
        'scale-in': 'scale-in .4s cubic-bezier(.16,1,.3,1) both',
        'slide-in-right': 'slide-in-right .35s cubic-bezier(.16,1,.3,1) both',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(.66,0,0,1) infinite',
      },
    },
  },
  plugins: [],
}
