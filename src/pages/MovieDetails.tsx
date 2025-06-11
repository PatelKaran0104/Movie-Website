import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Play, 
  Star, 
  Calendar, 
  Clock, 
  Heart, 
  Share2, 
  ArrowLeft,
  ExternalLink,
  User
} from 'lucide-react'
import { useMovieDetails, useMovieCredits, useMovieVideos, useSimilarMovies } from '@/hooks/useMovies'
import { useTvDetails, useTvCredits, useTvVideos } from '@/hooks/useMovies'
import { getImageUrl, getBackdropUrl } from '@/lib/api'
import { formatDate, formatRuntime, formatRating, getYouTubeUrl, getStreamingUrl } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import MovieCard from '@/components/features/MovieCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const movieId = parseInt(id || '0')
  const isTV = location.pathname.includes('/tv/')
  
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [selectedTrailer, setSelectedTrailer] = useState<string>('')

  const { addToRecentlyViewed, isInWatchlist, addToWatchlist, removeFromWatchlist } = useStore()

  // Use appropriate hooks based on media type
  const { data: movieDetails, isLoading: detailsLoading } = isTV 
    ? useTvDetails(movieId) 
    : useMovieDetails(movieId)
  
  const { data: credits, isLoading: creditsLoading } = isTV 
    ? useTvCredits(movieId) 
    : useMovieCredits(movieId)
  
  const { data: videos } = isTV 
    ? useTvVideos(movieId) 
    : useMovieVideos(movieId)
  
  const { data: similarContent } = useSimilarMovies(movieId)

  React.useEffect(() => {
    if (movieId) {
      addToRecentlyViewed(movieId)
    }
  }, [movieId, addToRecentlyViewed])

  if (detailsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!movieDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Content not found</h2>
          <Link to="/movies">
            <Button>Back to Movies</Button>
          </Link>
        </div>
      </div>
    )
  }

  const title = movieDetails.title || movieDetails.name || 'Unknown Title'
  const releaseDate = movieDetails.release_date || movieDetails.first_air_date
  const trailer = videos?.results.find(video => video.type === 'Trailer' && video.site === 'YouTube')
  const isInList = isInWatchlist(movieId)

  const handleWatchlistToggle = () => {
    if (isInList) {
      removeFromWatchlist(movieId)
    } else {
      addToWatchlist(movieId)
    }
  }

  const handleTrailerClick = () => {
    if (trailer) {
      setSelectedTrailer(trailer.key)
      setIsTrailerOpen(true)
    }
  }

  const handleWatchClick = () => {
    setIsPlayerOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative">
        {/* Backdrop */}
        {movieDetails.backdrop_path && (
          <div className="absolute inset-0">
            <img
              src={getBackdropUrl(movieDetails.backdrop_path)}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
          </div>
        )}

        <div className="relative z-10 pt-20 pb-16">
          <div className="container mx-auto px-4">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Link
                to="/movies"
                className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Movies</span>
              </Link>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0"
              >
                <div className="w-80 max-w-full mx-auto lg:mx-0">
                  {movieDetails.poster_path ? (
                    <img
                      src={getImageUrl(movieDetails.poster_path, 'w500')}
                      alt={title}
                      className="w-full rounded-lg shadow-2xl"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-6xl">🎬</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1"
              >
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                  {title}
                </h1>

                {movieDetails.tagline && (
                  <p className="text-xl text-gray-300 italic mb-6">
                    "{movieDetails.tagline}"
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-300">
                  {movieDetails.vote_average > 0 && (
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">
                        {formatRating(movieDetails.vote_average)}
                      </span>
                      <span className="text-gray-400">
                        ({movieDetails.vote_count} votes)
                      </span>
                    </div>
                  )}

                  {releaseDate && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>{formatDate(releaseDate)}</span>
                    </div>
                  )}

                  {movieDetails.runtime && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>{formatRuntime(movieDetails.runtime)}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movieDetails.genres && movieDetails.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {movieDetails.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Overview */}
                {movieDetails.overview && (
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    {movieDetails.overview}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" onClick={handleWatchClick}>
                    <Play className="h-5 w-5 mr-2" />
                    Watch {isTV ? 'Show' : 'Movie'}
                  </Button>

                  {trailer && (
                    <Button variant="outline" size="lg" onClick={handleTrailerClick}>
                      <Play className="h-5 w-5 mr-2" />
                      Watch Trailer
                    </Button>
                  )}

                  <Button
                    variant={isInList ? 'secondary' : 'outline'}
                    size="lg"
                    onClick={handleWatchlistToggle}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isInList ? 'fill-current' : ''}`} />
                    {isInList ? 'In Watchlist' : 'Add to Watchlist'}
                  </Button>

                  <Button variant="ghost" size="lg">
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {credits && credits.cast.length > 0 && (
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {credits.cast.slice(0, 12).map((actor) => (
                <motion.div
                  key={actor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="aspect-[2/3] mb-3 rounded-lg overflow-hidden bg-gray-700">
                    {actor.profile_path ? (
                      <img
                        src={getImageUrl(actor.profile_path, 'w185')}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">
                    {actor.name}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {actor.character}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Similar Content */}
      {similarContent && similarContent.results.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8">
              Similar {isTV ? 'Shows' : 'Movies'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {similarContent.results.slice(0, 10).map((item, index) => (
                <MovieCard key={item.id} movie={item} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trailer Modal */}
      <Modal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        title="Trailer"
        size="xl"
      >
        {selectedTrailer && (
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${selectedTrailer}?autoplay=1`}
              title="Movie Trailer"
              className="w-full h-full rounded-lg"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>
        )}
      </Modal>

      {/* Player Modal */}
      <Modal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        title={`Watch ${title}`}
        size="xl"
      >
        <div className="aspect-video">
          <iframe
            src={getStreamingUrl(movieId, isTV ? 'tv' : 'movie')}
            title={`Watch ${title}`}
            className="w-full h-full rounded-lg"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            If the video doesn't load, try refreshing the page or check your internet connection.
          </p>
        </div>
      </Modal>
    </div>
  )
}

export default MovieDetails