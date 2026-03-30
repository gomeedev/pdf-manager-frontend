/**
 * General-purpose helper functions.
 */

/**
 * Format file size in bytes to a human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Format a date string to a localized readable format.
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

/**
 * Truncate a string to a max length, adding ellipsis if needed.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

/**
 * Extract file extension from a filename.
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? ''
}

/**
 * Check if a file is a valid PDF.
 */
export function isPdf(file: File): boolean {
  return file.type === 'application/pdf' || getFileExtension(file.name) === 'pdf'
}
