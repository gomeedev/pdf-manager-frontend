import { useState } from 'react'
import { PDFFile, usePDFs } from '@/hooks/usePDFs'
import { FileSelector } from './FileSelector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OperationStatus } from '@/hooks/useOperations'
import { motion, Reorder } from 'framer-motion'
import { Loader2, AlertCircle, FileText, CheckCircle2, Download, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

interface MergeToolProps {
  pdfs: PDFFile[]
  status: OperationStatus
  onMerge: (fileIds: string[], outputFilename: string) => Promise<any>
  result: any
  onPreview: (storagePath: string) => Promise<void>
}

export function MergeTool({ pdfs, status, onMerge, result, onPreview }: MergeToolProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [outputFilename, setOutputFilename] = useState('merged_document.pdf')
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

  // Sorting based on selected order
  const selectedPdfs = selectedIds.map(id => pdfs.find(p => p.id === id)!)

  const handleReorder = (newOrder: PDFFile[]) => {
    setSelectedIds(newOrder.map(pdf => pdf.id))
  }

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedIds.length < 2) return
    await onMerge(selectedIds, outputFilename.endsWith('.pdf') ? outputFilename : `${outputFilename}.pdf`)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <FileSelector 
            label="1. Select PDFs to merge (min 2)"
            pdfs={pdfs} 
            selectedIds={selectedIds} 
            onSelect={setSelectedIds} 
            multiSelect 
          />
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">2. Configure Merge Order</h3>
            {selectedIds.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-balance leading-relaxed">Drag to reorder. Files will be merged in the top-to-bottom sequence.</p>
                <Reorder.Group axis="y" values={selectedPdfs} onReorder={handleReorder} className="space-y-2">
                  {selectedPdfs.map((pdf) => (
                    <Reorder.Item 
                      key={pdf.id} 
                      value={pdf}
                      className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl cursor-grab active:cursor-grabbing hover:border-foreground/20 transition-colors shadow-sm"
                    >
                      <div className="p-1.5 bg-muted rounded-md text-muted-foreground flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium truncate flex-1">{pdf.filename}</span>
                      <button 
                        type="button"
                        onClick={async (e) => { e.stopPropagation(); await onPreview(pdf.storage_path); }} 
                        className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center border border-dashed rounded-xl border-border text-muted-foreground">
                <AlertCircle className="w-6 h-6 mb-2 opacity-20" />
                <p className="text-sm">No files selected</p>
              </div>
            )}
          </div>

          <form onSubmit={handleExecute} className="space-y-6">
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
              disabled={selectedIds.length < 2 || status === 'processing'}
            >
              {status === 'processing' ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Merging Files...
                </>
              ) : (
                'Generate Merged PDF'
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
                <span className="text-sm font-medium">Files merged successfully!</span>
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
        </div>
      </div>
    </div>
  )
}
