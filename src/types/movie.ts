export interface Movie {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  genres?: Genre[]
  media_type?: 'movie' | 'tv'
  popularity: number
  adult: boolean
  original_language: string
  original_title?: string
  original_name?: string
  video?: boolean
}

export interface Genre {
  id: number
  name: string
}

export interface MovieDetails extends Movie {
  runtime?: number
  budget?: number
  revenue?: number
  status: string
  tagline: string
  homepage: string
  imdb_id: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
  belongs_to_collection?: Collection
  number_of_episodes?: number
  number_of_seasons?: number
  seasons?: Season[]
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface Collection {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

export interface Season {
  air_date: string
  episode_count: number
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface Crew {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Credits {
  cast: Cast[]
  crew: Crew[]
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
  published_at: string
}

export interface Person {
  id: number
  name: string
  profile_path: string | null
  known_for_department: string
  biography?: string
  birthday?: string
  place_of_birth?: string
  deathday?: string | null
  also_known_as?: string[]
  popularity: number
}

export interface SearchResult {
  page: number
  results: (Movie | Person)[]
  total_pages: number
  total_results: number
}

export interface ApiResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}