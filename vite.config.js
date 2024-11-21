export default defineConfig({
  server: {
    proxy: {
      '/bfhl': 'http://localhost:5000', // Replace with your backend URL
    },
  },
});
