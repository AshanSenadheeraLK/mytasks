/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF', // Blue-800
        accent: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
          dark: '#2563eb'
        },
        accentDark: '#2563EB', // Blue-600
        accentLight: '#60A5FA', // Blue-400
        background: {
          DEFAULT: '#f8fafc',
          dark: '#111827'
        },
        foreground: {
          DEFAULT: '#334155',
          dark: '#e2e8f0'
        },
        border: {
          DEFAULT: '#e2e8f0',
          dark: '#1f2937'
        },
        completed: {
          DEFAULT: '#9ca3af',
          dark: '#6b7280'
        },
        success: '#10B981', // Green-500
        warning: '#F59E0B', // Amber-500
        error: '#EF4444', // Red-500
        info: '#3B82F6', // Blue-500
        cardBg: {
          DEFAULT: 'white',
          dark: '#1f2937'
        },
      },
      fontFamily: {
        'sans': ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'display': ['Orbitron', 'Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'nav': '0 2px 4px rgba(0, 0, 0, 0.08)',
        'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'button': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'button-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'dark-card': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'dark-card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      screens: {
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
        'desktop': {'min': '1024px'}
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
  ],
} 