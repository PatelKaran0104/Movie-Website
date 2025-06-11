import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, Film, Search } from 'lucide-react'
import Button from '@/components/ui/Button'

const NotFound: React.FC = () => {
  const movieQuotes = [
    { quote: "I'm going to make him an offer he can't refuse.", movie: "The Godfather (1972)" },
    { quote: "May the Force be with you.", movie: "Star Wars (1977)" },
    { quote: "You talkin' to me?", movie: "Taxi Driver (1976)" },
    { quote: "E.T. phone home.", movie: "E.T. the Extra-Terrestrial (1982)" },
    { quote: "Here's looking at you, kid.", movie: "Casablanca (1942)" },
    { quote: "I see dead people.", movie: "The Sixth Sense (1999)" },
    { quote: "You had me at 'hello'.", movie: "Jerry Maguire (1996)" },
    { quote: "Show me the money!", movie: "Jerry Maguire (1996)" },
    { quote: "Nobody puts Baby in a corner.", movie: "Dirty Dancing (1987)" },
    { quote: "We're gonna need a bigger boat.", movie: "Jaws (1975)" },
  ]

  const randomQuote = movieQuotes[Math.floor(Math.random() * movieQuotes.length)]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center pt-16">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Film Icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="mb-8"
          >
            <Film className="h-24 w-24 text-primary-500 mx-auto" />
          </motion.div>

          {/* 404 Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient">
            404: Scene Not Found
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Oops! Looks like this reel has gone missing.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            
            <Button size="lg" asChild>
              <Link to="/" className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Return to Homepage</span>
              </Link>
            </Button>

            <Button variant="outline" size="lg" asChild>
              <Link to="/movies" className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Browse Movies</span>
              </Link>
            </Button>
          </div>

          {/* Movie Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-lg text-gray-400 mb-4">
              Here's a movie quote to brighten your day:
            </p>
            <blockquote className="text-xl md:text-2xl text-white italic mb-2">
              "{randomQuote.quote}"
            </blockquote>
            <p className="text-gray-400">
              - {randomQuote.movie}
            </p>
          </motion.div>

          {/* Additional Help */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12"
          >
            <p className="text-gray-400 mb-4">
              Don't worry, our film crew is on it! In the meantime, why not explore these options:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/movies"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                Movies
              </Link>
              <Link
                to="/how-it-works"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                How It Works
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound