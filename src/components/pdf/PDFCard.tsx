import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Clock, MoreVertical, Trash2 } from 'lucide-react'
import { PDFFile } from '@/hooks/usePDFs'
import { formatDate, truncate, formatFileSize } from '@/utils/helpers'
import { Button } from '@/components/ui/button'

interface PDFCardProps {
  pdf: PDFFile
  onDownload: (storagePath: string, filename: string) => Promise<void>
  onPreview: (storagePath: string) => Promise<string | null | void>
  onDelete: (id: string) => Promise<void>
}

export function PDFCard({ pdf, onDownload, onPreview, onDelete }: PDFCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDownloading(true)
    setMenuOpen(false)
    try {
      await onDownload(pdf.storage_path, pdf.filename)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    if (confirm('Are you sure you want to delete this PDF? This cannot be undone.')) {
      setIsDeleting(true)
      try {
        await onDelete(pdf.id)
      } catch {
        setIsDeleting(false)
      }
    }
  }

  const handlePreview = async () => {
    try {
      await onPreview(pdf.storage_path)
    } catch { /* silently ignore */ }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={handlePreview}
      className={`group relative flex flex-col p-5 bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-foreground/30 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-muted rounded-lg text-foreground group-hover:bg-foreground/10 transition-colors">
          <FileText className="w-6 h-6" />
        </div>

        {/* Menu Toggle */}
        <div className="relative" onClick={e => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
            className={`w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity ${menuOpen ? 'opacity-100 bg-muted' : ''}`}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false) }} />
              <div className="absolute right-0 top-10 w-36 bg-background border border-border rounded-lg shadow-lg z-20 py-1 overflow-hidden">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                >
                  {isDownloading ? (
                    <div className="w-4 h-4 mr-2 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center px-3 py-2 text-sm hover:bg-destructive/10 text-destructive transition-colors text-left"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 mr-2 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="font-semibold text-foreground leading-tight line-clamp-2" title={pdf.filename}>
          {truncate(pdf.filename, 40)}
        </h4>
        <div className="flex items-center text-xs text-muted-foreground space-x-1.5 mt-2">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(pdf.created_at)}</span>
          {pdf.size_bytes && (
            <>
              <span className="mx-1">•</span>
              <span>{formatFileSize(pdf.size_bytes)}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
