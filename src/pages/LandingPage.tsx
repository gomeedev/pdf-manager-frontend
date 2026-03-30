import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CursorMolecules } from '@/components/animations/CursorMolecules';
import { PageTransition } from '@/components/animations/PageTransition';
import { FileStack, Zap, Shield, Search } from 'lucide-react';

export function LandingPage() {
  return (
    <PageTransition>
      <div className="relative min-h-screen bg-background overflow-hidden flex flex-col">
        <CursorMolecules />

        {/* Navigation */}
        <nav className="z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <FileStack className="w-5 h-5 text-background" />
            </div>
            <span className="font-semibold text-foreground tracking-tight">PDF Manager</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-12 z-10 max-w-4xl mx-auto py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter leading-[1.1] text-balance">
              The future of PDF management is <span className="text-muted-foreground/40">intelligent.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance font-light leading-relaxed">
              Experience the next generation of document handling. Powered by AI, designed for speed, and secured with industry-leading standards.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/register">
              <Button size="lg" className="h-14 px-8 text-lg">
                Start processing now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
              Explore use cases
            </Button>
          </motion.div>
        </main>

        {/* Features Section */}
        <section className="z-10 w-full max-w-7xl mx-auto px-6 py-24 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="AI-Powered"
              description="Our ReAct agent understands your natural language instructions to merge, split, and compress files effortlessly."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Private & Secure"
              description="Industry-standard RLS and encrypted storage ensure your sensitive documents never leave your control."
            />
            <FeatureCard
              icon={<Search className="w-6 h-6" />}
              title="Smart Search"
              description="Coming soon: Chat with your PDFs to extract insights, summarize details, and find information in seconds."
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="z-10 w-full border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <span className="text-sm text-muted-foreground">© 2026 PDF Manager. Built with Antigravity.</span>
            <div className="flex gap-8">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="space-y-4">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-foreground">
        {icon}
      </div>
      <h3 className="text-xl font-medium tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
