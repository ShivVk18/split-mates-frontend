import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'
import useSEO from '@/hooks/useSEO'

// Modular Landing Components
import ThemeToggle from '@/components/landing/ThemeToggle'
import HeroSection from '@/components/landing/HeroSection'
import BentoFeatures from '@/components/landing/BentoFeatures'
import TimelineProcess from '@/components/landing/TimelineProcess'
import PricingSection from '@/components/landing/PricingSection'
import FaqAccordion from '@/components/landing/FaqAccordion'
import CtaSection from '@/components/landing/CtaSection'
import LandingFooter from '@/components/landing/LandingFooter'

export default function LandingPage() {
  useSEO({
    title: "Split Group Expenses Drama-Free",
    description: "SplitMates is the ultimate Gen-Z coded bill splitter. Auto-calculate optimal settlements with AI, track shared expenses, and avoid awkward money talks. No cap."
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const navigate = useNavigate()

  // Initialize theme on mount to avoid flash
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Handle header visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 10) {
        setIsHeaderVisible(true)
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false)
        setIsMenuOpen(false)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 overflow-x-hidden relative">
      
      {/* Subtle Ambient light spotlight beams (Tailwind Semantic Colors) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/5 dark:bg-orange-500/[0.03] rounded-full blur-[120px] -translate-y-1/2" 
        />
        <motion.div 
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 30, -50, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[20%] right-1/4 w-[600px] h-[600px] bg-muted/20 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -20, 40, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-orange-500/5 dark:bg-orange-500/[0.03] rounded-full blur-[120px] translate-y-1/3" 
        />
      </div>

      {/* Floating Header */}
      <AnimatePresence>
        {isHeaderVisible && (
          <motion.header 
            initial={{ y: -100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: -100, x: "-50%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-6 left-1/2 z-50 w-[90%] max-w-5xl"
          >
            <div className="bg-background/80 backdrop-blur-md border border-border rounded-full shadow-lg px-6 py-3 flex items-center justify-between">
              <div 
                className="flex items-center space-x-2 cursor-pointer" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <img src="/logo.svg" alt="SplitMates Logo" className="h-7 w-7 shrink-0 object-contain" />
                <span className="font-bold text-base bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                  SplitMates
                </span>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                {['Features', 'Timeline', 'Pricing', 'FAQs'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    {item}
                  </a>
                ))}
              </nav>

              {/* Actions & Theme Switcher */}
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden md:inline-flex text-xs font-semibold text-muted-foreground hover:text-foreground rounded-full px-4 py-2 cursor-pointer"
                  onClick={() => navigate('/sign-in')}
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/sign-up')}
                  className="bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs rounded-full px-5 py-2 transition-all duration-150 active:scale-95 cursor-pointer"
                >
                  Get Started
                </Button>

                {/* Mobile Menu Trigger */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden text-muted-foreground hover:bg-accent p-2 rounded-full cursor-pointer"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="fixed top-24 left-6 right-6 z-40 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl p-6 md:hidden flex flex-col space-y-4"
          >
            {['Features', 'Timeline', 'Pricing', 'FAQs'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground py-2 px-3 hover:bg-accent rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <hr className="border-border" />
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-accent"
              onClick={() => {
                setIsMenuOpen(false)
                navigate('/sign-in')
              }}
            >
              Sign In
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render Modular Sections */}
      <HeroSection 
        onStartFree={() => navigate('/sign-up')} 
        onWatchDemo={() => navigate('/sign-in')} 
      />
      
      <BentoFeatures />
      
      <TimelineProcess />
      
      <PricingSection onPlanSelect={() => navigate('/sign-up')} />
      
      <FaqAccordion />
      
      <CtaSection onSignUp={() => navigate('/sign-up')} />
      
      <LandingFooter />

    </div>
  )
}