export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#003D7A',
        'primary-light': '#0052A3',
        'accent': '#FFD700',
        'accent-dark': '#FFC700',
        'background': '#FFFFFF',
        'text-dark': '#1F2937',
        'text-light': '#6B7280',
        'border-light': '#E5E7EB',
        'success': '#10B981',
        'warning': '#F59E0B',
        'danger': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      }
    },
  },
  plugins: [],
}
