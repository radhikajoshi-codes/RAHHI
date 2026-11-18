/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        raahi: {
          teal: '#00BFA5',
          tealDark: '#0D9488',
          tealLight: '#E6F7F5',
          pink: '#FCE7EB',
          pinkDark: '#F43F5E',
          card: '#FFFFFF',
          bg: '#F9FAFD',
          sidebar: '#FCF7F8',
          subtle: '#64748B'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'scan': 'scan 2.5s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.8' },
          '50%': { transform: 'translateY(220px)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
