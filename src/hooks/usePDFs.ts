import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { uploadPdf as apiUploadPdf, deletePdfApi } from '@/api/pdfs'
import { PDF_BUCKET, SIGNED_URL_EXPIRY } from '@/utils/constants'

export interface PDFFile {
  id: string
  user_id: string
  filename: string
  storage_path: string
  size_bytes?: number
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
      await apiUploadPdf(file)
      await fetchPDFs()
    } catch (err: any) {
      setError(err.message || 'Error uploading file')
      throw err
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

  /** Returns signed URL so callers can open it however they like (modal, iframe, etc.) */
  const previewPdf = async (storagePath: string): Promise<string | null> => {
    return await getFileUrl(storagePath)
  }

  const deletePdf = async (id: string) => {
    try {
      await deletePdfApi(id)
      await fetchPDFs()
    } catch (err: any) {
      console.error('API deletion error:', err)
      throw err
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
    deletePdf,
    refreshPDFs: fetchPDFs,
  }
}
