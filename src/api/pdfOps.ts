import apiClient from './axiosClient'

interface PdfOperationResult {
  status: string
  data: {
    id: string
    filename: string
    storage_path: string
    created_at: string
  }
}

/**
 * Merge multiple PDFs into one.
 * POST /pdf-ops/merge
 */
export async function mergePdfs(
  fileIds: string[],
  outputFilename: string
): Promise<PdfOperationResult> {
  const response = await apiClient.post<PdfOperationResult>('/pdf-ops/merge', {
    file_ids: fileIds,
    output_filename: outputFilename,
  })
  return response.data
}

/**
 * Split a PDF keeping only the specified pages.
 * POST /pdf-ops/split
 */
export async function splitPdf(
  fileId: string,
  pages: number[],
  outputFilename: string
): Promise<PdfOperationResult> {
  const response = await apiClient.post<PdfOperationResult>('/pdf-ops/split', {
    file_id: fileId,
    pages,
    output_filename: outputFilename,
  })
  return response.data
}

/**
 * Remove specific pages from a PDF.
 * POST /pdf-ops/remove-pages
 */
export async function removePagesFromPdf(
  fileId: string,
  pagesToRemove: number[],
  outputFilename: string
): Promise<PdfOperationResult> {
  const response = await apiClient.post<PdfOperationResult>('/pdf-ops/remove-pages', {
    file_id: fileId,
    pages_to_remove: pagesToRemove,
    output_filename: outputFilename,
  })
  return response.data
}

/**
 * Compress a PDF.
 * POST /pdf-ops/compress
 */
export async function compressPdf(
  fileId: string,
  outputFilename: string
): Promise<PdfOperationResult> {
  const response = await apiClient.post<PdfOperationResult>('/pdf-ops/compress', {
    file_id: fileId,
    output_filename: outputFilename,
  })
  return response.data
}
