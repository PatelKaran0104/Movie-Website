import { useQuery } from 'react-query'
import { movieApi, tvApi, trendingApi, genreApi } from '@/lib/api'

export const usePopularMovies = (page: number = 1) => {
  return useQuery(
    ['movies', 'popular', page],
    () => movieApi.getPopular(page),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )
}

export const useTopRatedMovies = (page: number = 1) => {
  return useQuery(
    ['movies', 'top-rated', page],
    () => movieApi.getTopRated(page),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  )
}

export const useNowPlayingMovies = (page: number = 1) => {
  return useQuery(
    ['movies', 'now-playing', page],
    () => movieApi.getNowPlaying(page),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  )
}

export const useUpcomingMovies = (page: number = 1) => {
  return useQuery(
    ['movies', 'upcoming', page],
    () => movieApi.getUpcoming(page),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  )
}

export const useMovieDetails = (id: number) => {
  return useQuery(
    ['movie', 'details', id],
    () => movieApi.getDetails(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  )
}

export const useMovieCredits = (id: number) => {
  return useQuery(
    ['movie', 'credits', id],
    () => movieApi.getCredits(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
    }
  )
}

export const useMovieVideos = (id: number) => {
  return useQuery(
    ['movie', 'videos', id],
    () => movieApi.getVideos(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
    }
  )
}

export const useSimilarMovies = (id: number, page: number = 1) => {
  return useQuery(
    ['movie', 'similar', id, page],
    () => movieApi.getSimilar(id, page),
    {
      enabled: !!id,
      keepPreviousData: true,
      staleTime: 10 * 60 * 1000,
    }
  )
}

export const usePopularTvShows = (page: number = 1) => {
  return useQuery(
    ['tv', 'popular', page],
    () => tvApi.getPopular(page),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  )
}

export const useTvDetails = (id: number) => {
  return useQuery(
    ['tv', 'details', id],
    () => tvApi.getDetails(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
    }
  )
}

export const useTvCredits = (id: number) => {
  return useQuery(
    ['tv', 'credits', id],
    () => tvApi.getCredits(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
    }
  )
}

export const useTvVideos = (id: number) => {
  return useQuery(
    ['tv', 'videos', id],
    () => tvApi.getVideos(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
    }
  )
}

export const useTrendingContent = (timeWindow: 'day' | 'week' = 'week', page: number = 1) => {
  return useQuery(
    ['trending', 'all', timeWindow, page],
    () => trendingApi.getAll(timeWindow, page),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  )
}

export const useMovieGenres = () => {
  return useQuery(
    ['genres', 'movies'],
    () => genreApi.getMovieGenres(),
    {
      staleTime: 60 * 60 * 1000, // 1 hour
    }
  )
}

export const useTvGenres = () => {
  return useQuery(
    ['genres', 'tv'],
    () => genreApi.getTvGenres(),
    {
      staleTime: 60 * 60 * 1000, // 1 hour
    }
  )
}

export const useDiscoverMovies = (params: Record<string, any> = {}, page: number = 1) => {
  return useQuery(
    ['movies', 'discover', params, page],
    () => movieApi.discover({ ...params, page }),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  )
}

export const useDiscoverTv = (params: Record<string, any> = {}, page: number = 1) => {
  return useQuery(
    ['tv', 'discover', params, page],
    () => tvApi.discover({ ...params, page }),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  )
}