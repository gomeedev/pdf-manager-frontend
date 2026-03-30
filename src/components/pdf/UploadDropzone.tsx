import React, { useState, useRef } from 'react'
import { UploadCloud, FileType } from 'lucide-react'
import { motion } from 'framer-motion'
import { isPdf } from '@/utils/helpers'

interface UploadDropzoneProps {
  onUpload: (file: File) => Promise<void>
  isUploading: boolean
}

export function UploadDropzone({ onUpload, isUploading }: UploadDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
    setError(null)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      processFile(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0])
    }
  }

  const processFile = async (file: File) => {
    if (!isPdf(file)) {
      setError('Please upload a valid PDF file.')
      return
    }

    try {
      await onUpload(file)
    } catch (err: any) {
      setError(err.message || 'Failed to upload PDF. Check your connection.')
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="w-full">
      <motion.div
        whileHover={{ scale: isUploading ? 1 : 1.01 }}
        whileTap={{ scale: isUploading ? 1 : 0.99 }}
        className={`w-full relative rounded-2xl border-2 border-dashed transition-colors flex flex-col items-center justify-center p-12 text-center cursor-pointer overflow-hidden ${
          isDragActive 
            ? 'border-foreground bg-muted/30' 
            : 'border-border hover:border-foreground/50 hover:bg-muted/10'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="application/pdf"
          onChange={handleInputChange}
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-muted rounded-full">
            {isUploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <FileType className="w-8 h-8 text-foreground opacity-50" />
              </motion.div>
            ) : (
              <UploadCloud className="w-8 h-8 text-foreground" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="heading-sm">
              {isUploading ? 'Uploading document...' : 'Upload PDF'}
            </h3>
            <p className="body-sm">
              Drag and drop your PDF here, or click to browse
            </p>
          </div>
        </div>

        {isUploading && (
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute bottom-0 left-0 h-1 bg-foreground"
          />
        )}
      </motion.div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive mt-3 text-center font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
