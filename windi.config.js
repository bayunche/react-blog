import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['src/**/*.{html,jsx,js}'],
    exclude: ['node_modules', '.git'],
  },
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ff',
          100: '#fdeeff',
          200: '#ffc9e3',
          300: '#ff9ac7',
          400: '#ff69b4',
          500: '#ff1493',
          600: '#e6007a',
          700: '#cc0066',
          800: '#b30052',
          900: '#99003d',
        },
        secondary: {
          50: '#f0f8ff',
          100: '#e6f3ff',
          200: '#b3ddff',
          300: '#87ceeb',
          400: '#5bb8e6',
          500: '#4682b4',
          600: '#3a6d96',
          700: '#2e5578',
          800: '#223e5a',
          900: '#16263c',
        },
        accent: {
          50: '#f0fff0',
          100: '#e6ffe6',
          200: '#ccffcc',
          300: '#98fb98',
          400: '#7ae67a',
          500: '#00ff7f',
          600: '#00e671',
          700: '#00cc63',
          800: '#00b355',
          900: '#009947',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.25)',
          black: 'rgba(0, 0, 0, 0.25)',
        }
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '20px',
        xl: '40px',
      },
      borderRadius: {
        'cute': '16px',
        'super': '24px',
        'ultra': '32px',
      },
      fontFamily: {
        'cute': ['PingFang SC', 'Hiragino Sans GB', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'bounce-cute': 'bounce-cute 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        'bounce-cute': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow': {
          'from': { boxShadow: '0 0 20px rgba(255, 105, 180, 0.5)' },
          'to': { boxShadow: '0 0 30px rgba(255, 105, 180, 0.8)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [
    require('windicss/plugin/aspect-ratio'),
    require('windicss/plugin/line-clamp'),
  ],
})