import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Clock, Eye } from 'lucide-react'
import { PDFFile } from '@/hooks/usePDFs'
import { formatDate, truncate } from '@/utils/helpers'
import { Button } from '@/components/ui/button'

interface PDFCardProps {
  pdf: PDFFile
  onDownload: (storagePath: string, filename: string) => Promise<void>
  onPreview: (storagePath: string) => Promise<void>
}

export function PDFCard({ pdf, onDownload, onPreview }: PDFCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      await onDownload(pdf.storage_path, pdf.filename)
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePreview = async () => {
    setIsPreviewing(true)
    try {
      await onPreview(pdf.storage_path)
    } finally {
      setIsPreviewing(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col p-5 bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-muted rounded-lg text-foreground">
          <FileText className="w-6 h-6" />
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreview}
            disabled={isPreviewing}
            title="Preview PDF"
          >
            {isPreviewing ? (
              <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            disabled={isDownloading}
            title="Download PDF"
          >
            {isDownloading ? (
              <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="font-semibold text-foreground leading-tight line-clamp-2" title={pdf.filename}>
          {truncate(pdf.filename, 40)}
        </h4>
        <div className="flex items-center text-xs text-muted-foreground space-x-1.5 mt-2">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(pdf.created_at)}</span>
        </div>
      </div>
    </motion.div>
  )
}
