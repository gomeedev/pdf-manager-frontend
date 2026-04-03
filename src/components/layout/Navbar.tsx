import { Link, useLocation } from 'react-router-dom'
import { FileStack } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'

export function Navbar() {
  const { user } = useAuth()
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <FileStack className="w-5 h-5 text-background" />
            </div>
            <span className="font-semibold text-foreground tracking-tight">PDF Manager</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className={isActive('/dashboard') ? "bg-muted" : ""}>
                My Library
              </Button>
            </Link>
            <Link to="/dashboard/operations">
              <Button variant="ghost" size="sm" className={isActive('/dashboard/operations') ? "bg-muted" : ""}>
                Operations
              </Button>
            </Link>
            <Link to="/dashboard/agent">
              <Button variant="ghost" size="sm" className={isActive('/dashboard/agent') ? "bg-muted" : ""}>
                AI Agent
              </Button>
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
  )
}
