import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface PDFPreviewModalProps {
  url: string | null
  onClose: () => void
}

export function PDFPreviewModal({ url, onClose }: PDFPreviewModalProps) {
  return (
    <AnimatePresence>
      {url && (
        <motion.div
          key="preview-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-5xl h-[85vh] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/40">
              <span className="text-sm font-semibold">PDF Preview</span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 bg-white">
              <iframe
                src={url}
                className="w-full h-full border-none"
                title="PDF Preview"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
