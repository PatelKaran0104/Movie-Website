import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // UI State
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  
  // User preferences
  favoriteGenres: number[]
  addFavoriteGenre: (genreId: number) => void
  removeFavoriteGenre: (genreId: number) => void
  
  // Watchlist
  watchlist: number[]
  addToWatchlist: (movieId: number) => void
  removeFromWatchlist: (movieId: number) => void
  isInWatchlist: (movieId: number) => boolean
  
  // Recently viewed
  recentlyViewed: number[]
  addToRecentlyViewed: (movieId: number) => void
  
  // Search history
  searchHistory: string[]
  addToSearchHistory: (query: string) => void
  clearSearchHistory: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // UI State
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      
      // User preferences
      favoriteGenres: [],
      addFavoriteGenre: (genreId) =>
        set((state) => ({
          favoriteGenres: [...state.favoriteGenres, genreId],
        })),
      removeFavoriteGenre: (genreId) =>
        set((state) => ({
          favoriteGenres: state.favoriteGenres.filter((id) => id !== genreId),
        })),
      
      // Watchlist
      watchlist: [],
      addToWatchlist: (movieId) =>
        set((state) => ({
          watchlist: [...state.watchlist, movieId],
        })),
      removeFromWatchlist: (movieId) =>
        set((state) => ({
          watchlist: state.watchlist.filter((id) => id !== movieId),
        })),
      isInWatchlist: (movieId) => get().watchlist.includes(movieId),
      
      // Recently viewed
      recentlyViewed: [],
      addToRecentlyViewed: (movieId) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((id) => id !== movieId)
          return {
            recentlyViewed: [movieId, ...filtered].slice(0, 20), // Keep last 20
          }
        }),
      
      // Search history
      searchHistory: [],
      addToSearchHistory: (query) =>
        set((state) => {
          const filtered = state.searchHistory.filter((q) => q !== query)
          return {
            searchHistory: [query, ...filtered].slice(0, 10), // Keep last 10
          }
        }),
      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: 'cinemascope-storage',
      partialize: (state) => ({
        favoriteGenres: state.favoriteGenres,
        watchlist: state.watchlist,
        recentlyViewed: state.recentlyViewed,
        searchHistory: state.searchHistory,
      }),
    }
  )
)