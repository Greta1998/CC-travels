# CC Travels - Travel Agency Website

A modern travel agency website built with React and Node.js.

## Features

- 🎨 Modern and responsive design
- 🧭 Navigation bar with logo and menu links
- ⚡ Fast development with Vite
- 🔄 React Router for navigation
- 🚀 Express.js backend API

## Project Structure

```
CC-travels/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── ...
│   └── package.json
├── backend/           # Node.js backend server
│   ├── server.js
│   └── package.json
└── package.json       # Root package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install all dependencies** (root, frontend, and backend):
   ```bash
   npm run install-all
   ```

   Or install manually:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Set up environment variables** (optional):
   ```bash
   cd backend
   cp .env.example .env
   ```
   Edit `.env` if needed (default PORT is 5000).

### Running the Application

**Option 1: Run both frontend and backend together**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run client
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Navigation Links

The navbar includes the following links:
- Home
- About us
- Flight booking
- Services
- Contact us
- Travel deals

## Technologies Used

### Frontend
- React 18
- React Router DOM
- Vite
- CSS3

### Backend
- Node.js
- Express.js
- CORS
- dotenv

## Development

- Frontend runs on port 3000
- Backend runs on port 5000
- Vite proxy is configured to forward `/api` requests to the backend

## Next Steps

- Add more pages and content
- Implement flight booking functionality
- Add database integration
- Create API endpoints for services
- Add authentication if needed
- Enhance UI/UX with more components

## License

ISC
