import { useState } from 'react'
import { PageTransition } from '@/components/animations/PageTransition'
import { usePDFs } from '@/hooks/usePDFs'
import { UploadDropzone } from '@/components/pdf/UploadDropzone'
import { PDFList } from '@/components/pdf/PDFList'
import { PDFPreviewModal } from '@/components/pdf/PDFPreviewModal'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'

export function DashboardPage() {
  const { pdfs, loading, isUploading, uploadPdf, downloadPdf, previewPdf, deletePdf } = usePDFs()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handlePreviewClick = async (storagePath: string) => {
    const url = await previewPdf(storagePath)
    if (url) setPreviewUrl(url)
  }

  return (
    <PageTransition>
      <div className="flex-1 w-full min-h-screen bg-background">
        {/* Navigation Bar */}
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
          
          {/* Header Section */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="space-y-2">
              <h1 className="heading-xl">Your Documents</h1>
              <p className="body-lg max-w-xl">
                Upload, manage, and interact with your PDFs. All files are securely processed and stored.
              </p>
            </div>
          </motion.section>

          {/* Upload Section */}
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <UploadDropzone onUpload={uploadPdf} isUploading={isUploading} />
          </motion.section>

          <hr className="divider" />

          {/* List Section */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="heading-md">Recent Files</h2>
              {!loading && (
                <span className="text-sm font-medium bg-muted px-3 py-1 rounded-full text-foreground">
                  {pdfs.length} {pdfs.length === 1 ? 'file' : 'files'}
                </span>
              )}
            </div>

            <PDFList
              pdfs={pdfs}
              loading={loading}
              onDownload={downloadPdf}
              onPreview={handlePreviewClick}
              onDelete={deletePdf}
            />
          </motion.section>

        </main>
      </div>

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </PageTransition>
  )
}
