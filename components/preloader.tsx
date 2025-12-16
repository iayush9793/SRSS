"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap } from "lucide-react";

export function Preloader() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    // Ensure preloader shows first
    setIsLoading(true);
    setProgress(0);

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            // Hide body overflow while loading
            document.body.style.overflow = "";
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    // Block body scroll while loading
    document.body.style.overflow = "hidden";

    // Also check if page is actually loaded
    if (typeof window !== "undefined") {
      const handleLoad = () => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = "";
        }, 500);
      };

      if (document.readyState === "complete") {
        handleLoad();
      } else {
        window.addEventListener("load", handleLoad);
      }

      return () => {
        clearInterval(interval);
        window.removeEventListener("load", handleLoad);
        document.body.style.overflow = "";
      };
    }

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl"
              >
                <GraduationCap className="h-10 w-10 text-white" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                University
              </motion.h2>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-muted rounded-full overflow-hidden mx-auto mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-muted-foreground"
            >
              {progress < 100 ? `Loading... ${progress}%` : "Welcome!"}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
