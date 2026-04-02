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

interface SplitToolProps {
  pdfs: PDFFile[]
  status: OperationStatus
  onSplit: (fileId: string, pages: number[], outputFilename: string) => Promise<any>
  result: any
  onPreview: (storagePath: string) => Promise<void>
}

export function SplitTool({ pdfs, status, onSplit, result, onPreview }: SplitToolProps) {
  const [selectedId, setSelectedId] = useState<string[]>([])
  const [pagesStr, setPagesStr] = useState('')
  const [outputFilename, setOutputFilename] = useState('split_document.pdf')
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
    if (selectedId.length === 0 || !pagesStr) return
    
    // Parse pages: "1, 2, 5" -> [1, 2, 5]
    const pages = pagesStr.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p))
    
    if (pages.length === 0) return

    try {
      await onSplit(selectedId[0], pages, outputFilename.endsWith('.pdf') ? outputFilename : `${outputFilename}.pdf`)
    } catch (err) {
      console.error('Split operation failed:', err)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <FileSelector 
            label="1. Select PDF to split"
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
            <div className="space-y-4">
              <Label htmlFor="pages">2. Page numbers to keep</Label>
              <Input 
                id="pages" 
                value={pagesStr} 
                onChange={(e) => setPagesStr(e.target.value)} 
                placeholder="Example: 1, 2, 5"
              />
              <p className="text-xs text-muted-foreground">List page numbers separated by commas (starting from 1).</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="output">3. Result Filename</Label>
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
              disabled={selectedId.length === 0 || !pagesStr || status === 'processing'}
            >
              {status === 'processing' ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Splitting File...
                </>
              ) : (
                'Extract Pages'
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
                <span className="text-sm font-medium">Pages extracted successfully!</span>
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
                <p className="text-sm">Select a file to begin</p>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}
