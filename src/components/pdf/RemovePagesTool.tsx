import { useState } from 'react'
import { PDFFile } from '@/hooks/usePDFs'
import { FileSelector } from './FileSelector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OperationStatus } from '@/hooks/useOperations'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, Download, AlertCircle } from 'lucide-react'

interface RemovePagesToolProps {
  pdfs: PDFFile[]
  status: OperationStatus
  onRemove: (fileId: string, pagesToRemove: number[], outputFilename: string) => Promise<any>
  result: any
}

export function RemovePagesTool({ pdfs, status, onRemove, result }: RemovePagesToolProps) {
  const [selectedId, setSelectedId] = useState<string[]>([])
  const [pagesStr, setPagesStr] = useState('')
  const [outputFilename, setOutputFilename] = useState('reduced_document.pdf')

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedId.length === 0 || !pagesStr) return
    
    // Parse pages: "2, 4" -> [2, 4]
    const pages = pagesStr.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p))
    
    if (pages.length === 0) return

    await onRemove(selectedId[0], pages, outputFilename.endsWith('.pdf') ? outputFilename : `${outputFilename}.pdf`)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <FileSelector 
            label="1. Select PDF to modify"
            pdfs={pdfs} 
            selectedIds={selectedId} 
            onSelect={setSelectedId} 
            multiSelect={false}
          />
        </div>

        <div className="space-y-8">
          <form onSubmit={handleExecute} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="pages">2. Page numbers to remove</Label>
              <Input 
                id="pages" 
                value={pagesStr} 
                onChange={(e) => setPagesStr(e.target.value)} 
                placeholder="Example: 2, 4, 8"
              />
              <p className="text-xs text-muted-foreground">List page numbers separated by commas to be deleted from the document.</p>
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
                  Removing Pages...
                </>
              ) : (
                'Remove Specified Pages'
              )}
            </Button>
          </form>

          {status === 'success' && result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-muted rounded-xl flex items-center justify-between border border-border"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-foreground" />
                <span className="text-sm font-medium">Pages removed successfully!</span>
              </div>
              <Button size="sm" variant="outline" className="h-9 px-4 gap-2">
                <Download className="w-4 h-4" />
                View in Dashboard
              </Button>
            </motion.div>
          )}

          {selectedId.length === 0 && (
             <div className="h-40 flex flex-col items-center justify-center border border-dashed rounded-xl border-border text-muted-foreground">
                <AlertCircle className="w-6 h-6 mb-2 opacity-20" />
                <p className="text-sm">Select a file from your library</p>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}
