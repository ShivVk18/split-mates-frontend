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
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4" 
    >
      <div className="bg-background/80 backdrop-blur-md rounded-full shadow-md border border-border">
        <div className="flex h-12 items-center justify-center px-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigation('/')}
          >
            <div className="h-6 w-6 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-xs">SM</span>
            </div>
            <h1 className="text-sm font-bold text-foreground">
              SplitMates
            </h1>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}