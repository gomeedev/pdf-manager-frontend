import { Search, FileText, Check } from 'lucide-react'
import { useState } from 'react'
import { PDFFile } from '@/hooks/usePDFs'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FileSelectorProps {
  pdfs: PDFFile[]
  selectedIds: string[]
  onSelect: (ids: string[]) => void
  multiSelect?: boolean
  label?: string
}

export function FileSelector({ pdfs, selectedIds, onSelect, multiSelect = false, label }: FileSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPdfs = pdfs.filter(pdf => 
    pdf.filename.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleSelect = (id: string) => {
    if (multiSelect) {
      if (selectedIds.includes(id)) {
        onSelect(selectedIds.filter(selectedId => selectedId !== id))
      } else {
        onSelect([...selectedIds, id])
      }
    } else {
      onSelect([id])
    }
  }

  return (
    <div className="space-y-4">
      {label && <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search your PDFs..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {filteredPdfs.length > 0 ? (
          filteredPdfs.map((pdf) => {
            const isSelected = selectedIds.includes(pdf.id)
            return (
              <button
                key={pdf.id}
                onClick={() => toggleSelect(pdf.id)}
                type="button"
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group",
                  isSelected 
                    ? "border-foreground bg-foreground/5 shadow-sm" 
                    : "border-border hover:border-foreground/50 hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isSelected ? "bg-foreground text-background" : "bg-muted text-muted-foreground group-hover:text-foreground"
                  )}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium truncate pr-4">{pdf.filename}</span>
                </div>
                {isSelected && (
                  <div className="bg-foreground text-background rounded-full p-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            )
          })
        ) : (
          <div className="p-8 text-center border border-dashed rounded-xl text-sm text-muted-foreground">
            No files found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}
