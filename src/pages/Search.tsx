import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMovies, searchPeople } from '../services/api';
import { Movie, Person } from '../types';
import MovieGrid from '../components/MovieGrid';
import { getImageUrl } from '../services/api';
import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';

const Search: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [isLoadingPeople, setIsLoadingPeople] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setMovies([]);
        setPeople([]);
        return;
      }

      try {
        setError(null);
        
        // Fetch movies
        setIsLoadingMovies(true);
        const movieResults = await searchMovies(query);
        setMovies(movieResults.results);
        setIsLoadingMovies(false);
        
        // Fetch people
        setIsLoadingPeople(true);
        const peopleResults = await searchPeople(query);
        setPeople(peopleResults.results);
        setIsLoadingPeople(false);
      } catch (err) {
        setError('An error occurred while searching. Please try again.');
        console.error(err);
        setIsLoadingMovies(false);
        setIsLoadingPeople(false);
      }
    };

    fetchResults();
  }, [query]);

  const isLoading = isLoadingMovies || isLoadingPeople;

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Showing results for movies and people
        </p>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* People Results */}
        {people.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">People</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {people.map((person) => (
                <div key={person.id} className="flex flex-col items-center">
                  <div className="rounded-full overflow-hidden w-24 h-24 mb-3">
                    <img
                      src={getImageUrl(person.profile_path, 'w185')}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-profile.png';
                      }}
                    />
                  </div>
                  <h3 className="text-center font-medium text-gray-900 dark:text-white">
                    {person.name}
                  </h3>
                  {person.known_for && person.known_for.length > 0 && (
                    <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Known for: {person.known_for[0]?.title || 'Unknown'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Movie Results */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Movies</h2>
          <MovieGrid 
            movies={movies} 
            isLoading={isLoadingMovies} 
            error={null}
          />
        </div>
        
        {/* No Results Message */}
        {!isLoading && movies.length === 0 && people.length === 0 && !error && (
          <div className="text-center py-12">
            <Film className="mx-auto w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't find any movies or people matching "{query}"
            </p>
            <Link 
              to="/" 
              className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;