"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Microscope,
  Code,
  Palette,
  Briefcase,
  ArrowRight,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";

const programs = [
  {
    icon: BookOpen,
    title: "Bachelor of Arts (B.A.)",
    description: "Undergraduate degree program in Arts with multiple specializations.",
    features: [
      "3-year degree program",
      "Multiple specializations available",
      "Comprehensive curriculum",
      "Career opportunities",
    ],
    color: "from-emerald-500 to-green-500",
    department: "Arts",
  },
  {
    icon: Microscope,
    title: "Bachelor of Science (B.Sc.)",
    description: "Undergraduate degree program in Science with laboratory facilities.",
    features: [
      "3-year degree program",
      "Science specializations",
      "Laboratory facilities",
      "Research opportunities",
    ],
    color: "from-teal-500 to-cyan-500",
    department: "Sciences",
  },
  {
    icon: GraduationCap,
    title: "Bachelor of Education (B.Ed.)",
    description: "Professional teaching degree program preparing future educators.",
    features: [
      "2-year program",
      "Teaching certification",
      "Practical training",
      "Career placement",
    ],
    color: "from-green-500 to-emerald-500",
    department: "Education",
  },
  {
    icon: BookOpen,
    title: "Diploma in Elementary Education (D.El.Ed.)",
    description: "Elementary education diploma program for aspiring teachers.",
    features: [
      "2-year diploma program",
      "Elementary teaching focus",
      "Practical experience",
      "Teaching opportunities",
    ],
    color: "from-emerald-500 to-teal-500",
    department: "Education",
  },
];

const departments = [
  "Arts",
  "Sciences",
  "Education",
];

export default function Programs() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-green-50/80 to-teal-50/80" />
          <Image
            src="https://source.unsplash.com/1920x1080/?education,learning"
            alt="University campus"
            fill
            className="object-cover opacity-40"
            priority
            unoptimized
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-50/50 via-green-50/50 to-teal-50/50"
        />
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent"
          >
            Academic Programs
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
          >
            Explore our diverse range of undergraduate and graduate programs
            designed to prepare you for success.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button asChild size="lg" variant="gradient">
              <Link href="/contact">
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold mb-4"
            >
              Our Programs
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Choose from a wide range of academic programs across multiple
              disciplines
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 group overflow-hidden">
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-green-100">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-green-400/20 to-teal-400/20" />
                      <Image
                        src={`https://source.unsplash.com/800x400/?${index === 0 ? 'computer,technology' : index === 1 ? 'art,design' : index === 2 ? 'science,laboratory' : index === 3 ? 'business,meeting' : index === 4 ? 'books,library' : 'education,teaching'}`}
                        alt={program.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300 opacity-60"
                        unoptimized
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`absolute top-4 right-4 w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${program.color} shadow-lg`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </motion.div>
                    </div>
                    <CardHeader>
                      <div className="text-xs font-semibold text-primary mb-2">
                        {program.department}
                      </div>
                      <CardTitle className="text-2xl mb-2">
                        {program.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {program.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {program.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start text-sm text-muted-foreground"
                          >
                            <Award className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
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

      {/* Departments Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold mb-4"
            >
              Academic Departments
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Our programs are organized across three major academic departments
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {departments.map((dept, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 text-center p-6">
                  <CardTitle className="text-lg">{dept}</CardTitle>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
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
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-8"
            >
              Apply now and take the first step towards your academic and
              career goals.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" variant="gradient">
                <Link href="/contact">
                  Apply Now
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

