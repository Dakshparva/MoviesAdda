import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Heart, Brain } from 'lucide-react';
import { getPopularMovies, getBackdropUrl } from '../services/api';
import { Movie } from '../types';
import MovieGrid from '../components/MovieGrid';

const Home: React.FC = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const movies = await getPopularMovies();
        setPopularMovies(movies);
        
        // Select a random movie backdrop for the hero section
        if (movies.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(5, movies.length));
          const randomMovie = movies[randomIndex];
          setBackgroundImage(getBackdropUrl(randomMovie.backdrop_path));
        }
      } catch (err) {
        setError('Failed to fetch popular movies. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleCategoryClick = (category: string) => {
    navigate(`/category/${category}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-[80vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg animate-fade-in">
            What Should I Watch Tonight?
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-200 drop-shadow-md animate-fade-in-delay">
            Discover perfect movies for your mood. Find your next favorite film in just a few clicks.
          </p>
          
          {/* Mood Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto animate-slide-up">
            <button
              onClick={() => handleCategoryClick('feel-good')}
              className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Heart className="w-5 h-5" />
              <span>Feel Good</span>
            </button>
            
            <button
              onClick={() => handleCategoryClick('action-fix')}
              className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-red-600 to-orange-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Film className="w-5 h-5" />
              <span>Action Fix</span>
            </button>
            
            <button
              onClick={() => handleCategoryClick('mind-benders')}
              className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Brain className="w-5 h-5" />
              <span>Mind Benders</span>
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
      
      {/* Popular Movies Section */}
      <div className="bg-white dark:bg-gray-900 py-12">
        <MovieGrid 
          movies={popularMovies} 
          isLoading={isLoading} 
          error={error} 
          title="Popular Movies" 
        />
      </div>
    </div>
  );
};

export default Home;