import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/Navbar'
import { useNavigate } from 'react-router'
import { SignUpForm } from '@/components/SignUpForm'
import axios from 'axios'
import { toast } from 'sonner'
import { GoogleLogin } from '@react-oauth/google'
import useSEO from '@/hooks/useSEO'
import { useAuthStore } from '@/stores/userStore'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
}  

export default function SignUpPage() { 
  useSEO({
    title: "Create Account",
    description: "Create a new SplitMates account and get started splitting group expenses, keeping track of shared ledgers, and optimizing debts with AI."
  });

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Initialize theme on mount to avoid flash
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Handle scroll to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsNavbarVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavbarVisible(false)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleSignUpSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/v1/auth/register', data)
      if (response.data.success) {
        toast.success("Account created successfully! Please sign in.")
        navigate('/sign-in')
      } else {
        toast.error(response.data.message || "Registration failed")
      }
    } catch (error) {
      console.error("Error signing up:", error)
      toast.error(error.response?.data?.message || "Failed to register account")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/v1/auth/google-login', {
        idToken: credentialResponse.credential,
      })
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user))
        localStorage.setItem('token', response.data.data.accessToken)
        useAuthStore.getState().setUser({ user: response.data.data.user, token: response.data.data.accessToken });
        toast.success("Signed in successfully via Google!")
        navigate('/dashboard')
      } else {
        toast.error(response.data.message || "Google authentication failed")
      }
    } catch (error) {
      console.error("Google login error:", error)
      toast.error(error.response?.data?.message || error.message || "Failed to sign in via Google")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleError = () => {
    toast.error("Google Sign-In initialization failed")
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 overflow-x-hidden relative flex items-center justify-center">
      {/* Background Dots Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(ellipse_at_center,var(--foreground)_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Navbar */}
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
      <div className="relative z-10 w-full max-w-md px-4 py-12 pt-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className="border-border bg-card/60 backdrop-blur-md shadow-sm">
            <CardHeader className="text-center pb-6">
              <motion.div {...fadeInUp}>
                <Badge className="mb-4 bg-muted border border-border text-foreground mx-auto">
                  Join SplitMates
                </Badge>
              </motion.div>
              
              <motion.div 
                {...fadeInUp}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <CardTitle className="text-xl font-bold text-foreground">
                  Create Your Account
                </CardTitle>
              </motion.div>
              
              <motion.div 
                {...fadeInUp}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <CardDescription className="text-muted-foreground text-xs">
                  Start splitting bills smarter with detailed insights
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  <SignUpForm
                    isLoading={isLoading} 
                    onSubmit={handleSignUpSubmit} 
                    googleButton={
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        type="icon"
                        shape="circle"
                        theme="outline"
                      />
                    }
                  />
                </AnimatePresence>

                {/* Toggle Form */}
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">
                    Already have an account?
                  </p>
                  <Button
                    onClick={() => navigate('/sign-in')}
                    variant="link"
                    className="text-foreground hover:underline text-xs font-semibold"
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