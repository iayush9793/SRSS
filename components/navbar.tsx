"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
      setScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-md"
          : "bg-white/90 backdrop-blur-sm"
      )}
      style={{ zIndex: 50 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 flex items-center justify-center"
            >
              <Image
                src="/logo.png"
                alt="Shri Ramsewak Saxena Memorial Mahavidalaya Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </motion.div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              SRS Memorial Mahavidalaya
              </span>
          </Link>

          {/* Desktop Navigation - Light Grey Bar */}
          <div className="hidden lg:flex items-center">
            <div className="bg-gray-100 rounded-lg px-2 py-1 flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                    whileHover={{ y: -1 }}
                  className={cn(
                      "px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide transition-all duration-200",
                    pathname === item.href
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-700 hover:text-gray-900 hover:bg-white/50"
                  )}
                >
                  {item.name}
                </motion.div>
              </Link>
            ))}
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:text-gray-900 font-semibold"
            >
              <Link href="/login" className="flex items-center space-x-1">
                <ChevronRight className="h-3 w-3" />
                <span>LOGIN</span>
                <ChevronRight className="h-3 w-3 rotate-180" />
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold uppercase tracking-wide shadow-md"
            >
              <Link href="/contact" className="flex items-center space-x-1">
                <ChevronRight className="h-3 w-3" />
                <span>APPLY NOW</span>
              </Link>
            </Button>
          </div>

            {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            aria-expanded={isOpen}
            >
              {isOpen ? (
              <X className="h-6 w-6" />
              ) : (
              <Menu className="h-6 w-6" />
              )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Slide Menu */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Slide Menu from Top */}
      <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-16 left-0 right-0 bg-white shadow-2xl z-[70] lg:hidden overflow-y-auto max-h-[calc(100vh-4rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 space-y-4">
                {/* Mobile Logo */}
                <div className="flex items-center justify-center space-x-3 pb-4 border-b border-gray-200">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    SRS Memorial Mahavidalaya
                  </span>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                          "px-4 py-3 rounded-lg text-sm sm:text-base font-semibold uppercase tracking-wide transition-colors text-center",
                  pathname === item.href
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {item.name}
              </motion.div>
            </Link>
          ))}
                </div>

                {/* Mobile Action Buttons */}
                <div className="pt-4 space-y-2 border-t border-gray-200">
            <Button
              asChild
              variant="outline"
                    className="w-full justify-center font-semibold uppercase text-sm sm:text-base"
            >
              <Link href="/login" onClick={() => setIsOpen(false)}>
                      <ChevronRight className="h-4 w-4 mr-2" />
                      LOGIN
                      <ChevronRight className="h-4 w-4 ml-2 rotate-180" />
              </Link>
            </Button>
            <Button
              asChild
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold uppercase tracking-wide text-sm sm:text-base"
            >
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                      <ChevronRight className="h-4 w-4 mr-2" />
                      APPLY NOW
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
