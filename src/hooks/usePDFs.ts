import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { uploadPdf as apiUploadPdf } from '@/api/pdfs'
import { PDF_BUCKET, SIGNED_URL_EXPIRY } from '@/utils/constants'

export interface PDFFile {
  id: string
  user_id: string
  filename: string
  storage_path: string
  created_at: string
}

export function usePDFs() {
  const [pdfs, setPdfs] = useState<PDFFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const fetchPDFs = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('pdf_files')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setPdfs(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPDFs()
  }, [fetchPDFs])

  const uploadPdf = async (file: File) => {
    setIsUploading(true)
    setError(null)
    try {
      // Usar la función de Axios que enviará auth y FormData al backend.
      await apiUploadPdf(file)
      // Refrescar lista tras subida exitosa.
      await fetchPDFs()
    } catch (err: any) {
      setError(err.message || 'Error uploading file')
      throw err // propagar para que el componente UI lo capture
    } finally {
      setIsUploading(false)
    }
  }

  const getFileUrl = async (storagePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(PDF_BUCKET)
        .createSignedUrl(storagePath, SIGNED_URL_EXPIRY)

      if (error) throw error
      return data?.signedUrl || null
    } catch (err: any) {
      console.error('URL generation error:', err)
      throw err
    }
  }

  const downloadPdf = async (storagePath: string, filename: string) => {
    const url = await getFileUrl(storagePath)
    if (url) {
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const previewPdf = async (storagePath: string) => {
    const url = await getFileUrl(storagePath)
    if (url) {
      window.open(url, '_blank')
    }
  }

  return {
    pdfs,
    loading,
    error,
    isUploading,
    uploadPdf,
    downloadPdf,
    previewPdf,
    refreshPDFs: fetchPDFs,
  }
}

