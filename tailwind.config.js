/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1d4ed8', // Blue-700
          light: '#3b82f6',   // Blue-500
          dark: '#1e40af'     // Blue-800
        },
        base: {
          blue: '#1d4ed8',    // Blue-700
          black: '#111827',   // Gray-900
          green: '#16a34a',   // Green-600
          yellow: '#facc15',  // Yellow-400
          red: '#ef4444'      // Red-500
        },
        accent: {
          DEFAULT: '#3b82f6', // Blue-500
          light: '#60a5fa',   // Blue-400
          dark: '#1d4ed8'     // Blue-700
        },
        background: {
          DEFAULT: '#f8fafc',           // Slate-50
          dark: '#111827',              // Gray-900
          secondary: '#f1f5f9',         // Slate-100
          'secondary-dark': '#1f2937',  // Gray-800
        },
        foreground: {
          DEFAULT: '#334155',  // Slate-700
          dark: '#e2e8f0'      // Slate-200
        },
        border: {
          DEFAULT: '#e2e8f0',  // Slate-200
          dark: '#1e293b'      // Slate-800
        },
        card: {
          DEFAULT: '#ffffff',      // White
          dark: '#1e293b',         // Slate-800
          hover: '#f8fafc',        // Slate-50
          'hover-dark': '#0f172a'  // Slate-900
        },
        status: {
          success: '#16a34a',      // Green-600 
          warning: '#facc15',      // Yellow-400
          error: '#ef4444',        // Red-500
          info: '#3b82f6',         // Blue-500
          successDark: '#22c55e',  // Green-500
          warningDark: '#fbbf24',  // Amber-400
          errorDark: '#f87171',    // Red-400
          infoDark: '#60a5fa',     // Blue-400
        }
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
        'dark-card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.15)',
        'dark-card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
        'inner-light': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'inner-dark': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.25)',
        'focus-ring': '0 0 0 3px rgba(59, 130, 246, 0.5)',
        'focus-ring-dark': '0 0 0 3px rgba(96, 165, 250, 0.5)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-sm': 'bounceSm 0.6s ease-in-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
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
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceSm: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
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