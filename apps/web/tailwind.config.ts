import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ---- 3633BET COLOR SYSTEM ----
        brand: {
          DEFAULT: '#007A5A',   // Verde principal
          light: '#009B72',     // Verde claro
          dark: '#005C44',      // Verde escuro
          glow: '#007A5A33',    // Glow verde (transparente)
        },
        surface: {
          DEFAULT: '#000000',   // Background principal preto
          card: '#0D0D0D',      // Cards e painéis
          elevated: '#1A1A1A',  // Elementos elevados
          border: '#222222',    // Bordas
          input: '#0D0D0D',     // Inputs
        },
        neon: {
          green: '#007A5A',     // Verde vitória
          red: '#EF4444',       // Vermelho perda
          blue: '#3B82F6',      // Azul info
          purple: '#8B5CF6',    // Roxo especial
        },
        text: {
          primary: '#D9D9D9',
          secondary: '#A6A6A6',
          muted: '#6B7280',
          inverse: '#000000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #007A5A 0%, #005C44 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0D0D0D 0%, #000000 100%)',
        'card-gradient': 'linear-gradient(180deg, #0D0D0D 0%, #000000 100%)',
        'hero-gradient': 'linear-gradient(135deg, #000000 0%, #0D0D0D 50%, #000000 100%)',
        'game-overlay': 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 60%)',
      },
      boxShadow: {
        'brand': '0 0 20px rgba(0, 122, 90, 0.3)',
        'brand-lg': '0 0 40px rgba(0, 122, 90, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.6)',
        'inner-brand': 'inset 0 1px 0 rgba(0, 122, 90, 0.2)',
      },
      animation: {
        'pulse-brand': 'pulse-brand 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        'pulse-brand': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
