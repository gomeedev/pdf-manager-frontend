import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '@/components/animations/PageTransition'
import { usePDFs } from '@/hooks/usePDFs'
import { useOperations } from '@/hooks/useOperations'
import { MergeTool } from '@/components/pdf/MergeTool'
import { SplitTool } from '@/components/pdf/SplitTool'
import { CompressTool } from '@/components/pdf/CompressTool'
import { RemovePagesTool } from '@/components/pdf/RemovePagesTool'
import { FileStack, ArrowLeft, Layers, Scissors, Minimize2, Trash2, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type ToolType = 'merge' | 'split' | 'compress' | 'remove'

export function OperationsPage() {
  const { pdfs, loading } = usePDFs()
  const { status, error, result, merge, split, compress, removePages, reset } = useOperations()
  const [activeTool, setActiveTool] = useState<ToolType>('merge')

  const tools = [
    { id: 'merge', label: 'Merge', icon: Layers, description: 'Combine multiple PDFs into one.' },
    { id: 'split', label: 'Split', icon: Scissors, description: 'Extract specific pages from a document.' },
    { id: 'compress', label: 'Compress', icon: Minimize2, description: 'Optimize and reduce file size.' },
    { id: 'remove', label: 'Remove Pages', icon: Trash2, description: 'Delete unwanted pages from a PDF.' }
  ]

  const handleToolChange = (id: ToolType) => {
    setActiveTool(id)
    reset()
  }

  return (
    <PageTransition>
      <div className="flex-1 w-full min-h-screen bg-background flex flex-col">
        {/* Navigation */}
        <nav className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Library</span>
              </Link>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-foreground rounded flex items-center justify-center">
                  <FileStack className="w-4 h-4 text-background" />
                </div>
                <span className="font-semibold text-foreground tracking-tight">PDF Operations</span>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
          {/* Sidebar Tabs */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="space-y-1">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest px-2 mb-4">Toolkit</h2>
              <div className="space-y-1">
                {tools.map((tool) => {
                  const Icon = tool.icon
                  const isActive = activeTool === tool.id
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleToolChange(tool.id as ToolType)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left",
                        isActive 
                          ? "bg-foreground text-background shadow-lg" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", isActive ? "text-background" : "text-muted-foreground")} />
                      <span className="font-medium text-sm">{tool.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-muted/50 border border-border space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About this tool</h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {tools.find(t => t.id === activeTool)?.description} All operations are processed on the server and saved back to your library.
              </p>
            </div>
          </aside>

          {/* Tool Workspace */}
          <div className="flex-1 space-y-8">
             <header className="space-y-2">
                <h1 className="heading-lg">
                  {tools.find(t => t.id === activeTool)?.label} PDF
                </h1>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}
             </header>

             <div className="bg-background rounded-2xl border border-border p-8 min-h-[400px]">
               <AnimatePresence mode="wait">
                 {loading ? (
                   <div className="h-full flex flex-col items-center justify-center space-y-4">
                     <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                     <p className="text-sm text-muted-foreground">Loading your library...</p>
                   </div>
                 ) : pdfs.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center space-y-4">
                     <FileStack className="w-8 h-8 text-muted-foreground opacity-50" />
                     <p className="text-sm text-muted-foreground">No PDFs available. Upload some files in your library first.</p>
                   </div>
                 ) : (
                    <motion.div
                      key={activeTool}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTool === 'merge' && <MergeTool pdfs={pdfs} status={status} onMerge={merge} result={result} />}
                      {activeTool === 'split' && <SplitTool pdfs={pdfs} status={status} onSplit={split} result={result} />}
                      {activeTool === 'compress' && <CompressTool pdfs={pdfs} status={status} onCompress={compress} result={result} />}
                      {activeTool === 'remove' && <RemovePagesTool pdfs={pdfs} status={status} onRemove={removePages} result={result} />}
                    </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
