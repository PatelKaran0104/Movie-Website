import axios from 'axios'
import type { Movie, MovieDetails, Credits, Video, Genre, ApiResponse, Person } from '@/types/movie'

const API_KEY = 'd0bfb3db92119f434f15921720533c9f'
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
})

// Image utilities
export const getImageUrl = (path: string | null, size: string = 'w500') => {
  if (!path) return null
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export const getBackdropUrl = (path: string | null, size: string = 'w1280') => {
  if (!path) return null
  return `${IMAGE_BASE_URL}/${size}${path}`
}

// API functions
export const movieApi = {
  // Popular movies
  getPopular: (page: number = 1): Promise<ApiResponse<Movie>> =>
    api.get('/movie/popular', { params: { page } }).then(res => res.data),

  // Top rated movies
  getTopRated: (page: number = 1): Promise<ApiResponse<Movie>> =>
    api.get('/movie/top_rated', { params: { page } }).then(res => res.data),

  // Now playing movies
  getNowPlaying: (page: number = 1): Promise<ApiResponse<Movie>> =>
    api.get('/movie/now_playing', { params: { page } }).then(res => res.data),

  // Upcoming movies
  getUpcoming: (page: number = 1): Promise<ApiResponse<Movie>> =>
    api.get('/movie/upcoming', { params: { page } }).then(res => res.data),

  // Movie details
  getDetails: (id: number): Promise<MovieDetails> =>
    api.get(`/movie/${id}`).then(res => res.data),

  // Movie credits
  getCredits: (id: number): Promise<Credits> =>
    api.get(`/movie/${id}/credits`).then(res => res.data),

  // Movie videos
  getVideos: (id: number): Promise<{ results: Video[] }> =>
    api.get(`/movie/${id}/videos`).then(res => res.data),

  // Similar movies
  getSimilar: (id: number, page: number = 1): Promise<ApiResponse<Movie>> =>
    api.get(`/movie/${id}/similar`, { params: { page } }).then(res => res.data),

  // Recommended movies
  getRecommendations: (id: number, page: number = 1): Promise<ApiResponse<Movie>> =>
    api.get(`/movie/${id}/recommendations`, { params: { page } }).then(res => res.data),

  // Discover movies
  discover: (params: Record<string, any> = {}): Promise<ApiResponse<Movie>> =>
    api.get('/discover/movie', { params }).then(res => res.data),
}

export const tvApi = {
  // Popular TV shows
  getPopular: (page: number = 1): Promise<ApiResponse<Movie>> =>
    api.get('/tv/popular', { params: { page } }).then(res => res.data),

  // Top rated TV shows
  getTopRated: (page: number = 1): Promise<ApiResponse<Movie>> =>
    api.get('/tv/top_rated', { params: { page } }).then(res => res.data),

  // TV show details
  getDetails: (id: number): Promise<MovieDetails> =>
    api.get(`/tv/${id}`).then(res => res.data),

  // TV show credits
  getCredits: (id: number): Promise<Credits> =>
    api.get(`/tv/${id}/credits`).then(res => res.data),

  // TV show videos
  getVideos: (id: number): Promise<{ results: Video[] }> =>
    api.get(`/tv/${id}/videos`).then(res => res.data),

  // Similar TV shows
  getSimilar: (id: number, page: number = 1): Promise<ApiResponse<Movie>> =>
    api.get(`/tv/${id}/similar`, { params: { page } }).then(res => res.data),

  // Recommended TV shows
  getRecommendations: (id: number, page: number = 1): Promise<ApiResponse<Movie>> =>
    api.get(`/tv/${id}/recommendations`, { params: { page } }).then(res => res.data),

  // Discover TV shows
  discover: (params: Record<string, any> = {}): Promise<ApiResponse<Movie>> =>
    api.get('/discover/tv', { params }).then(res => res.data),
}

export const searchApi = {
  // Multi search
  multi: (query: string, page: number = 1): Promise<ApiResponse<Movie | Person>> =>
    api.get('/search/multi', { params: { query, page } }).then(res => res.data),

  // Search movies
  movies: (query: string, page: number = 1): Promise<ApiResponse<Movie>> =>
    api.get('/search/movie', { params: { query, page } }).then(res => res.data),

  // Search TV shows
  tv: (query: string, page: number = 1): Promise<ApiResponse<Movie>> =>
    api.get('/search/tv', { params: { query, page } }).then(res => res.data),

  // Search people
  people: (query: string, page: number = 1): Promise<ApiResponse<Person>> =>
    api.get('/search/person', { params: { query, page } }).then(res => res.data),
}

export const genreApi = {
  // Movie genres
  getMovieGenres: (): Promise<{ genres: Genre[] }> =>
    api.get('/genre/movie/list').then(res => res.data),

  // TV genres
  getTvGenres: (): Promise<{ genres: Genre[] }> =>
    api.get('/genre/tv/list').then(res => res.data),
}

export const personApi = {
  // Person details
  getDetails: (id: number): Promise<Person> =>
    api.get(`/person/${id}`).then(res => res.data),

  // Person movie credits
  getMovieCredits: (id: number): Promise<{ cast: Movie[], crew: Movie[] }> =>
    api.get(`/person/${id}/movie_credits`).then(res => res.data),

  // Person TV credits
  getTvCredits: (id: number): Promise<{ cast: Movie[], crew: Movie[] }> =>
    api.get(`/person/${id}/tv_credits`).then(res => res.data),
}

export const trendingApi = {
  // Trending movies/TV shows
  getAll: (timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<ApiResponse<Movie>> =>
    api.get(`/trending/all/${timeWindow}`, { params: { page } }).then(res => res.data),

  // Trending movies
  getMovies: (timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<ApiResponse<Movie>> =>
    api.get(`/trending/movie/${timeWindow}`, { params: { page } }).then(res => res.data),

  // Trending TV shows
  getTv: (timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<ApiResponse<Movie>> =>
    api.get(`/trending/tv/${timeWindow}`, { params: { page } }).then(res => res.data),
}