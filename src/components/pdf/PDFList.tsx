import { AnimatePresence } from 'framer-motion'
import { PDFFile } from '@/hooks/usePDFs'
import { PDFCard } from './PDFCard'
import { FileQuestion } from 'lucide-react'

interface PDFListProps {
  pdfs: PDFFile[]
  loading: boolean
  onDownload: (storagePath: string, filename: string) => Promise<void>
  onPreview: (storagePath: string) => Promise<void>
}

export function PDFList({ pdfs, loading, onDownload, onPreview }: PDFListProps) {
  if (loading) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="h-44 bg-muted/50 rounded-xl animate-pulse border border-border/50"
          />
        ))}
      </div>
    )
  }

  if (pdfs.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl">
        <div className="p-4 bg-muted/50 rounded-full mb-4">
          <FileQuestion className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="heading-sm text-foreground mb-1">No PDFs found</h3>
        <p className="body-sm max-w-sm">
          You haven't uploaded any documents yet. Drag and drop a file above to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <AnimatePresence>
        {pdfs.map((pdf) => (
          <PDFCard 
            key={pdf.id} 
            pdf={pdf} 
            onDownload={onDownload} 
            onPreview={onPreview}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
