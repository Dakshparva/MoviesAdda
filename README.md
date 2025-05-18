# What Should I Watch Tonight - Movie Discovery App

A responsive and elegant movie discovery web application built with React, TypeScript, and Tailwind CSS. This application helps users explore movies based on their mood, search for movies and actors, and manage a personal watchlist.

## Features

- 🎬 Browse movies by mood categories: Feel Good, Action Fix, and Mind Benders
- 🔍 Search for movies and actors with comprehensive results
- 📋 View detailed movie information including cast, trailers, and similar movies
- 📱 Responsive design that works on mobile, tablet, and desktop devices
- 📑 Watchlist functionality using localStorage to save movies for later viewing
- 🎬 Embedded YouTube trailers on movie detail pages

## Getting Started

### Prerequisites

- Node.js (version 16 or later)
- npm or yarn
- TMDB API Key

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd what-should-i-watch-tonight
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure TMDB API Key:
   - Create an account on [The Movie Database (TMDB)](https://www.themoviedb.org/)
   - Generate an API key from your account settings
   - Create a `.env` file in the root directory by copying `.env.example`
   - Replace `your-tmdb-api-key-here` with your actual TMDB API key in the `.env` file:
     ```
     VITE_TMDB_API_KEY=your-tmdb-api-key-here
     ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to [http://localhost:5173](http://localhost:5173)

## Testing

The application includes unit tests for components and functionality:

```
npm run test
```

## Building for Production

To build the app for production:

```
npm run build
```

This generates optimized production files in the `dist` directory.

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components representing different routes
- `/src/services` - API services and utilities
- `/src/contexts` - React contexts for state management
- `/src/types` - TypeScript type definitions
- `/src/__tests__` - Unit tests

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Vite
- Vitest for testing
- React Router
- Axios for API requests
- Lucide React for icons

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB. All movie data and images are provided by The Movie Database.