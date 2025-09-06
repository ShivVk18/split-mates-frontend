import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'

export function Navbar() {
    const navigation = useNavigate()
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4" 
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-full shadow-xl border-2" 
           style={{ 
             borderColor: '#93c5fd',
             animation: 'borderPulse 2s ease-in-out infinite',
             boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
           }}>
        <div className="flex h-14 items-center justify-center px-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2"
            onClick={()=> navigation('/')}
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">SM</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              SplitMates
            </h1>
          </motion.div>
        </div>
      </div>
      
      <style jsx='true'>{`
        @keyframes borderPulse {
          0%, 100% { border-color: #93c5fd; }
          50% { border-color: #3b82f6; }
        }
      `}</style>
    </motion.header>
  )
}