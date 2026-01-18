"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, Instagram } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

const footerLinks = {
  "Academic": [
    { name: "Programs", href: "/programs" },
    { name: "Admissions", href: "/contact" },
    { name: "Academic Calendar", href: "#" },
  ],
  "Campus": [
    { name: "About", href: "/about" },
    { name: "Campus Life", href: "#" },
    { name: "News & Events", href: "#" },
  ],
  "Resources": [
    { name: "Library", href: "#" },
    { name: "Student Services", href: "#" },
    { name: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  const [email, setEmail] = React.useState("");

  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
        >
          {/* Brand Section */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
              Shri Ramsewak Saxena Memorial Mahavidalaya
            </h3>
            <p className="text-muted-foreground mb-2 max-w-md">
              Affiliated to Bundelkhand University
            </p>
            <p className="text-muted-foreground mb-2 max-w-md">
              Madnepur, Kuthond, District-Jalaun
            </p>
            <p className="text-muted-foreground mb-2 max-w-md">
              Phone: 6263051362
            </p>
            <p className="text-muted-foreground mb-6 max-w-md">
              Phone: 7007620370
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <motion.div key={title} variants={fadeInUp}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter Section */}
          <motion.div variants={fadeInUp}>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Stay updated with campus news, events, and important announcements.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Handle newsletter signup
                setEmail("");
              }}
              className="space-y-2"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" variant="gradient">
                Subscribe
              </Button>
            </form>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center"
        >
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Shri Ramsewak Saxena Memorial Mahavidalaya. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

