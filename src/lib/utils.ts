import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatMonth(month: string) {
  const [year, m] = month.split('-')
  return new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
  })
}

export function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-amber-400'
  return 'text-red-400'
}

export function scoreBg(score: number) {
  if (score >= 80) return 'bg-emerald-500/20 border-emerald-500/30'
  if (score >= 60) return 'bg-amber-500/20 border-amber-500/30'
  return 'bg-red-500/20 border-red-500/30'
}
