/**
 * API Base URL — reads from environment variables.
 * In development: VITE_API_BASE_URL (default: http://127.0.0.1:8000/api/v1)
 * In production: VITE_API_BASE_URL_PROD (set this when backend is deployed)
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL_PROD ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000/api/v1'

/** Supabase Storage bucket name for PDF files */
export const PDF_BUCKET = 'pdf-files'

/** Signed URL expiry time in seconds (1 hour) */
export const SIGNED_URL_EXPIRY = 3600
