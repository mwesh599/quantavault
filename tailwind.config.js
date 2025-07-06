const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        golden: {
          50: '#fffbea',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      backgroundImage: {
        'radial-golden':
          'radial-gradient(circle at center, rgba(251, 191, 36, 0.15), transparent)',
        'conic-golden':
          'conic-gradient(from 180deg at center, rgba(251, 191, 36, 0.08), transparent)',
        'grid-overlay':
          'linear-gradient(45deg, transparent 25%, rgba(251,191,36,0.05) 50%, transparent 75%)',
      },
      animation: {
        'pulse-slow': 'pulse 5s ease-in-out infinite',
        'fade-in': 'fadeIn 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(251, 191, 36, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
