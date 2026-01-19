// API Configuration
// Use VITE_API_URL if set, otherwise use production URL for production builds
// or localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' || import.meta.env.PROD
    ? 'https://cc-travels-backend.onrender.com' 
    : 'http://localhost:5000')

export const API_URL = API_BASE_URL

export default API_BASE_URL
