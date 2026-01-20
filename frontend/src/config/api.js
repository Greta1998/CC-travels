// API Configuration
// Use VITE_API_URL if set, otherwise use production URL for production builds
// or localhost for development
const getApiUrl = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Check if we're in development mode (running on localhost)
  // In production (static site), window.location will be the deployed domain
  const isDevelopment = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('localhost')
  )
  
  // Use localhost for development, production URL otherwise
  // Always use full URL (not relative) to avoid static site routing issues
  return isDevelopment 
    ? 'http://localhost:5000' 
    : 'https://cc-travels-backend.onrender.com'
}

const API_BASE_URL = getApiUrl()

// Log for debugging (remove in production if needed)
if (typeof window !== 'undefined') {
  console.log('API Base URL:', API_BASE_URL)
}

export const API_URL = API_BASE_URL

export default API_BASE_URL
