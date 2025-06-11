import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Search, 
  Film, 
  Star, 
  Users, 
  Cog, 
  Mail, 
  Brain,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'

const HowItWorks: React.FC = () => {
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [techRef, techInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [designRef, designInView] = useInView({ threshold: 0.1, triggerOnce: true })

  const features = [
    {
      icon: Search,
      title: 'Intelligent Search',
      description: 'Discover movies, TV shows, and actors with our advanced search algorithm.',
      status: 'active'
    },
    {
      icon: Film,
      title: 'Personalized Recommendations',
      description: 'Get tailored movie suggestions based on your unique taste and viewing history.',
      status: 'active'
    },
    {
      icon: Star,
      title: 'Community Reviews',
      description: 'Rate, review, and explore opinions from fellow movie enthusiasts.',
      status: 'coming-soon'
    },
    {
      icon: Users,
      title: 'Vibrant Community',
      description: 'Join discussions, create watchlists, and connect with like-minded movie lovers.',
      status: 'coming-soon'
    },
    {
      icon: Cog,
      title: 'Advanced Filters',
      description: 'Fine-tune your movie discovery with genre, year, rating, and more advanced filters.',
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
    <div className="min-h-screen bg-gray-900 pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              How CinemaScope Works
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Discover the magic behind your personalized movie experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section ref={featuresRef} className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Key Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore the powerful features that make CinemaScope your ultimate movie companion
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
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-green-400">Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-xs text-yellow-400">Coming Soon</span>
                    </div>
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

      {/* Technology Stack */}
      <section ref={techRef} className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={techInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Our Technology Stack
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built with modern technologies for the best user experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={techInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="bg-gray-900 rounded-lg p-8 shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-6 text-white">API Integration</h3>
              <p className="text-gray-400 mb-6">
                We leverage the power of The Movie Database (TMDb) API to provide you
                with up-to-date and comprehensive movie information.
              </p>
              <div className="bg-gray-800 p-6 rounded-lg">
                <pre className="text-gray-300 text-sm overflow-x-auto">
                  <code>{`// Modern React with TypeScript
const { data: movies } = useQuery(
  ['movies', 'popular'],
  () => movieApi.getPopular(),
  { staleTime: 5 * 60 * 1000 }
)

// Zustand for state management
const useStore = create((set) => ({
  watchlist: [],
  addToWatchlist: (id) => 
    set((state) => ({
      watchlist: [...state.watchlist, id]
    }))
}))`}</code>
                </pre>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={techInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="bg-gray-900 rounded-lg p-8 shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-6 text-white">Modern Architecture</h3>
              <p className="text-gray-400 mb-6">
                Built with React, TypeScript, and modern development practices for
                maintainability and performance.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-gray-300">React 18 with TypeScript</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-300">Vite for fast development</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span className="text-gray-300">Tailwind CSS for styling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-gray-300">Framer Motion for animations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-gray-300">React Query for data fetching</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* User Experience Design */}
      <section ref={designRef} className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={designInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              User Experience Design
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Designed with user experience at the forefront
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={designInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="bg-gray-800 rounded-lg p-8 shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-6 text-white">Responsive Design</h3>
              <p className="text-gray-400 mb-6">
                Our interface adapts seamlessly to all devices, ensuring a consistent
                experience on desktop, tablet, and mobile.
              </p>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <Monitor className="h-12 w-12 text-primary-500 mx-auto mb-2" />
                  <span className="text-gray-300 text-sm">Desktop</span>
                </div>
                <div className="text-center">
                  <Tablet className="h-12 w-12 text-secondary-500 mx-auto mb-2" />
                  <span className="text-gray-300 text-sm">Tablet</span>
                </div>
                <div className="text-center">
                  <Smartphone className="h-12 w-12 text-accent-500 mx-auto mb-2" />
                  <span className="text-gray-300 text-sm">Mobile</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={designInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="bg-gray-800 rounded-lg p-8 shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-6 text-white">Intuitive Navigation</h3>
              <p className="text-gray-400 mb-6">
                We've designed our navigation to be simple and intuitive, helping you
                find what you need quickly and easily.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Search className="h-5 w-5 text-primary-500" />
                  <span className="text-gray-300">Smart search with instant results</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Cog className="h-5 w-5 text-secondary-500" />
                  <span className="text-gray-300">Advanced filtering options</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Brain className="h-5 w-5 text-accent-500" />
                  <span className="text-gray-300">Personalized recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-300">Social features (coming soon)</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of movie lovers who have already discovered their next favorite film
            </p>
            <motion.a
              href="/movies"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              <Film className="h-6 w-6" />
              <span>Explore Movies Now</span>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks