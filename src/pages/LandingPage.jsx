import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calculator, 
  Users, 
  Sparkles, 
  Shield, 
  Smartphone, 
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Zap,
  Globe,
  Heart,
  Github,
  Twitter,
  Linkedin,
  Menu,
  X,
  DollarSign,
  BarChart3,
  Clock
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useNavigate } from 'react-router'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const scaleOnHover = {
  whileHover: { scale: 1.05, y: -8 },
  transition: { duration: 0.2 }
}

// Header animation variants
const headerVariants = {
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  hidden: {
    y: -100,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
}

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
   

  const navigate = useNavigate()
  // Handle scroll for hiding/showing header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show header when at top or scrolling up
      if (currentScrollY < 10) {
        setIsHeaderVisible(true)
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false)
        setIsMenuOpen(false) // Close mobile menu when scrolling down
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const features = [
    {
      icon: Calculator,
      title: 'Smart Bill Splitting',
      description: 'Split bills by equal amounts, custom values, or percentages with real-time calculations and instant notifications.'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Insights',
      description: 'Get intelligent spending reports, smart budgeting suggestions, and personalized financial insights.'
    },
    {
      icon: Users,
      title: 'Group Management',
      description: 'Create and manage expense groups with friends, family, or roommates with advanced permission controls.'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Enterprise-grade security with end-to-end encryption, secure authentication, and data protection.'
    },
    {
      icon: Smartphone,
      title: 'Real-time Sync',
      description: 'Instant synchronization across all devices with offline support and automatic conflict resolution.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive spending analytics, custom reports, and detailed insights into your financial habits.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'College Student',
      avatar: 'SJ',
      content: 'SplitMates has completely transformed how my roommates and I handle shared expenses. The AI insights have helped us save over $200 this month!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Travel Enthusiast',
      avatar: 'MC',
      content: 'Perfect for group trips! The real-time sync means everyone stays updated, and the expense categorization makes travel budgeting effortless.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Young Professional',
      avatar: 'ER',
      content: 'The analytics dashboard is incredible. I finally understand my spending patterns and the smart suggestions have helped me budget better.',
      rating: 5
    }
  ]

  const stats = [
    { number: '50K+', label: 'Active Users', icon: Users },
    { number: '$10M+', label: 'Bills Split', icon: DollarSign },
    { number: '250K+', label: 'Expenses Tracked', icon: BarChart3 },
    { number: '99.9%', label: 'Uptime', icon: Clock }
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      features: [
        'Up to 3 groups',
        'Basic bill splitting',
        'Mobile app access',
        'Email support',
        '10 expenses per month'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro',
      price: 9,
      description: 'For power users and larger groups',
      features: [
        'Unlimited groups',
        'AI-powered insights',
        'Advanced analytics',
        'Priority support',
        'Export reports',
        'Custom categories',
        'Receipt scanning'
      ],
      cta: 'Start Pro Trial',
      popular: true
    },
    {
      name: 'Team',
      price: 19,
      description: 'For organizations and large groups',
      features: [
        'Everything in Pro',
        'Team management',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'Advanced permissions',
        'API access'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-x-hidden">
      {/* Modern Floating Pill Header */}
    <AnimatePresence>
        {isHeaderVisible && (
          <motion.header 
            variants={headerVariants}
            initial="visible"
            animate="visible"
            exit="hidden"
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              {/* Backdrop blur container with animated border */}
              <div className="bg-white/80 backdrop-blur-xl rounded-full shadow-xl shadow-black/5 border-2" 
                   style={{ 
                     borderColor: '#93c5fd',
                     animation: 'borderPulse 2s ease-in-out infinite',
                     boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
                   }}>
                <div className="flex h-16 items-center justify-between px-6">
                  {/* Logo */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">SM</span>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                      SplitMates
                    </h1>
                  </motion.div>
                  
                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex items-center space-x-8">
                    {['Features', 'How it Works', 'Reviews', 'Pricing'].map((item) => (
                      <motion.a
                        key={item}
                        href={`#${item.toLowerCase().replace(' ', '-')}`}
                        className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item}
                      </motion.a>
                    ))}
                  </nav>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hidden md:flex text-slate-700 hover:bg-slate-100/80"
                        onClick={()=> navigate('/sign-in')}
                      >
                        Sign In
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        size="sm" 
                        onClick={()=> navigate('/sign-up')}
                        className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Get Started
                      </Button>
                    </motion.div>
                    
                    {/* Mobile Menu Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden text-slate-700 hover:bg-slate-100/80"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                      >
                        {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* CSS for border-only animation */}
              <style jsx='true'>{`
                @keyframes borderPulse {
                  0%, 100% { border-color: #93c5fd; }
                  50% { border-color: #3b82f6; }
                }
              `}</style>
            </motion.div>
          </motion.header>
        )}
      </AnimatePresence>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && isHeaderVisible && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-sm mx-4"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 space-y-4">
                {['Features', 'How it Works', 'Reviews', 'Pricing'].map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="block text-base font-medium text-slate-700 hover:text-blue-600 transition-colors py-2 px-4 rounded-xl hover:bg-slate-100/50"
                    onClick={() => setIsMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 8 }}
                  >
                    {item}
                  </motion.a>
                ))}
                <hr className="border-slate-200 my-4" />
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-slate-700 hover:bg-slate-100/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden pt-32">
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

        <div className="container mx-auto text-center relative z-10">
          <motion.div {...fadeInUp}>
            <Badge className="mb-8 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Bill Splitting
            </Badge>
          </motion.div>
          
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Split Bills 
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent text-4xl md:text-6xl">
                Smarter, Not Harder
              </span>
            </h1>
          </motion.div>
          
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              The most intelligent way to split expenses with friends, family, and roommates. 
              Get AI-powered insights, real-time synchronization, and never worry about who owes what again.
            </p>
          </motion.div>
          
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-lg px-10 py-4 shadow-xl text-white"
              >
                Start Splitting for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-10 py-4 border-2 border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="h-6 w-6 text-blue-600 mr-2" />
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                </div>
                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <motion.div {...fadeInUp}>
              <Badge className="mb-6 bg-teal-50 text-teal-700 border-teal-200">
                <Zap className="h-3 w-3 mr-1" />
                Powerful Features
              </Badge>
            </motion.div>
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                  Everything You Need to Split Bills
                </span>
              </h2>
            </motion.div>
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                From simple splits to complex group expenses, SplitMates provides all the advanced tools you need.
              </p>
            </motion.div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp} {...scaleOnHover}>
                <Card className="hover:shadow-xl transition-all duration-500 border-slate-200 bg-white/80 backdrop-blur-sm h-full">
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center mb-6 shadow-lg">
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-slate-800">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-slate-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <motion.div {...fadeInUp}>
              <Badge className="mb-6 bg-slate-100 text-slate-700 border-slate-200">
                <Globe className="h-3 w-3 mr-1" />
                Simple Process
              </Badge>
            </motion.div>
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-800 to-teal-600 bg-clip-text text-transparent">
                  How SplitMates Works
                </span>
              </h2>
            </motion.div>
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Get started in minutes with our intuitive three-step process designed for simplicity and efficiency.
              </p>
            </motion.div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto"
          >
            {[
              {
                step: 1,
                title: 'Create a Group',
                description: 'Add your friends, family, or roommates to start tracking shared expenses together with smart group management.'
              },
              {
                step: 2,
                title: 'Add Expenses',
                description: 'Upload receipts, enter amounts, and choose how to split - equally, by percentage, or custom amounts with AI assistance.'
              },
              {
                step: 3,
                title: 'Settle Up',
                description: 'Get AI-powered insights, track balances automatically, and settle debts with integrated payment options.'
              }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <span className="text-3xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-slate-800">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="reviews" className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <motion.div {...fadeInUp}>
              <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-200">
                <Heart className="h-3 w-3 mr-1" />
                Customer Love
              </Badge>
            </motion.div>
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                  What Our Users Say
                </span>
              </h2>
            </motion.div>
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Join thousands of happy users who've transformed their expense sharing experience.
              </p>
            </motion.div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp} {...scaleOnHover}>
                <Card className="hover:shadow-xl transition-all duration-500 border-slate-200 bg-white/80 backdrop-blur-sm h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">{testimonial.name}</CardTitle>
                        <CardDescription className="text-sm text-slate-600">{testimonial.role}</CardDescription>
                      </div>
                    </div>
                    <div className="flex space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-blue-400 text-blue-400" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <motion.div {...fadeInUp}>
              <Badge className="mb-6 bg-teal-50 text-teal-700 border-teal-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                Simple Pricing
              </Badge>
            </motion.div>
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-800 to-teal-600 bg-clip-text text-transparent">
                  Start Free, Scale When Ready
                </span>
              </h2>
            </motion.div>
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Choose the perfect plan for you and your group. All plans include our core features.
              </p>
            </motion.div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div key={index} variants={fadeInUp} {...scaleOnHover}>
                <Card className={`hover:shadow-xl transition-all duration-500 border-slate-200 bg-white/80 backdrop-blur-sm relative h-full ${
                  plan.popular ? 'ring-2 ring-blue-600 shadow-xl' : ''
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-1 shadow-lg">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-slate-800">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold">
                      <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                        ${plan.price}
                      </span>
                      <span className="text-lg font-normal text-slate-600">/month</span>
                    </div>
                    <CardDescription className="text-base text-slate-600">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0" />
                          <span className="text-sm text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className={`w-full py-3 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg' 
                          : 'border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Split Bills Smarter?
            </h2>
          </motion.div>
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto">
              Join thousands of users who've transformed their expense sharing. Start your free trial today and experience the future of bill splitting.
            </p>
          </motion.div>
          
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70 backdrop-blur-sm"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 whitespace-nowrap shadow-xl px-8 text-white"
              >
                Get Started Free
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <p className="text-sm opacity-70 mt-6">
              No credit card required • Free forever plan available • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-slate-900 text-white">
        <div className="container mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-12"
          >
            <motion.div variants={fadeInUp}>
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SM</span>
                </div>
                <h3 className="text-xl font-bold">SplitMates</h3>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                The intelligent way to split bills and manage shared expenses with AI-powered insights and real-time synchronization.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>

            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'API', 'Integrations', 'Security']
              },
              {
                title: 'Company',
                links: ['About', 'Blog', 'Careers', 'Contact', 'Press']
              },
              {
                title: 'Support',
                links: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Status', 'Community']
              }
            ].map((section, index) => (
              <motion.div key={section.title} variants={fadeInUp}>
                <h4 className="font-semibold mb-6 text-lg">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className="text-slate-400 hover:text-white transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400"
          >
            <p>&copy; 2025 SplitMates. All rights reserved. Built with ❤️ for better expense sharing.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}