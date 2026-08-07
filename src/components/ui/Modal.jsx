import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Modal = ({
  isOpen = true,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg",
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      {/* Subtle, calm backdrop without harsh dark blurs */}
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={cn(
          "relative w-full bg-card text-foreground rounded-2xl border border-border/60 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150",
          maxWidth,
          className
        )}
      >
        {/* Header */}
        {(title || subtitle || onClose) && (
          <div className="px-6 pt-6 pb-4 flex items-start justify-between border-b border-border/40">
            <div>
              {title && (
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer -mr-1.5 -mt-1"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[78vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ModalFooter = ({ children, className }) => {
  return (
    <div
      className={cn(
        "px-6 py-4 bg-muted/20 border-t border-border/40 flex items-center justify-end gap-3 -mx-6 -mb-6 mt-6",
        className
      )}
    >
      {children}
    </div>
  );
};
