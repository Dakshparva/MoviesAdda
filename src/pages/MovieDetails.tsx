import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, Star, Film, ArrowLeft, Bookmark, BookmarkCheck } from 'lucide-react';
import { getMovieDetails, getImageUrl, getBackdropUrl } from '../services/api';
import { MovieDetails as MovieDetailsType, Movie } from '../types';
import { useWatchlist } from '../contexts/WatchlistContext';
import MovieGrid from '../components/MovieGrid';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const movieId = parseInt(id, 10);
        const details = await getMovieDetails(movieId);
        setMovie(details);
        // Update page title
        document.title = `${details.title} | Movie Details`;
      } catch (err) {
        setError('Failed to fetch movie details. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
    
    // Reset trailer state when component unmounts or id changes
    return () => {
      setIsTrailerOpen(false);
      // Reset page title
      document.title = 'What Should I Watch Tonight | Movie Discovery';
    };
  }, [id]);

  const handleWatchlistToggle = () => {
    if (!movie) return;
    
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      // Create a Movie object from MovieDetails for watchlist
      const movieForWatchlist: Movie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        overview: movie.overview,
        genre_ids: movie.genres.map(genre => genre.id)
      };
      addToWatchlist(movieForWatchlist);
    }
  };

  // Format runtime from minutes to hours and minutes
  const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };
  
  // Get trailer video if available
  const getTrailer = () => {
    if (!movie?.videos?.results || movie.videos.results.length === 0) {
      return null;
    }
    
    // First look for official trailers
    const officialTrailer = movie.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube' && video.name.includes('Official')
    );
    
    // If no official trailer, get any trailer
    const anyTrailer = movie.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    // If no trailer, get any video
    const anyVideo = movie.videos.results.find(
      video => video.site === 'YouTube'
    );
    
    return officialTrailer || anyTrailer || anyVideo;
  };
  
  const trailer = movie ? getTrailer() : null;

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl mb-8"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              <div className="md:col-span-2 space-y-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="pt-20 min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error || 'Movie not found'}</p>
            <Link to="/" className="mt-4 inline-block text-red-600 hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const inWatchlist = isInWatchlist(movie.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Backdrop */}
      <div 
        className="relative h-[70vh] bg-black"
        style={{
          backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        
        {/* Back Button */}
        <div className="absolute top-20 left-4 z-10">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-white bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back</span>
          </button>
        </div>
        
        {/* Movie Basic Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end">
              <div className="hidden md:block rounded-lg overflow-hidden shadow-2xl w-48 border-4 border-white transform -translate-y-16">
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={`${movie.title} poster`}
                  className="w-full h-auto"
                />
              </div>
              
              <div className="md:ml-8 flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
                
                {movie.tagline && (
                  <p className="text-xl text-gray-300 mb-4 italic">"{movie.tagline}"</p>
                )}
                
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{releaseYear}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    <span>{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span 
                      key={genre.id}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {trailer && (
                    <button 
                      onClick={() => setIsTrailerOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Film className="w-4 h-4" />
                      <span>Watch Trailer</span>
                    </button>
                  )}
                  
                  <button 
                    onClick={handleWatchlistToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      inWatchlist 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-white hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {inWatchlist ? (
                      <>
                        <BookmarkCheck className="w-4 h-4" />
                        <span>In Watchlist</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" />
                        <span>Add to Watchlist</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Poster - Shown Only on Mobile */}
      <div className="md:hidden container mx-auto px-4 -mt-20 mb-6">
        <div className="rounded-lg overflow-hidden shadow-xl w-32 mx-auto border-4 border-white">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={`${movie.title} poster`}
            className="w-full h-auto"
          />
        </div>
      </div>
      
      {/* Movie Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overview Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Overview</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              {movie.overview || 'No overview available.'}
            </p>
            
            {/* Cast Section */}
            {movie.credits?.cast?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movie.credits.cast.slice(0, 10).map((person) => (
                    <div key={person.id} className="text-center">
                      <div className="rounded-lg overflow-hidden mb-2">
                        <img
                          src={getImageUrl(person.profile_path, 'w185')}
                          alt={person.name}
                          className="w-full h-auto"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-profile.png';
                          }}
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">{person.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Details Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Details</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Status</h3>
                  <p className="font-medium text-gray-900 dark:text-white">Released</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Release Date</h3>
                  <p className="font-medium text-gray-900 dark:text-white">{movie.release_date || 'Unknown'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Runtime</h3>
                  <p className="font-medium text-gray-900 dark:text-white">{formatRuntime(movie.runtime)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Rating</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="font-medium text-gray-900 dark:text-white">{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                </div>
                
                {movie.credits?.crew?.length > 0 && (
                  <div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Director</h3>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {movie.credits.crew.find(person => person.job === 'Director')?.name || 'Unknown'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Movies */}
        {movie.similar?.results?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Similar Movies</h2>
            <MovieGrid movies={movie.similar.results.slice(0, 10)} />
          </div>
        )}
      </div>
      
      {/* Trailer Modal */}
      {isTrailerOpen && trailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setIsTrailerOpen(false)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setIsTrailerOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;