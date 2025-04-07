import { Fragment, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  size = "md",
}: DialogProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "relative rounded-lg bg-card shadow-lg border border-border",
                sizeClasses[size],
                "w-full",
                className
              )}
            >
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-sm text-muted-foreground opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              )}

              {(title || description) && (
                <div className="px-6 pt-6">
                  {title && (
                    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                  )}
                  {description && (
                    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                  )}
                </div>
              )}

              <div className="p-6 pt-4">{children}</div>
            </motion.div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}