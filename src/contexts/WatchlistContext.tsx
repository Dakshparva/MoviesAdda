import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '../types';

interface WatchlistContextType {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

interface WatchlistProviderProps {
  children: ReactNode;
}

export const WatchlistProvider: React.FC<WatchlistProviderProps> = ({ children }) => {
  // Initialize state from localStorage if available
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });

  // Update localStorage when watchlist changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (movie: Movie) => {
    setWatchlist((prevWatchlist) => {
      // Check if movie already exists in watchlist
      if (!prevWatchlist.some((item) => item.id === movie.id)) {
        return [...prevWatchlist, movie];
      }
      return prevWatchlist;
    });
  };

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist((prevWatchlist) => 
      prevWatchlist.filter((movie) => movie.id !== movieId)
    );
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some((movie) => movie.id === movieId);
  };

  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};