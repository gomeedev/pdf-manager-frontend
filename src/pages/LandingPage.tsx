import { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/animations/PageTransition";
import { Particles } from "@/components/animations/Particles";
import { FileStack, Play, ArrowDown, MoveRight } from "lucide-react";

// Main Typewriter component
const TypewriterText = ({
  text,
  onComplete,
}: {
  text: string;
  onComplete: () => void;
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;
    // Total time is 3 seconds (3000ms). Adjust interval speed accordingly.
    const intervalTime = 3000 / text.length;

    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex];
        setDisplayText(currentText);
        currentIndex++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
        onComplete();
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [text]); // Removed onComplete from dependencies to prevent infinite re-animation on re-renders

  return (
    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] text-balance">
      {displayText}
      {isTyping && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className="inline-block w-1 bg-foreground h-12 ml-1 align-middle"
        />
      )}
    </h1>
  );
};

export function LandingPage() {
  const [heroTypingComplete, setHeroTypingComplete] = useState(false);
  const videoSectionRef = useRef<HTMLDivElement>(null);

  // Use scroll for video parallax relative to the section's viewport intersection
  const { scrollYProgress } = useScroll({
    target: videoSectionRef,
    offset: ["start end", "center center"]
  });
  
  // As the section enters the screen from the bottom ("start end") 
  // until it reaches the center ("center center"), scale from 0.85 to 1.2
  const videoScale = useTransform(scrollYProgress, [0, 1], [0.85, 1.2]);
  const videoOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-background overflow-hidden flex flex-col font-sans">
        <Particles />

        {/* Navigation */}
        <nav className="relative z-50 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between mix-blend-difference text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <FileStack className="w-6 h-6" />
            </div>
            <span className="font-semibold tracking-tight text-lg">
              PDF Manager
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 hover:text-white"
              >
                Log in
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="bg-white text-black hover:bg-white/90"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center space-y-12 max-w-5xl mx-auto pt-32 pb-48">
          <div className="min-h-[160px] flex items-center justify-center">
            <TypewriterText
              text="Your PDFs, managed by AI. Just ask"
              onComplete={() => setHeroTypingComplete(true)}
            />
          </div>

          <div className="h-[200px] w-full flex justify-center">
            <AnimatePresence>
              {heroTypingComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center gap-8"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/register">
                      <Button
                        size="lg"
                        className="h-12 px-8 text-base bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-lg"
                      >
                        Start processing now
                      </Button>
                    </Link>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 px-8 text-base rounded-full"
                      onClick={() =>
                        window.scrollTo({
                          top: window.innerHeight,
                          behavior: "smooth",
                        })
                      }
                    >
                      See how it works <Play className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mt-12 opacity-40"
                  >
                    <ArrowDown className="w-5 h-5 mx-auto" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Interactive Video Section */}
        <section ref={videoSectionRef} className="relative z-10 w-full min-h-screen flex items-center justify-center -mt-32 pb-32">
          <motion.div
            style={{ scale: videoScale, opacity: videoOpacity }}
            className="w-full max-w-6xl mx-auto px-6"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/10 ring-1 ring-black/5">
              <video
                src="/demo_video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </section>

        {/* Dynamic Image/Text Section 1 */}
        <section className="relative z-20 w-full py-32 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative aspect-video rounded-3xl overflow-hidden shadow-xl"
              >
                <img
                  src="/demo_image-1.png"
                  alt="PDF Architecture"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="space-y-6 flex flex-col justify-center"
              >
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  Powered by AI
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Tell it what to do. It handles the rest.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Just type what you need - merge these files, remove page 3,
                  compress this document - and PDF Manager does it for you. No
                  tutorials, no menus, no frustration.
                </p>
                <div>
                  <Button
                    variant="link"
                    className="px-0 flex items-center group"
                  >
                    Learn more{" "}
                    <MoveRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dynamic Image/Text Section 2 */}
        <section className="relative z-20 w-full py-32 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="space-y-6 flex flex-col justify-center order-2 md:order-1"
              >
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  Extreme Performance
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Fast, private, and always yours.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Your files are processed securely and never shared. Upload,
                  edit, and download in seconds - whether you have one document
                  or a hundred.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div>
                    <h4 className="font-semibold text-foreground text-xl">
                      100% Private
                    </h4>
                    <p className="text-sm text-foreground/60">
                      Your files, your control
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-xl">
                      Seconds, not minutes
                    </h4>
                    <p className="text-sm text-foreground/60">
                      From upload to result
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl order-1 md:order-2"
              >
                <img
                  src="/demo_image-2.png"
                  alt="PDF Visual Workspace"
                  className="w-full h-full object-cover object-left-top"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="relative z-20 w-full py-32 bg-foreground text-background text-center flex flex-col items-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Stop fighting your PDFs.
            </h2>
            <p className="text-lg text-background/80 leading-relaxed font-light">
              Join the ecosystem built for modern PDF intelligence. Enhance your
              productivity and experience limitless workflow management and free.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="h-14 px-10 text-lg sm:w-auto bg-white text-black hover:bg-white/90 rounded-full mt-4"
              >
                Get started for free
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-20 w-full py-12 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-muted-foreground">
            <span className="font-medium text-foreground tracking-tight">
              PDF Manager © 2026.
            </span>
            <div className="flex gap-8">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
