// frontend/src/config.js
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://pursuitpath-api-xxxx.onrender.com/api'  // Replace with YOUR Render URL
  : 'http://localhost:5000/api';