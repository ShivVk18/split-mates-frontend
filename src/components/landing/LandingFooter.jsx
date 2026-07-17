import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingFooter() {
  return (
    <footer className="bg-background border-t border-border py-16 px-6 z-10 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Col */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">SM</span>
            </div>
            <span className="font-bold text-sm text-foreground">SplitMates</span>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
            The intelligent way to split bills and manage shared expenses with AI-powered insights and real-time synchronization.
          </p>
          <div className="flex space-x-2 pt-1">
            <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent/60">
              <Twitter className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent/60">
              <Github className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent/60">
              <Linkedin className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Product</h4>
          <ul className="space-y-2 text-xs text-muted-foreground/80">
            <li><a href="#features" className="hover:text-foreground transition-colors duration-150">Features</a></li>
            <li><a href="#pricing" className="hover:text-foreground transition-colors duration-150">Pricing</a></li>
            <li><a href="#timeline" className="hover:text-foreground transition-colors duration-150">Timeline</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Company</h4>
          <ul className="space-y-2 text-xs text-muted-foreground/80">
            <li><a href="#" className="hover:text-foreground transition-colors duration-150">About Us</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors duration-150">Security</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors duration-150">Contact</a></li>
          </ul>
        </div>

        {/* Links Column 3 */}
        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Legal</h4>
          <ul className="space-y-2 text-xs text-muted-foreground/80">
            <li><a href="#" className="hover:text-foreground transition-colors duration-150">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors duration-150">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-border/60 mt-12 pt-6 text-center text-[10px] text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SplitMates. All rights reserved. Built with ❤️ for seamless expense sharing.</p>
      </div>
    </footer>
  );
}
