import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Film, Tv, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '@/hooks/useSearch'
import { getImageUrl } from '@/lib/api'
import { truncateText } from '@/lib/utils'
import type { Movie, Person } from '@/types/movie'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const { query, setQuery, searchResults, isSearching } = useSearch()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleResultClick = (item: Movie | Person) => {
    if ('media_type' in item) {
      if (item.media_type === 'movie') {
        navigate(`/movie/${item.id}`)
      } else if (item.media_type === 'tv') {
        navigate(`/tv/${item.id}`)
      } else if (item.media_type === 'person') {
        // Handle person navigation if needed
        console.log('Person clicked:', item)
      }
    } else {
      // Default to movie if no media_type
      navigate(`/movie/${item.id}`)
    }
    onClose()
    setQuery('')
  }

  const getItemIcon = (item: Movie | Person) => {
    if ('media_type' in item) {
      switch (item.media_type) {
        case 'movie':
          return <Film className="h-4 w-4 text-primary-400" />
        case 'tv':
          return <Tv className="h-4 w-4 text-secondary-400" />
        case 'person':
          return <User className="h-4 w-4 text-accent-400" />
        default:
          return <Film className="h-4 w-4 text-primary-400" />
      }
    }
    return <Film className="h-4 w-4 text-primary-400" />
  }

  const getItemTitle = (item: Movie | Person) => {
    if ('name' in item && item.name) {
      return item.name
    }
    if ('title' in item && item.title) {
      return item.title
    }
    return 'Unknown'
  }

  const getItemSubtitle = (item: Movie | Person) => {
    if ('media_type' in item) {
      switch (item.media_type) {
        case 'movie':
          return `Movie ${item.release_date ? `(${item.release_date.split('-')[0]})` : ''}`
        case 'tv':
          return `TV Show ${item.first_air_date ? `(${item.first_air_date.split('-')[0]})` : ''}`
        case 'person':
          return 'Person'
        default:
          return 'Movie'
      }
    }
    return 'Movie'
  }

  const getItemImage = (item: Movie | Person) => {
    if ('profile_path' in item) {
      return getImageUrl(item.profile_path, 'w92')
    }
    if ('poster_path' in item) {
      return getImageUrl(item.poster_path, 'w92')
    }
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows, actors..."
            className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          )}

          {!isSearching && query.length >= 2 && searchResults.data?.results && (
            <AnimatePresence>
              {searchResults.data.results.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 text-gray-400"
                >
                  No results found for "{query}"
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {searchResults.data.results.slice(0, 8).map((item) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                      onClick={() => handleResultClick(item)}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors"
                    >
                      {/* Image */}
                      <div className="flex-shrink-0 w-12 h-16 bg-gray-600 rounded overflow-hidden">
                        {getItemImage(item) ? (
                          <img
                            src={getItemImage(item)!}
                            alt={getItemTitle(item)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getItemIcon(item)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">
                          {truncateText(getItemTitle(item), 50)}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {getItemSubtitle(item)}
                        </p>
                        {item.overview && (
                          <p className="text-gray-500 text-xs mt-1">
                            {truncateText(item.overview, 80)}
                          </p>
                        )}
                      </div>

                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {getItemIcon(item)}
                      </div>
                    </motion.button>
                  ))}

                  {searchResults.data.results.length > 8 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => {
                        navigate(`/movies?search=${encodeURIComponent(query)}`)
                        onClose()
                        setQuery('')
                      }}
                      className="w-full p-3 text-center text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      View all {searchResults.data.total_results} results
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {query.length > 0 && query.length < 2 && (
            <div className="text-center py-8 text-gray-400">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default SearchBar