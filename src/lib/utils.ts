import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.getFullYear().toString()
  } catch {
    return 'N/A'
  }
}

export function formatRuntime(minutes: number | undefined): string {
  if (!minutes) return 'N/A'
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) {
    return `${remainingMinutes}m`
  }
  
  return `${hours}h ${remainingMinutes}m`
}

export function formatRating(rating: number | undefined): string {
  if (!rating) return 'N/A'
  return rating.toFixed(1)
}

export function formatCurrency(amount: number | undefined): string {
  if (!amount) return 'N/A'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function getYouTubeUrl(key: string): string {
  return `https://www.youtube.com/watch?v=${key}`
}

export function getStreamingUrl(id: number, type: 'movie' | 'tv' = 'movie'): string {
  return `https://vidsrc.me/embed/${type}/${id}`
}

export function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}