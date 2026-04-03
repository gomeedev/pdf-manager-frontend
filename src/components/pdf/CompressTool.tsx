import { useState } from 'react'
import { PDFFile, usePDFs } from '@/hooks/usePDFs'
import { FileSelector } from './FileSelector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OperationStatus } from '@/hooks/useOperations'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, Download, AlertCircle, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CompressToolProps {
  pdfs: PDFFile[]
  status: OperationStatus
  onCompress: (fileId: string, outputFilename: string) => Promise<any>
  result: any
  onPreview: (storagePath: string) => Promise<void>
}

export function CompressTool({ pdfs, status, onCompress, result, onPreview }: CompressToolProps) {
  const [selectedId, setSelectedId] = useState<string[]>([])
  const [outputFilename, setOutputFilename] = useState('compressed_document.pdf')
  const { downloadPdf } = usePDFs()

  const handleDownload = async () => {
    if (result?.data?.storage_path && result?.data?.filename) {
      try {
        await downloadPdf(result.data.storage_path, result.data.filename)
      } catch (err) {
        console.error('Download error:', err)
      }
    }
  }

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedId.length === 0) return
    try {
      const data = await onCompress(selectedId[0], outputFilename.endsWith('.pdf') ? outputFilename : `${outputFilename}.pdf`)
      if (data?.data?.storage_path) {
        await onPreview(data.data.storage_path)
      }
    } catch (err) {
      console.error('Operation failed:', err)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <FileSelector 
            label="1. Select PDF to compress"
            pdfs={pdfs} 
            selectedIds={selectedId} 
            onSelect={setSelectedId} 
            multiSelect={false}
          />
          {selectedId.length > 0 && (
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="w-full h-10 gap-2 border-foreground/20 hover:bg-muted" 
                onClick={async (e) => { e.preventDefault(); const p = pdfs.find(p=>p.id===selectedId[0]); if(p) await onPreview(p.storage_path); }}
              >
                <Eye className="w-4 h-4" />
                Preview File
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <form onSubmit={handleExecute} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="output">2. Result Filename</Label>
              <Input 
                id="output" 
                value={outputFilename} 
                onChange={(e) => setOutputFilename(e.target.value)} 
                placeholder="Resulting file name..."
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-medium" 
              disabled={selectedId.length === 0 || status === 'processing'}
            >
              {status === 'processing' ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Compressing File...
                </>
              ) : (
                'Compress Document'
              )}
            </Button>
          </form>

          {status === 'success' && result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-muted rounded-xl flex items-center justify-between border border-border gap-3"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-foreground" />
                <span className="text-sm font-medium">Successfully compressed!</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 px-4 gap-2"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Link to="/dashboard">
                  <Button size="sm" variant="ghost" className="h-9 px-4">
                    View in Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {selectedId.length === 0 && (
             <div className="h-40 flex flex-col items-center justify-center border border-dashed rounded-xl border-border text-muted-foreground">
                <AlertCircle className="w-6 h-6 mb-2 opacity-20" />
                <p className="text-sm">Select a file to start compression</p>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}
