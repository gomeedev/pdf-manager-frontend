import { PageTransition } from '@/components/animations/PageTransition'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'
import { usePDFs } from '@/hooks/usePDFs'
import { UploadDropzone } from '@/components/pdf/UploadDropzone'
import { PDFList } from '@/components/pdf/PDFList'
import { motion } from 'framer-motion'
import { FileStack } from 'lucide-react'

export function DashboardPage() {
  const { user } = useAuth()
  const { pdfs, loading, isUploading, uploadPdf, downloadPdf, previewPdf } = usePDFs()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <PageTransition>
      <div className="flex-1 w-full min-h-screen bg-background">
        {/* Navigation Bar */}
        <nav className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <FileStack className="w-5 h-5 text-background" />
              </div>
              <span className="font-semibold text-foreground tracking-tight">PDF Manager</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          </div>
        </nav>

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
              <span className="text-sm font-medium bg-muted px-3 py-1 rounded-full text-foreground">
                {pdfs.length} files
              </span>
            </div>

            <PDFList 
              pdfs={pdfs} 
              loading={loading} 
              onDownload={downloadPdf} 
              onPreview={previewPdf}
            />
          </motion.section>

        </main>
      </div>
    </PageTransition>
  )
}
