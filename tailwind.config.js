/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Primary (Brand) Colors - Indigo
        primary: {
          DEFAULT: '#4F46E5', // Indigo-600
          hover: '#4338CA',   // Indigo-700
          dark: '#3730A3',    // Indigo-800
        },
        // Secondary Colors - Gray
        secondary: {
          DEFAULT: '#6B7280', // Gray-500
          hover: '#4B5563',   // Gray-600
        },
        // Accent Colors - Emerald
        accent: {
          DEFAULT: '#10B981', // Emerald-500 
          hover: '#059669',   // Emerald-600
        },
        // Neutral Colors
        background: {
          DEFAULT: '#F9FAFB', // Gray-50
          dark: '#111827'     // Gray-900 for dark mode
        },
        foreground: {
          DEFAULT: '#1F2937', // Gray-900 for primary text
          secondary: '#6B7280', // Gray-500 for secondary text
          muted: '#9CA3AF',   // Gray-400 for muted text
          dark: '#F9FAFB'     // Gray-50 for dark mode text
        },
        border: {
          DEFAULT: '#E5E7EB', // Gray-200
          dark: '#374151'     // Gray-700 for dark mode
        },
        cardBg: {
          DEFAULT: '#FFFFFF', // White
          dark: '#1F2937'     // Gray-800 for dark mode
        },
        // Status Colors
        completed: {
          DEFAULT: '#9ca3af',
          dark: '#6b7280'
        },
        success: '#10B981', // Emerald-500
        warning: '#F59E0B', // Amber-500
        danger: '#EF4444', // Red-500
        info: '#3B82F6', // Blue-500
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
        'dark-card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
        'bottom-nav': '0 -2px 10px rgba(0, 0, 0, 0.05)',
        'mobile-header': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'mobile-modal': '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-right': 'slideOutRight 0.3s ease-in',
        'scale-in': 'scaleIn 0.2s ease-out',
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
        slideInRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      screens: {
        'xs': '375px', // Extra small screens
        'sm': '640px', // Small screens
        'md': '768px', // Medium screens (tablet)
        'lg': '1024px', // Large screens
        'xl': '1280px', // Extra large screens
        '2xl': '1536px', // 2X large screens
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
        'desktop': {'min': '1024px'},
        'touch': {'raw': '(hover: none) and (pointer: coarse)'},
        'mouse': {'raw': '(hover: hover) and (pointer: fine)'},
      },
      spacing: {
        '18': '4.5rem',
        '68': '17rem',
        '88': '22rem',
        '128': '32rem',
      },
      minHeight: {
        'touch-target': '44px',
      },
      minWidth: {
        'touch-target': '44px',
      },
      fontSize: {
        'xxs': '0.625rem', // Even smaller text for mobile
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
  ],
} 