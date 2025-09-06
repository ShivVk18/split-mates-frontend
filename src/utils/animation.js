export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const scaleOnHover = {
  whileHover: { scale: 1.05, y: -8 },
  transition: { duration: 0.2 }
}

export const headerVariants = {
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

export const slideInFromLeft = {
  initial: { x: -300 },
  animate: { x: 0 },
  exit: { x: -300 },
  transition: { duration: 0.3, ease: "easeInOut" }
}

export const mobileMenuVariants = {
  initial: { opacity: 0, scale: 0.95, y: -20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -20 },
  transition: { duration: 0.2, ease: "easeOut" }
}