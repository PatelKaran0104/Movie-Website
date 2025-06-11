import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, Grid, List } from 'lucide-react'
import { usePopularMovies, useDiscoverMovies, useMovieGenres } from '@/hooks/useMovies'
import { useMovieSearch } from '@/hooks/useSearch'
import MovieCard from '@/components/features/MovieCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Button from '@/components/ui/Button'

const Movies: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Get URL parameters
  const searchQuery = searchParams.get('search') || ''
  const genreFilter = searchParams.get('genre') || ''
  const sortBy = searchParams.get('sort') || 'popularity.desc'

  // Hooks
  const { data: genres } = useMovieGenres()
  const { data: searchResults, isLoading: searchLoading } = useMovieSearch(searchQuery, page)
  const { data: discoverResults, isLoading: discoverLoading } = useDiscoverMovies(
    genreFilter ? { with_genres: genreFilter, sort_by: sortBy } : { sort_by: sortBy },
    page
  )
  const { data: popularResults, isLoading: popularLoading } = usePopularMovies(page)

  // Determine which data to use
  const isSearchMode = searchQuery.length > 0
  const isFilterMode = genreFilter.length > 0
  
  let currentData, isLoading, title

  if (isSearchMode) {
    currentData = searchResults
    isLoading = searchLoading
    title = `Search Results for "${searchQuery}"`
  } else if (isFilterMode) {
    currentData = discoverResults
    isLoading = discoverLoading
    const selectedGenre = genres?.genres.find(g => g.id.toString() === genreFilter)
    title = selectedGenre ? `${selectedGenre.name} Movies` : 'Filtered Movies'
  } else {
    currentData = popularResults
    isLoading = popularLoading
    title = 'Popular Movies'
  }

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, genreFilter, sortBy])

  const handleGenreChange = (genreId: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (genreId) {
      newParams.set('genre', genreId)
    } else {
      newParams.delete('genre')
    }
    newParams.delete('search') // Clear search when filtering by genre
    setSearchParams(newParams)
  }

  const handleSortChange = (sort: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('sort', sort)
    setSearchParams(newParams)
  }

  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  const sortOptions = [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'release_date.desc', label: 'Newest First' },
    { value: 'release_date.asc', label: 'Oldest First' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'title.asc', label: 'A-Z' },
    { value: 'title.desc', label: 'Z-A' },
  ]

  return (
    <div className="min-h-screen pt-20 bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4 lg:mb-0"
          >
            {title}
          </motion.h1>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-400'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-400'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 rounded-lg p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Genre
                </label>
                <select
                  value={genreFilter}
                  onChange={(e) => handleGenreChange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Genres</option>
                  {genres?.genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchParams({})
                    setPage(1)
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {isLoading && page === 1 ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : currentData?.results.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-400 mb-4">
              No movies found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                  : 'space-y-4'
              }
            >
              {currentData?.results.map((movie, index) => (
                <MovieCard key={`${movie.id}-${page}`} movie={movie} index={index} />
              ))}
            </motion.div>

            {/* Load More */}
            {currentData && page < currentData.total_pages && (
              <div className="text-center mt-12">
                <Button
                  onClick={loadMore}
                  isLoading={isLoading}
                  size="lg"
                >
                  Load More Movies
                </Button>
              </div>
            )}

            {/* Results Info */}
            {currentData && (
              <div className="text-center mt-8 text-gray-400">
                Showing {currentData.results.length * page} of {currentData.total_results} results
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Movies