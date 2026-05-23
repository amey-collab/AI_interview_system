export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 40px rgba(125, 101, 255, 0.18)',
      },
      backgroundImage: {
        glass: 'radial-gradient(circle at top, rgba(125, 101, 255, 0.24), transparent 42%), radial-gradient(circle at 80% 10%, rgba(12, 140, 255, 0.14), transparent 28%)',
      },
    },
  },
  plugins: [],
};
