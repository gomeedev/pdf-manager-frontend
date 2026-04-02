import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Trash2, FileStack } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'
import { useAgent } from '@/hooks/useAgent'
import { PageTransition } from '@/components/animations/PageTransition'

export function AgentPage() {
  const { user } = useAuth()
  const { messages, isTyping, error, sendMessage, clearHistory } = useAgent()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return
    const msg = input.trim()
    setInput('')
    await sendMessage(msg)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <PageTransition>
      <div className="flex flex-col w-full h-screen bg-background overflow-hidden relative">
        {/* Decorative background gradients from Dashboard design */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-foreground/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-foreground/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Navigation Bar */}
        <nav className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                  <FileStack className="w-5 h-5 text-background" />
                </div>
                <span className="font-semibold text-foreground tracking-tight">PDF Manager</span>
              </div>
              
              <div className="hidden md:flex items-center gap-1">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">My Library</Button>
                </Link>
                <Link to="/dashboard/operations">
                  <Button variant="ghost" size="sm">Operations</Button>
                </Link>
                <Link to="/dashboard/agent">
                  <Button variant="ghost" size="sm" className="bg-muted">AI Agent</Button>
                </Link>
              </div>
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

        {/* Main Chat Interface */}
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col min-h-0 bg-background/50 relative z-10">
          
          <div className="flex items-center justify-between py-4 border-b border-border/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">AI PDF Assistant</h1>
                <p className="text-xs text-muted-foreground">Ask me to organize or process your PDFs</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearHistory} disabled={messages.length === 0} className="text-muted-foreground hover:text-foreground">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto w-full py-6 space-y-6 scrollbar-hide">
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4"
              >
                <Bot className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground max-w-sm">
                  Hi, I'm your PDF agent. I can help you process your files, check your library, and perform operations using natural language.
                </p>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="flex-shrink-0 mt-1">
                      {message.role === 'user' ? (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border">
                          <User className="w-4 h-4 text-foreground" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    
                    <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      message.role === 'user' 
                        ? 'bg-foreground text-background rounded-tr-sm' 
                        : 'bg-muted text-foreground border border-border rounded-tl-sm'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start w-full"
              >
                <div className="flex gap-3 max-w-[80%]">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg">
                      <Bot className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="px-5 py-4 rounded-2xl bg-muted border border-border rounded-tl-sm flex items-center gap-1">
                    <motion.div 
                      animate={{ y: [0, -4, 0] }} 
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-1.5 h-1.5 bg-foreground/60 rounded-full"
                    />
                    <motion.div 
                      animate={{ y: [0, -4, 0] }} 
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-foreground/60 rounded-full"
                    />
                    <motion.div 
                      animate={{ y: [0, -4, 0] }} 
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-1.5 h-1.5 bg-foreground/60 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center w-full mt-2"
              >
                <span className="text-xs text-red-500 font-medium">Error: {error}</span>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="py-4 mt-auto shrink-0 bg-background/80 backdrop-blur-md">
            <form onSubmit={handleSubmit} className="flex gap-3 items-center relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message the PDF agent..."
                disabled={isTyping}
                className="h-14 pl-5 pr-14 text-base rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-1 focus-visible:ring-foreground transition-all shadow-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!input.trim() || isTyping}
                  className="rounded-xl w-10 h-10 bg-foreground text-background hover:bg-foreground/90 transition-transform active:scale-95 disabled:opacity-50"
                  variant="default"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
            <div className="text-center mt-3">
              <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-medium">
                AI may produce inaccurate results
              </span>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
