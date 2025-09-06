import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Navbar } from '@/components/Navbar'
import { useNavigate } from 'react-router'

import { SignUpForm } from '@/components/SignUpForm'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
}  

export default function SignUpPage(){ 

    const navigation = useNavigate()
     
    const [isLoading, setIsLoading] = useState(false)
    const [isNavbarVisible, setIsNavbarVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    // Handle scroll to show/hide navbar
    useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY
        
        // Show navbar when scrolling up or at top
        if (currentScrollY < lastScrollY || currentScrollY < 10) {
          setIsNavbarVisible(true)
        } 
        // Hide navbar when scrolling down
        else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsNavbarVisible(false)
        }
        
        setLastScrollY(currentScrollY)
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      
      return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

 const handleSignUpSubmit = async (data) => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      console.log('Sign Up Data:', data)
    }, 2000)
  }
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-x-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full blur-xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            x: [0, -10, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-teal-400/20 to-blue-400/20 rounded-full blur-xl"
        />
      </div>

      {/* Navbar with scroll-based visibility */}
      <AnimatePresence>
        {isNavbarVisible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-50"
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen pt-24 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="border-slate-200 bg-white/90 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center pb-6">
              <motion.div {...fadeInUp}>
                <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200 mx-auto">
                  <Sparkles className="h-3 w-3 mr-1" />
                Join SplitMates
                </Badge>
              </motion.div>
              
              <motion.div 
                {...fadeInUp}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                  Create Your Account
                </CardTitle>
              </motion.div>
              
              <motion.div 
                {...fadeInUp}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <CardDescription className="text-slate-600">
                  
                     Start splitting bills smarter with AI-powered insights
                  
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  
                    <SignUpForm
                      
                      isLoading={isLoading} 
                      onSubmit={handleSignUpSubmit } 
                    />
                 
                </AnimatePresence>

                {/* Toggle Form */}
                <div className="text-center pt-4 border-t border-slate-200">
                  <p className="text-slate-600 mb-2">
                    Already have an account?
                  </p>
                  <Button
                    onClick={() => navigation('/sign-in')}
                    variant="link"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                     Sign In Instead
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )

      
}