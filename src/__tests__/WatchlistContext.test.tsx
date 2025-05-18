import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { WatchlistProvider, useWatchlist } from '../contexts/WatchlistContext';
import { Movie } from '../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Test component that uses the watchlist context
const TestComponent = () => {
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  return (
    <div>
      <div data-testid="watchlist-length">{watchlist.length}</div>
      <button 
        data-testid="add-button" 
        onClick={() => addToWatchlist(testMovie)}
      >
        Add
      </button>
      <button 
        data-testid="remove-button" 
        onClick={() => removeFromWatchlist(testMovie.id)}
      >
        Remove
      </button>
      <div data-testid="is-in-watchlist">
        {isInWatchlist(testMovie.id) ? 'true' : 'false'}
      </div>
    </div>
  );
};

// Test movie data
const testMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
  overview: 'This is a test movie',
  genre_ids: [28, 12],
};

describe('WatchlistContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('initializes with an empty watchlist when localStorage is empty', () => {
    const { getByTestId } = render(
      <WatchlistProvider>
        <TestComponent />
      </WatchlistProvider>
    );
    
    expect(getByTestId('watchlist-length').textContent).toBe('0');
    expect(getByTestId('is-in-watchlist').textContent).toBe('false');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('watchlist');
  });

  it('adds a movie to the watchlist', () => {
    const { getByTestId } = render(
      <WatchlistProvider>
        <TestComponent />
      </WatchlistProvider>
    );
    
    // Initially the watchlist is empty
    expect(getByTestId('watchlist-length').textContent).toBe('0');
    
    // Add a movie to the watchlist
    act(() => {
      getByTestId('add-button').click();
    });
    
    // Check that the movie was added
    expect(getByTestId('watchlist-length').textContent).toBe('1');
    expect(getByTestId('is-in-watchlist').textContent).toBe('true');
    
    // Check that localStorage was updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith('watchlist', expect.any(String));
    const savedWatchlist = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(savedWatchlist).toHaveLength(1);
    expect(savedWatchlist[0].id).toBe(testMovie.id);
  });

  it('removes a movie from the watchlist', () => {
    // Initialize with a movie in the watchlist
    localStorageMock.setItem('watchlist', JSON.stringify([testMovie]));
    
    const { getByTestId } = render(
      <WatchlistProvider>
        <TestComponent />
      </WatchlistProvider>
    );
    
    // Initially the watchlist has one movie
    expect(getByTestId('watchlist-length').textContent).toBe('1');
    expect(getByTestId('is-in-watchlist').textContent).toBe('true');
    
    // Remove the movie from the watchlist
    act(() => {
      getByTestId('remove-button').click();
    });
    
    // Check that the movie was removed
    expect(getByTestId('watchlist-length').textContent).toBe('0');
    expect(getByTestId('is-in-watchlist').textContent).toBe('false');
    
    // Check that localStorage was updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith('watchlist', expect.any(String));
    const savedWatchlist = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(savedWatchlist).toHaveLength(0);
  });

  it('does not add duplicate movies to the watchlist', () => {
    const { getByTestId } = render(
      <WatchlistProvider>
        <TestComponent />
      </WatchlistProvider>
    );
    
    // Add a movie to the watchlist twice
    act(() => {
      getByTestId('add-button').click();
      getByTestId('add-button').click();
    });
    
    // Check that the movie was only added once
    expect(getByTestId('watchlist-length').textContent).toBe('1');
  });
});