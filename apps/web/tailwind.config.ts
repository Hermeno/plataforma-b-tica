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
        // ---- LEAOZINHO COLOR SYSTEM ----
        brand: {
          DEFAULT: '#F59E0B',   // Dourado principal
          light: '#FCD34D',     // Dourado claro
          dark: '#D97706',      // Dourado escuro
          glow: '#F59E0B33',    // Glow dourado (transparente)
        },
        surface: {
          DEFAULT: '#111827',   // Background principal
          card: '#1F2937',      // Cards e painéis
          elevated: '#374151',  // Elementos elevados
          border: '#374151',    // Bordas
          input: '#1F2937',     // Inputs
        },
        neon: {
          green: '#10B981',     // Verde vitória
          red: '#EF4444',       // Vermelho perda
          blue: '#3B82F6',      // Azul info
          purple: '#8B5CF6',    // Roxo especial
        },
        text: {
          primary: '#F9FAFB',
          secondary: '#9CA3AF',
          muted: '#6B7280',
          inverse: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'dark-gradient': 'linear-gradient(180deg, #1F2937 0%, #111827 100%)',
        'card-gradient': 'linear-gradient(180deg, #1F2937 0%, #111827 100%)',
        'hero-gradient': 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #111827 100%)',
        'game-overlay': 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 60%)',
      },
      boxShadow: {
        'brand': '0 0 20px rgba(245, 158, 11, 0.3)',
        'brand-lg': '0 0 40px rgba(245, 158, 11, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'inner-brand': 'inset 0 1px 0 rgba(245, 158, 11, 0.2)',
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
