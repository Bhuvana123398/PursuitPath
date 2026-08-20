// frontend/src/config.js
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://pursuitpath-api.onrender.com/api' 
  : 'http://localhost:5000/api';