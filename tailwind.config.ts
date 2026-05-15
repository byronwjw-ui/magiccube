import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'cube-yellow': '#FFD500',
        'cube-blue': '#0046AD',
        'cube-red': '#B71234',
        'cube-green': '#009B48',
        'cube-orange': '#FF5800',
        'cube-white': '#FFFFFF',
        bg: {
          DEFAULT: '#F7F8FA',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.06)',
        pop: '0 8px 24px rgba(0,70,173,0.15)',
      },
      keyframes: {
        'flip-in': {
          '0%': { transform: 'rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        'pop': {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'flip-in': 'flip-in 0.4s ease-out',
        'pop': 'pop 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
