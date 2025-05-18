import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMoviesByCategory } from '../services/api';
import { Movie } from '../types';
import MovieGrid from '../components/MovieGrid';

const categoryNames: Record<string, string> = {
  'feel-good': 'Feel Good Movies',
  'action-fix': 'Action Movies',
  'mind-benders': 'Mind Bending Thrillers',
};

const Category: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchMoviesByCategory(id);
        setMovies(data);
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [id]);

  const categoryTitle = id ? categoryNames[id] || 'Movies' : 'Movies';

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{categoryTitle}</h1>
        
        <MovieGrid 
          movies={movies} 
          isLoading={isLoading} 
          error={error}
        />
      </div>
    </div>
  );
};

export default Category;