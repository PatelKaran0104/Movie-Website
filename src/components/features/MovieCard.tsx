import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, Calendar, Heart } from 'lucide-react'
import { getImageUrl } from '@/lib/api'
import { formatDate, formatRating, truncateText } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import type { Movie } from '@/types/movie'

interface MovieCardProps {
  movie: Movie
  index?: number
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index = 0 }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useStore()
  const isInList = isInWatchlist(movie.id)

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInList) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie.id)
    }
  }

  const movieTitle = movie.title || movie.name || 'Unknown Title'
  const releaseDate = movie.release_date || movie.first_air_date
  const mediaType = movie.media_type || 'movie'
  const linkPath = mediaType === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="movie-card group"
    >
      <Link to={linkPath} className="block">
        {/* Poster Container */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
          {movie.poster_path ? (
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movieTitle}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-4xl">🎬</span>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="bg-primary-600 text-white px-4 py-2 rounded-full font-medium">
                Watch {mediaType === 'tv' ? 'Show' : 'Movie'}
              </div>
            </motion.div>
          </div>

          {/* Rating Badge */}
          {movie.vote_average > 0 && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-yellow-400 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
              <Star className="h-3 w-3 fill-current" />
              <span>{formatRating(movie.vote_average)}</span>
            </div>
          )}

          {/* Watchlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWatchlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
              isInList
                ? 'bg-red-500 text-white'
                : 'bg-black bg-opacity-50 text-white hover:bg-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isInList ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
            {truncateText(movieTitle, 40)}
          </h3>
          
          {releaseDate && (
            <div className="flex items-center text-gray-400 text-sm mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(releaseDate)}</span>
            </div>
          )}

          {movie.overview && (
            <p className="text-gray-400 text-sm line-clamp-3">
              {truncateText(movie.overview, 100)}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default MovieCard