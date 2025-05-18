import axios from 'axios';
import { Movie, MovieDetails, SearchResults, PersonSearchResults } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

// Get movie poster URL
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-poster.png'; // Placeholder image for missing posters
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Get backdrop URL
export const getBackdropUrl = (path: string | null, size: string = 'original'): string => {
  if (!path) return '/placeholder-backdrop.jpg'; // Placeholder image for missing backdrops
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Fetch movies by mood/category
export const fetchMoviesByCategory = async (category: string): Promise<Movie[]> => {
  try {
    let endpoint = '';
    let params = {};
    
    switch (category) {
      case 'feel-good':
        // Comedy and family movies with high ratings
        endpoint = '/discover/movie';
        params = {
          with_genres: '35,10751', // Comedy and family genres
          'vote_average.gte': 7,
          sort_by: 'popularity.desc',
        };
        break;
      case 'action-fix':
        // Action and adventure movies
        endpoint = '/discover/movie';
        params = {
          with_genres: '28,12', // Action and adventure genres
          sort_by: 'popularity.desc',
        };
        break;
      case 'mind-benders':
        // Thriller, mystery, sci-fi with high ratings
        endpoint = '/discover/movie';
        params = {
          with_genres: '53,9648,878', // Thriller, mystery, sci-fi genres
          'vote_average.gte': 7.5,
          sort_by: 'vote_average.desc',
        };
        break;
      default:
        endpoint = '/movie/popular';
    }

    const response = await api.get(endpoint, { params });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies by category:', error);
    throw error;
  }
};

// Search movies
export const searchMovies = async (query: string): Promise<SearchResults> => {
  try {
    const response = await api.get('/search/movie', {
      params: {
        query,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

// Search people/actors
export const searchPeople = async (query: string): Promise<PersonSearchResults> => {
  try {
    const response = await api.get('/search/person', {
      params: {
        query,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching people:', error);
    throw error;
  }
};

// Get movie details
export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  try {
    const response = await api.get(`/movie/${id}`, {
      params: {
        append_to_response: 'videos,credits,similar',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// Get popular movies (for landing page)
export const getPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await api.get('/movie/popular');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export default api;