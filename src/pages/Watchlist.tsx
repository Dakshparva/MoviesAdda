import React from 'react';
import { Link } from 'react-router-dom';
import { BookmarkX, Film } from 'lucide-react';
import { useWatchlist } from '../contexts/WatchlistContext';
import MovieGrid from '../components/MovieGrid';

const Watchlist: React.FC = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Watchlist</h1>
          
          {watchlist.length > 0 && (
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to clear your entire watchlist?')) {
                  watchlist.forEach(movie => removeFromWatchlist(movie.id));
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              <BookmarkX className="w-4 h-4" />
              <span>Clear Watchlist</span>
            </button>
          )}
        </div>
        
        {watchlist.length > 0 ? (
          <MovieGrid movies={watchlist} />
        ) : (
          <div className="text-center py-16">
            <Film className="mx-auto w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Your watchlist is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Save movies you want to watch later by clicking the bookmark icon
            </p>
            <Link 
              to="/" 
              className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Discover Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;