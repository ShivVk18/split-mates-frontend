import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/Navbar'
import { useNavigate } from 'react-router'
import { SignInForm } from '@/components/SignInForm'
import axios from 'axios'
import { useAuthStore } from '@/stores/userStore'
import { toast } from 'sonner'
import { GoogleLogin } from '@react-oauth/google'
import useSEO from '@/hooks/useSEO'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
}  

export default function SignInPage() { 
  useSEO({
    title: "Sign In",
    description: "Sign in to your SplitMates account to view dashboard groups, record shared transactions, and check AI reports."
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

  // Navbar scroll handler
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

  const handleSignInSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/v1/auth/sign-in', data)
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user))
        localStorage.setItem('token', response.data.data.accessToken)
        useAuthStore.getState().setUser({ user: response.data.data.user, token: response.data.data.accessToken });
        toast.success("Welcome back! Signed in successfully.")
        navigate('/dashboard')
      } else {
        toast.error(response.data.message || "Invalid credentials. Please try again.")
      }
    } catch (error) {
      console.error("Error signing in:", error)
      toast.error(error.response?.data?.message || error.message || "Failed to sign in. Please try again.")
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
                  Welcome Back
                </Badge>
              </motion.div>
              <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                <CardTitle className="text-xl font-bold text-foreground">
                  Sign In to Continue
                </CardTitle>
              </motion.div>
              <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                <CardDescription className="text-muted-foreground text-xs">
                  Access your expense groups and smart bill splitting
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  <SignInForm
                    isLoading={isLoading}
                    onSubmit={handleSignInSubmit}
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
                
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Don't have an account?</p>
                  <Button
                    onClick={() => navigate('/sign-up')}
                    variant="link"
                    className="text-foreground hover:underline text-xs font-semibold"
                  >
                    Create Account
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
