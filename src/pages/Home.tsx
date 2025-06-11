import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Film, Users, Star, Cog, Mail } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { usePopularMovies, useTrendingContent } from '@/hooks/useMovies'
import MovieCard from '@/components/features/MovieCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Button from '@/components/ui/Button'

const Home: React.FC = () => {
  const { data: popularMovies, isLoading: popularLoading } = usePopularMovies()
  const { data: trendingContent, isLoading: trendingLoading } = useTrendingContent()

  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [moviesRef, moviesInView] = useInView({ threshold: 0.1, triggerOnce: true })

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Recommendations',
      description: 'Our advanced algorithms learn your preferences to suggest films you\'ll love.',
      status: 'coming-soon'
    },
    {
      icon: Film,
      title: 'Extensive Movie Database',
      description: 'Access information on thousands of films, from classics to the latest releases.',
      status: 'active'
    },
    {
      icon: Users,
      title: 'Community Discussions',
      description: 'Join vibrant discussions and share your thoughts on your favorite movies.',
      status: 'coming-soon'
    },
    {
      icon: Star,
      title: 'Personalized Reviews',
      description: 'Rate and review movies to help others discover great content.',
      status: 'coming-soon'
    },
    {
      icon: Cog,
      title: 'Advanced Filters',
      description: 'Fine-tune your movie discovery with genre, year, rating, and more filters.',
      status: 'active'
    },
    {
      icon: Mail,
      title: 'Curated Updates',
      description: 'Stay informed with personalized newsletters featuring the latest in cinema.',
      status: 'coming-soon'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative hero-gradient min-h-screen flex items-center justify-center pt-16">
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
              Discover Your Next Cinematic Journey
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Personalized recommendations tailored to your unique taste in films.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" asChild>
                <Link to="/movies" className="flex items-center space-x-2">
                  <span>Start Exploring</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Why Choose CinemaScope?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of movie discovery with our cutting-edge features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="feature-card relative group"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  {feature.status === 'active' ? (
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  ) : (
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  )}
                </div>
                <feature.icon className="h-12 w-12 text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Movies Section */}
      <section ref={moviesRef} className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={moviesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Trending Now
            </h2>
            <p className="text-xl text-gray-400">
              Discover what everyone's watching this week
            </p>
          </motion.div>

          {trendingLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {trendingContent?.results.slice(0, 10).map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={moviesInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-12"
          >
            <Button size="lg" asChild>
              <Link to="/movies">View All Movies</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Popular Movies Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={moviesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Popular Movies
            </h2>
            <p className="text-xl text-gray-400">
              The most loved movies by our community
            </p>
          </motion.div>

          {popularLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {popularMovies?.results.slice(0, 10).map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                Join Our Cinematic Universe
              </h2>
              <p className="text-xl text-gray-300">
                Get the latest movie news, exclusive recommendations, and behind-the-scenes content
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-effect rounded-lg p-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-semibold mb-4 text-blue-300">
                    Lights, Camera, Subscribe!
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Be the first to know about new releases, exclusive content, and special offers.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="bg-blue-800 bg-opacity-50 p-3 rounded-lg">
                      <Film className="h-6 w-6 text-blue-300 mx-auto" />
                      <p className="text-sm text-gray-300 mt-2">Weekly Premieres</p>
                    </div>
                    <div className="bg-purple-800 bg-opacity-50 p-3 rounded-lg">
                      <Star className="h-6 w-6 text-purple-300 mx-auto" />
                      <p className="text-sm text-gray-300 mt-2">Exclusive Reviews</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 max-w-md">
                  <form className="space-y-4">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Button className="w-full" size="lg">
                      Start My Cinematic Journey
                    </Button>
                  </form>
                  <p className="text-gray-400 text-sm mt-4 text-center">
                    Your data is protected. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home