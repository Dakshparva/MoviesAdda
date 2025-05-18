import React from 'react';
import MovieCard from './MovieCard';
import { Movie } from '../types';

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
  error?: string | null;
  title?: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  isLoading = false, 
  error = null,
  title 
}) => {
  if (isLoading) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto px-4">
          {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[2/3] bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mt-2 w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mt-2 w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>Error: {error}</p>
            <p className="mt-2 text-sm">Please try again later or check your API configuration.</p>
          </div>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto px-4 text-center">
          {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
            <p>No movies found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <div className="container mx-auto px-4">
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieGrid;