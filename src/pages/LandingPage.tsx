import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/animations/PageTransition'
import { Particles } from '@/components/animations/Particles'
import { FileStack, Zap, Shield, Search, Play, ArrowDown } from 'lucide-react'

export function LandingPage() {
  const featuresRef = useRef<HTMLDivElement>(null)

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-background overflow-hidden flex flex-col">
        <Particles />

        {/* Navigation */}
        <nav className="relative z-20 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-foreground to-foreground/70 rounded-lg flex items-center justify-center">
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
        <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center space-y-12 max-w-5xl mx-auto py-24">
          {/* Gradient blur background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-foreground/5 via-transparent to-foreground/5 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.2] text-balance">
              The future of PDF management is{' '}
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                intelligent
              </span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto text-balance font-light leading-relaxed">
              Experience the next generation of document handling. Powered by AI, designed for speed, and secured with industry-leading standards.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link to="/register">
              <Button size="lg" className="h-14 px-8 text-lg bg-foreground text-background hover:bg-foreground/90">
                Start processing now
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-8 text-lg"
              onClick={scrollToFeatures}
            >
              Explore features
            </Button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <ArrowDown className="w-6 h-6 text-foreground/40" />
          </motion.div>
        </main>

        {/* Features Section */}
        <section 
          ref={featuresRef}
          className="relative z-20 w-full py-24 border-t border-foreground/10"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: '-100px' }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Powerful capabilities
              </h2>
              <p className="text-lg text-foreground/60">Everything you need to master your PDF workflow</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: 'AI-Powered',
                  description: 'Our ReAct agent understands your natural language instructions to merge, split, and compress files effortlessly.',
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: 'Private & Secure',
                  description: 'Industry-standard RLS and encrypted storage ensure your sensitive documents never leave your control.',
                },
                {
                  icon: <Search className="w-6 h-6" />,
                  title: 'Smart Processing',
                  description: 'Instant operations on your PDFs with real-time feedback and download your results immediately.',
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true, margin: '-100px' }}
                >
                  <div className="p-6 rounded-2xl border border-foreground/10 hover:border-foreground/30 bg-gradient-to-br from-background via-background to-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center text-foreground group-hover:from-foreground/20 group-hover:to-foreground/10 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight mt-4 mb-2">{feature.title}</h3>
                    <p className="text-foreground/60 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="relative z-20 w-full py-24 border-t border-foreground/10">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: '-100px' }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                See it in action
              </h2>
              <p className="text-lg text-foreground/60">Watch how our AI agent simplifies PDF management</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: '-100px' }}
              className="relative rounded-2xl overflow-hidden border border-foreground/10 bg-gradient-to-br from-foreground/5 to-foreground/0 backdrop-blur-sm p-1"
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Video placeholder */}
              <div className="relative bg-gradient-to-br from-foreground/10 via-foreground/5 to-transparent aspect-video rounded-xl flex flex-col items-center justify-center group cursor-pointer hover:from-foreground/15 transition-all duration-300">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-black/0 to-black/10" />
                
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative z-10 w-16 h-16 rounded-full bg-foreground/20 flex items-center justify-center backdrop-blur-sm border border-foreground/30 group-hover:bg-foreground/30 group-hover:border-foreground/50 transition-all duration-300"
                >
                  <Play className="w-8 h-8 text-foreground fill-foreground" />
                </motion.div>

                <p className="relative z-10 mt-6 text-foreground/60 font-medium">Demo Video</p>
                <p className="relative z-10 text-sm text-foreground/40 mt-2">Coming soon - See the agent in action</p>
              </div>
            </motion.div>

            {/* Demo features list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                { title: 'Natural Language Commands', desc: 'Just describe what you want to do' },
                { title: 'Real-time Processing', desc: 'Instant results without delays' },
                { title: 'One-click Download', desc: 'Get your files immediately' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 p-4"
                >
                  <div className="w-2 h-2 rounded-full bg-foreground mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    <p className="text-sm text-foreground/60">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-20 w-full py-20 border-t border-foreground/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Ready to transform your workflow?
              </h2>
              <p className="text-lg text-foreground/60">
                Join thousands of users who are already using PDF Manager to streamline their document operations.
              </p>
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 text-lg bg-foreground text-background hover:bg-foreground/90">
                  Start for free today
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-20 w-full border-t border-foreground/10 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-foreground/60">
            <span>© 2026 PDF Manager.</span>
            <div className="flex gap-8">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}
