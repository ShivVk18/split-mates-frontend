import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    if (isSwiping) return; // Prevent spam clicking
    const nextTheme = theme === "dark" ? "light" : "dark";
    setIsSwiping(true);

    // Swap theme at midpoint of sweep animation (half of 800ms = 400ms)
    setTimeout(() => {
      const root = window.document.documentElement;
      
      // Temporarily disable transitions to prevent paint jank
      root.classList.add("disable-transitions");
      
      setTheme(nextTheme);
      
      // Force a style reflow to apply the theme instantly
      window.getComputedStyle(root).opacity;
      
      // Restore transitions in the next frame
      requestAnimationFrame(() => {
        root.classList.remove("disable-transitions");
      });
    }, 400);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 cursor-pointer relative z-10"
        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {theme === "dark" ? (
          <Sun className="h-4.5 w-4.5 transition-all duration-200" />
        ) : (
          <Moon className="h-4.5 w-4.5 transition-all duration-200" />
        )}
      </Button>

      {/* Full screen wipe sweep overlay */}
      {isSwiping && createPortal(
        <motion.div
          initial={{ x: "-130%", skewX: -12 }}
          animate={{ x: "130%" }}
          transition={{ 
            duration: 0.8, 
            ease: [0.85, 0, 0.15, 1] 
          }}
          onAnimationComplete={() => setIsSwiping(false)}
          className="fixed -inset-y-10 -left-[10%] w-[140%] z-[99999] pointer-events-none transform-gpu bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-white"
        />,
        document.body
      )}
    </>
  );
}
