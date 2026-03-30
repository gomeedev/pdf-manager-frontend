import { useState } from 'react'
import { 
  mergePdfs as apiMerge, 
  splitPdf as apiSplit, 
  compressPdf as apiCompress, 
  removePagesFromPdf as apiRemove 
} from '@/api/pdfOps'

export type OperationStatus = 'idle' | 'processing' | 'success' | 'error'

export function useOperations() {
  const [status, setStatus] = useState<OperationStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)

  const executeOperation = async (opFn: () => Promise<any>) => {
    setStatus('processing')
    setError(null)
    setResult(null)
    try {
      const data = await opFn()
      setResult(data)
      setStatus('success')
      return data
    } catch (err: any) {
      setError(err.message || 'Operation failed')
      setStatus('error')
      throw err
    }
  }

  const merge = (fileIds: string[], outputFilename: string) => 
    executeOperation(() => apiMerge(fileIds, outputFilename))

  const split = (fileId: string, pages: number[], outputFilename: string) => 
    executeOperation(() => apiSplit(fileId, pages, outputFilename))

  const compress = (fileId: string, outputFilename: string) => 
    executeOperation(() => apiCompress(fileId, outputFilename))

  const removePages = (fileId: string, pagesToRemove: number[], outputFilename: string) => 
    executeOperation(() => apiRemove(fileId, pagesToRemove, outputFilename))

  const reset = () => {
    setStatus('idle')
    setError(null)
    setResult(null)
  }

  return {
    status,
    error,
    result,
    merge,
    split,
    compress,
    removePages,
    reset
  }
}
