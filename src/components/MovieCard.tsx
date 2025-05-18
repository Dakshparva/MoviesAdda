import React from 'react';
import { Link } from 'react-router-dom';
import { Star, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { Movie } from '../types';
import { getImageUrl } from '../services/api';
import { useWatchlist } from '../contexts/WatchlistContext';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the bookmark
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  // Extract year from release date
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  
  // Format rating to one decimal place
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <Link 
      to={`/movie/${movie.id}`} 
      className="group relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl bg-white dark:bg-gray-800"
    >
      <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={`${movie.title} poster`}
          className="h-full w-full object-cover transition-opacity duration-300"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-poster.png';
          }}
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <h3 className="font-bold text-lg line-clamp-2">{movie.title}</h3>
      </div>
      
      <div className="absolute top-2 right-2 flex gap-2">
        <button 
          onClick={handleWatchlistToggle}
          className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors duration-200"
          aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        >
          {inWatchlist ? (
            <BookmarkCheck size={18} className="text-emerald-400" />
          ) : (
            <BookmarkPlus size={18} />
          )}
        </button>
      </div>
      
      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 text-white text-xs font-medium">
        <Star size={14} className="text-yellow-400" />
        <span>{rating}</span>
      </div>
      
      <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/60 text-white text-xs font-medium">
        {releaseYear}
      </div>
    </Link>
  );
};

export default MovieCard;