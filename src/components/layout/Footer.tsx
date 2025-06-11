import React from 'react'
import { Link } from 'react-router-dom'
import { Film, Facebook, Twitter, Instagram, Github, Linkedin, Mail } from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 border-t border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Film className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-bold text-white">CinemaScope</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your personal movie guide, helping you discover new movies, join discussions, and
              keep up with the latest news in the world of cinema.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Popular Genres</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/movies?genre=28" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Action
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=18" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Drama
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=35" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Comedy
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=878" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Sci-Fi
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">
                Built with ❤️ by <span className="text-white font-medium">Karan Patel</span>
              </p>
              <div className="flex space-x-3">
                <a
                  href="https://github.com/PatelKaran0104"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/patelkaran0104"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="mailto:khpatel0104@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} CinemaScope. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer