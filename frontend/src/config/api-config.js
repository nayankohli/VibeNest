const API_CONFIG = {
    // Base URL for your backend
    BASE_URL: process.env.NODE_ENV === 'production'
      ? 'https://vibenest-api.onrender.com'
      : 'http://localhost:5000'
  };

  export default API_CONFIG;