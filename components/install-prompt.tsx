"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    React.useState<BeforeInstallPromptEvent | null>(null);
  const [hasShown, setHasShown] = React.useState(false);

  React.useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Check if already shown in this session
    const shown = sessionStorage.getItem("install-prompt-shown");
    if (shown === "true") {
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
      setHasShown(true);
      sessionStorage.setItem("install-prompt-shown", "true");

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowPrompt(false);
      }, 5000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Also show prompt after a delay if not already shown
    const timer = setTimeout(() => {
      if (!hasShown) {
        setShowPrompt(true);
        setHasShown(true);
        sessionStorage.setItem("install-prompt-shown", "true");

        setTimeout(() => {
          setShowPrompt(false);
        }, 5000);
      }
    }, 2000);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      clearTimeout(timer);
    };
  }, [hasShown]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      alert(
        "To install this app:\n\n" +
          "Chrome/Edge: Click the menu (⋮) and select 'Install app'\n" +
          "Safari (iOS): Tap Share, then 'Add to Home Screen'\n" +
          "Firefox: Click the menu and select 'Install'"
      );
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[9998]"
        >
          <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Install Our App</h3>
                  <p className="text-sm text-muted-foreground">
                    Get quick access and offline support
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="h-8 w-8 rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                variant="gradient"
                className="flex-1 rounded-lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Install Now
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                className="rounded-lg"
              >
                Later
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

