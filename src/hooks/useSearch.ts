import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { searchApi } from '@/lib/api'
import { debounce } from '@/lib/utils'

export const useSearch = (initialQuery: string = '') => {
  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)

  const debouncedSetQuery = debounce((value: string) => {
    setDebouncedQuery(value)
  }, 300)

  useEffect(() => {
    debouncedSetQuery(query)
  }, [query, debouncedSetQuery])

  const searchResults = useQuery(
    ['search', 'multi', debouncedQuery],
    () => searchApi.multi(debouncedQuery),
    {
      enabled: debouncedQuery.length >= 2,
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  return {
    query,
    setQuery,
    searchResults,
    isSearching: searchResults.isLoading,
    hasResults: searchResults.data?.results && searchResults.data.results.length > 0,
  }
}

export const useMovieSearch = (query: string, page: number = 1) => {
  return useQuery(
    ['search', 'movies', query, page],
    () => searchApi.movies(query, page),
    {
      enabled: query.length >= 2,
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  )
}

export const useTvSearch = (query: string, page: number = 1) => {
  return useQuery(
    ['search', 'tv', query, page],
    () => searchApi.tv(query, page),
    {
      enabled: query.length >= 2,
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  )
}

export const usePeopleSearch = (query: string, page: number = 1) => {
  return useQuery(
    ['search', 'people', query, page],
    () => searchApi.people(query, page),
    {
      enabled: query.length >= 2,
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  )
}