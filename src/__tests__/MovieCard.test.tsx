import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { useWatchlist } from '../contexts/WatchlistContext';
import { Movie } from '../types';

// Mock the useWatchlist hook
vi.mock('../contexts/WatchlistContext', () => ({
  useWatchlist: vi.fn(),
}));

// Mock the API service
vi.mock('../services/api', () => ({
  getImageUrl: (path: string) => path || '/placeholder-poster.png',
}));

describe('MovieCard Component', () => {
  const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test-poster.jpg',
    backdrop_path: '/test-backdrop.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    overview: 'This is a test movie overview',
    genre_ids: [28, 12],
  };

  const mockAddToWatchlist = vi.fn();
  const mockRemoveFromWatchlist = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders movie card correctly', () => {
    // Mock the useWatchlist hook to return that the movie is not in the watchlist
    (useWatchlist as any).mockReturnValue({
      isInWatchlist: () => false,
      addToWatchlist: mockAddToWatchlist,
      removeFromWatchlist: mockRemoveFromWatchlist,
    });

    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    // Check that the poster image is rendered with the correct src
    const posterImage = screen.getByAltText('Test Movie poster');
    expect(posterImage).toBeInTheDocument();
    expect(posterImage.getAttribute('src')).toBe('/test-poster.jpg');

    // Check that the rating is displayed correctly
    expect(screen.getByText('8.5')).toBeInTheDocument();

    // Check that the release year is displayed correctly
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('adds movie to watchlist when bookmark button is clicked', () => {
    // Mock the useWatchlist hook to return that the movie is not in the watchlist
    (useWatchlist as any).mockReturnValue({
      isInWatchlist: () => false,
      addToWatchlist: mockAddToWatchlist,
      removeFromWatchlist: mockRemoveFromWatchlist,
    });

    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    // Find the bookmark button (uses aria-label)
    const bookmarkButton = screen.getByLabelText('Add to watchlist');
    expect(bookmarkButton).toBeInTheDocument();

    // Click the bookmark button
    fireEvent.click(bookmarkButton);

    // Check that addToWatchlist was called with the movie
    expect(mockAddToWatchlist).toHaveBeenCalledWith(mockMovie);
    expect(mockRemoveFromWatchlist).not.toHaveBeenCalled();
  });

  it('removes movie from watchlist when bookmark button is clicked', () => {
    // Mock the useWatchlist hook to return that the movie is in the watchlist
    (useWatchlist as any).mockReturnValue({
      isInWatchlist: () => true,
      addToWatchlist: mockAddToWatchlist,
      removeFromWatchlist: mockRemoveFromWatchlist,
    });

    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    // Find the bookmark button (uses aria-label)
    const bookmarkButton = screen.getByLabelText('Remove from watchlist');
    expect(bookmarkButton).toBeInTheDocument();

    // Click the bookmark button
    fireEvent.click(bookmarkButton);

    // Check that removeFromWatchlist was called with the movie id
    expect(mockRemoveFromWatchlist).toHaveBeenCalledWith(mockMovie.id);
    expect(mockAddToWatchlist).not.toHaveBeenCalled();
  });
});