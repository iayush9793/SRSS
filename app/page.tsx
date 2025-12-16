"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, GraduationCap, BookOpen, Users, Award, Calendar, MapPin, Newspaper, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";
import { AnimatedCounter } from "@/components/animated-counter";

const highlights = [
  {
    icon: GraduationCap,
    title: "Academic Excellence",
    description: "World-class faculty and cutting-edge curriculum designed to prepare students for success.",
    image: "https://media.istockphoto.com/id/1329506024/photo/portrait-of-young-women-student-standing-isolated-over-yellow-background-stock-photo.jpg?b=1&s=612x612&w=0&k=20&c=gLs77dtmytKs2NO6HJ70OrVW442jJYU7Lgphkk11vZw=",
  },
  {
    icon: BookOpen,
    title: "Diverse Programs",
    description: "Over 100 undergraduate and graduate programs across various disciplines.",
    image: "https://media.istockphoto.com/id/592409216/photo/planning-every-step.jpg?s=612x612&w=0&k=20&c=hMwQ9ZACiIvMke3shoidniZBC9p2JjHTJd-IbnNIfq8=",
  },
  {
    icon: Users,
    title: "Vibrant Community",
    description: "Join a diverse community of students, faculty, and alumni from around the world.",
    image: "https://media.istockphoto.com/id/588999210/photo/indian-students-on-campus.jpg?s=612x612&w=0&k=20&c=tMygZZEKhdXTntz2qr_QFGI6xkaBSCsFPLLHVi5mPa8=",
  },
  {
    icon: Award,
    title: "Career Support",
    description: "Comprehensive career services and internship opportunities to launch your career.",
    image: "https://media.istockphoto.com/id/1097319206/photo/colleagues-communicate-with-work-questions-in-modern-office-space.jpg?s=612x612&w=0&k=20&c=LoJ9FN_s9W5xQomVuYD49lfAO0sXUPOSCtv9Ro620FQ=",
  },
];

const programs = [
  {
    name: "Bachelor of Arts (B.A.)",
    description: "Undergraduate degree in Arts",
    features: [
      "3-year degree program",
      "Multiple specializations",
      "Comprehensive curriculum",
      "Career opportunities",
    ],
    popular: true,
  },
  {
    name: "Bachelor of Science (B.Sc.)",
    description: "Undergraduate degree in Science",
    features: [
      "3-year degree program",
      "Science specializations",
      "Laboratory facilities",
      "Research opportunities",
    ],
    popular: false,
  },
  {
    name: "Bachelor of Education (B.Ed.)",
    description: "Professional teaching degree",
    features: [
      "2-year program",
      "Teaching certification",
      "Practical training",
      "Career placement",
    ],
    popular: false,
  },
  {
    name: "Diploma in Elementary Education (D.El.Ed.)",
    description: "Elementary education diploma",
    features: [
      "2-year diploma program",
      "Elementary teaching focus",
      "Practical experience",
      "Teaching opportunities",
    ],
    popular: false,
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Class of 2023, B.A.",
    content: "The college provided me with incredible opportunities and a supportive community that helped me grow both academically and personally.",
    rating: 5,
  },
  {
    name: "Arjun Patel",
    role: "Class of 2022, B.Sc.",
    content: "The faculty here are exceptional. They not only teach but mentor, and the career services helped me land my dream job.",
    rating: 5,
  },
  {
    name: "Ananya Singh",
    role: "Class of 2024, B.Ed.",
    content: "The research opportunities and state-of-the-art facilities make this college stand out. I'm grateful for my experience here.",
    rating: 5,
  },
];

const news = [
  {
    title: "New Research Center Opens",
    description: "State-of-the-art facility for advanced research in science and technology.",
    date: "March 15, 2024",
    category: "Campus News",
    image: "https://images.pexels.com/photos/16504390/pexels-photo-16504390.jpeg",
  },
  {
    title: "Spring Commencement Ceremony",
    description: "Join us in celebrating our graduating class of 2024.",
    date: "May 20, 2024",
    category: "Events",
    image: "https://media.istockphoto.com/id/664800464/photo/hug-on-graduation.jpg?s=612x612&w=0&k=20&c=yRlRHnBwWNFw6mdFDjBC3gQ9xUEmMJhOhyMc0GgZ65g=",
  },
  {
    title: "Scholarship Applications Open",
    description: "Apply now for merit-based and need-based scholarships for the upcoming academic year.",
    date: "April 1, 2024",
    category: "Admissions",
    image: "https://media.istockphoto.com/id/1056251530/photo/people-electronic-learning-education-knowledge.jpg?s=612x612&w=0&k=20&c=jN3-ElFbfO-MK7Z_pnWw4SGIImdu0c6gIjucp4g7fY8=",
  },
];

export default function Home() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-green-900/70 to-teal-900/70" />
          <Image
            src="/college-hero.png"
            alt="Shri Ramsewak Saxena Memorial Mahavidalaya"
            fill
            className="object-cover object-center"
            priority
            quality={90}
            sizes="100vw"
            style={{
              objectPosition: "center center",
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        
        {/* Animated Background Overlay */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-900/40 via-green-900/40 to-teal-900/40"
        />
        
        <motion.div
          style={{ opacity }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 sm:py-0"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-2xl leading-tight px-2"
            >
              Shri Ramsewak Saxena Memorial Mahavidalaya
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-6 sm:mb-8 max-w-2xl mx-auto font-semibold drop-shadow-lg px-4"
            >
              Affiliated to Bundelkhand University
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
            >
              <Button asChild size="lg" variant="gradient" className="group shadow-xl bg-white text-emerald-600 hover:bg-emerald-50 border-2 border-white text-sm sm:text-base w-full sm:w-auto">
                <Link href="/login" className="flex items-center justify-center">
                  <Shield className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                  <span className="whitespace-nowrap">Authenticate</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="group bg-white/90 hover:bg-white text-emerald-600 border-2 border-white shadow-xl text-sm sm:text-base w-full sm:w-auto">
                <Link href="/programs" className="flex items-center justify-center">
                  <span className="whitespace-nowrap">Explore Programs</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/90 hover:bg-white text-emerald-600 border-2 border-white shadow-xl text-sm sm:text-base w-full sm:w-auto">
                <Link href="/contact" className="whitespace-nowrap">Apply Now</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8"
          >
            {[
              { value: 900, suffix: "+", label: "Students" },
              { value: 55, suffix: "+", label: "Faculty" },
              { value: 15, suffix: "+", label: "Programs" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1920&q=80"
            alt="Library"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              Why Choose Us
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Discover what makes our college a leader in education
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-2 hover:border-primary/50 overflow-hidden group">
                    <div className="relative h-32 overflow-hidden bg-gradient-to-br from-emerald-100 to-green-100">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-green-400/20 to-teal-400/20" />
                      <Image
                        src={highlight.image}
                        alt={highlight.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        unoptimized
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    </div>
                    <CardHeader>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-12 h-12 gradient-text flex items-center justify-center rounded-lg bg-primary/10 mb-4 -mt-6 relative z-10"
                      >
                        <Icon className="h-6 w-6 text-primary" />
                      </motion.div>
                      <CardTitle>{highlight.title}</CardTitle>
                      <CardDescription>{highlight.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
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
              Academic Programs
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Explore our diverse range of academic programs
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {programs.map((program, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`h-full relative ${
                    program.popular
                      ? "border-primary border-2 shadow-xl"
                      : "hover:shadow-lg"
                  }`}
                >
                  {program.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{program.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {program.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {program.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <ArrowRight className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={program.popular ? "gradient" : "outline"}
                      className="w-full"
                      asChild
                    >
                      <Link href="/programs">Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* News & Events Section */}
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
              News & Events
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Stay updated with the latest news and events from our campus
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {news.map((item, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-green-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-green-400/20 to-teal-400/20" />
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-primary">
                        {item.category}
                      </span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {item.date}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="#">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              Student & Alumni Stories
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Hear from our students and alumni about their experiences
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Award
                          key={i}
                          className="h-5 w-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <CardDescription className="text-base">
                      "{testimonial.content}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}