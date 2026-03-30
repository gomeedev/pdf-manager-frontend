import { PageTransition } from '@/components/animations/PageTransition'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'

export function DashboardPage() {
  const { user } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <PageTransition>
      <div className="flex-1 p-8 bg-background">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="flex items-center justify-between border-b pb-6">
            <div>
              <h1 className="heading-lg">Dashboard</h1>
              <p className="body-sm mt-1">
                Signed in as <span className="font-mono text-foreground">{user?.email}</span>
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sign out
            </Button>
          </header>
          
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            {/* Stub for Cycle 3 */}
            PDFs list and upload mechanics will be built here in Cycle 3.
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
