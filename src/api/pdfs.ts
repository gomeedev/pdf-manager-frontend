import apiClient from './axiosClient'

export interface UploadResponse {
  status: string
  data: {
    id: string
    filename: string
    storage_path: string
    created_at: string
    user_id: string
  }
}

/**
 * Upload a PDF file to the backend.
 * POST /pdf-ops/upload — multipart/form-data
 */
export async function uploadPdf(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post<UploadResponse>('/pdf-ops/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data
}

/**
 * Delete a PDF file from the backend.
 * DELETE /pdf-ops/{id}
 */
export async function deletePdfApi(id: string): Promise<void> {
  await apiClient.delete(`/pdf-ops/${id}`)
}
