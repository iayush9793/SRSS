"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code,
  Palette,
  Smartphone,
  Search,
  ShoppingCart,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description:
      "Custom web applications built with modern technologies like Next.js, React, and TypeScript.",
    features: [
      "Responsive design",
      "Performance optimization",
      "SEO friendly",
      "Modern frameworks",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Beautiful, intuitive interfaces designed with user experience in mind.",
    features: [
      "User research",
      "Wireframing",
      "Prototyping",
      "Design systems",
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description:
      "Native and cross-platform mobile applications for iOS and Android.",
    features: [
      "Native apps",
      "Cross-platform",
      "App store optimization",
      "Push notifications",
    ],
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description:
      "Improve your search engine rankings and drive organic traffic to your site.",
    features: [
      "Keyword research",
      "On-page SEO",
      "Technical SEO",
      "Content strategy",
    ],
    color: "from-orange-500 to-red-500",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Solutions",
    description:
      "Complete e-commerce platforms with payment integration and inventory management.",
    features: [
      "Payment processing",
      "Inventory management",
      "Order tracking",
      "Analytics",
    ],
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Rocket,
    title: "Performance Optimization",
    description:
      "Speed up your website and improve user experience with performance optimization.",
    features: [
      "Speed optimization",
      "Image optimization",
      "Caching strategies",
      "CDN setup",
    ],
    color: "from-yellow-500 to-orange-500",
  },
];

export default function Services() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 opacity-50"
        />
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Our Services
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
          >
            Comprehensive solutions to help you build, grow, and succeed online.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button asChild size="lg" variant="gradient">
              <Link href="/contact">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 group">
                    <CardHeader>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} mb-4 group-hover:shadow-lg`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-2xl mb-2">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start text-sm text-muted-foreground"
                          >
                            <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        asChild
                      >
                        <Link href="/contact">
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold mb-6"
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-8"
            >
              Let's work together to bring your vision to life. Contact us today
              to discuss your project.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="gradient">
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

