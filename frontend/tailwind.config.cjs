module.exports = {
  content: ['./src/**/*.{html,ts}', './src/**/**/*.{html,ts,css}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-light': 'var(--color-primary-light)'
      }
    },
  },
  plugins: [],
};
