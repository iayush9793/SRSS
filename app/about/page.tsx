"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Target, Heart, Lightbulb, Quote, Award, Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from "@/lib/animations";

const values = [
  {
    icon: Target,
    title: "Mission",
    description: "To provide exceptional education that prepares students for success in their careers and lives, fostering innovation, critical thinking, and global citizenship.",
  },
  {
    icon: Heart,
    title: "Values",
    description: "We believe in academic excellence, integrity, diversity, inclusion, and a commitment to student success and community engagement.",
  },
  {
    icon: Lightbulb,
    title: "Vision",
    description: "To be a leading educational institution recognized for academic excellence, innovative research, and transformative student experiences.",
  },
];

const leadership = [
  {
    name: "Dr. Sarah Johnson",
    role: "President",
    description: "20+ years of experience in higher education and academic leadership.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    name: "Dr. Michael Chen",
    role: "Provost",
    description: "Expert in academic affairs and curriculum development.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Dean of Students",
    description: "Passionate about student success and campus life.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    name: "Dr. David Kim",
    role: "Vice President of Research",
    description: "Leading research initiatives and faculty development.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
];

const milestones = [
  { year: "2012", event: "University Founded" },
  { year: "1975", event: "First Graduate Program" },
  { year: "1990", event: "Research Center Established" },
  { year: "2005", event: "International Partnerships" },
  { year: "2020", event: "Online Learning Platform" },
  { year: "2024", event: "50,000+ Alumni Network" },
];

export default function About() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-green-50/80 to-teal-50/80" />
          <Image
            src="https://source.unsplash.com/1920x1080/?university,building"
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
          style={{ y: y1, opacity }}
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
            About Our College
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto"
          >
            A legacy of excellence in education, innovation, and student success
            since 2012.
          </motion.p>
        </motion.div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={slideInLeft}>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Our History
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Founded in 2012, our college has been a beacon of academic
                excellence and innovation. We began as a
                small liberal arts college and have grown into a comprehensive
                institution offering programs across multiple disciplines.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Throughout our history, we've remained committed to our core
                mission: providing exceptional education that prepares students
                for success in their careers and lives. Our graduates have gone
                on to become leaders in their fields, making significant
                contributions to society.
              </p>
              <p className="text-lg text-muted-foreground">
                Today, we continue to innovate and adapt, embracing new
                technologies and teaching methods while maintaining our commitment
                to academic rigor and student success.
              </p>
            </motion.div>
            <motion.div variants={slideInRight} className="relative">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-emerald-100 to-green-100">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-green-400/20 to-teal-400/20" />
                <Image
                  src="https://source.unsplash.com/800x400/?university,architecture"
                  alt="University building"
                  fill
                  className="object-cover opacity-70"
                  unoptimized
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <Card className="p-8 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-primary/20">
                <Quote className="h-12 w-12 text-primary mb-4" />
                <p className="text-xl font-semibold mb-4">
                  "Education is the most powerful weapon which you can use to
                  change the world."
                </p>
                <p className="text-muted-foreground">
                  Our commitment to transformative education drives everything we
                  do.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Mission & Values
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              What drives us forward
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-2 hover:border-primary/50">
                    <CardHeader>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-16 h-16 gradient-text flex items-center justify-center rounded-2xl bg-primary/10 mb-4"
                      >
                        <Icon className="h-8 w-8 text-primary" />
                      </motion.div>
                      <CardTitle className="text-2xl">{value.title}</CardTitle>
                      <CardDescription className="text-base">
                        {value.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Leadership Section */}
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
              University Leadership
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Meet the dedicated leaders guiding our university
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {leadership.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 text-center overflow-hidden group">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-green-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-green-400/20 to-teal-400/20" />
                    <Image
                      src={`https://source.unsplash.com/400x400/?portrait,professional,${index === 0 ? 'woman' : index === 1 ? 'man' : index === 2 ? 'woman' : 'man'}`}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300 opacity-60"
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  </div>
                  <CardHeader>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20 -mt-10 relative z-10 bg-background"
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription className="text-primary font-semibold">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Milestones Section */}
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
              Our Journey
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Key milestones in our university's history
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-emerald-500 to-green-500" />
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className={`flex items-center ${
                      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <div className="w-1/2 pr-8">
                      {index % 2 === 0 && (
                        <Card className="p-6 hover:shadow-lg transition-shadow">
                          <div className="text-2xl font-bold text-primary mb-2">
                            {milestone.year}
                          </div>
                          <div className="text-lg">{milestone.event}</div>
                        </Card>
                      )}
                    </div>
                    <div className="relative z-10 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 border-4 border-background shadow-lg" />
                    <div className="w-1/2 pl-8">
                      {index % 2 !== 0 && (
                        <Card className="p-6 hover:shadow-lg transition-shadow">
                          <div className="text-2xl font-bold text-primary mb-2">
                            {milestone.year}
                          </div>
                          <div className="text-lg">{milestone.event}</div>
                        </Card>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Accreditation Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <Award className="h-16 w-16 text-primary mx-auto mb-6" />
              <motion.h2
                variants={fadeInUp}
                className="text-4xl sm:text-5xl font-bold mb-6"
              >
                Accredited Excellence
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-muted-foreground mb-8"
              >
                Our university is fully accredited by the regional accrediting
                body and maintains the highest standards of academic excellence.
                Our programs are recognized nationally and internationally for
                their quality and rigor.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
              >
                <Card className="p-6">
                  <div className="text-3xl font-bold gradient-text mb-2">100+</div>
                  <div className="text-muted-foreground">Accredited Programs</div>
                </Card>
                <Card className="p-6">
                  <div className="text-3xl font-bold gradient-text mb-2">50+</div>
                  <div className="text-muted-foreground">Years Accredited</div>
                </Card>
                <Card className="p-6">
                  <div className="text-3xl font-bold gradient-text mb-2">A+</div>
                  <div className="text-muted-foreground">Accreditation Rating</div>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Parallax Quote Section */}
      <section className="py-32 relative overflow-hidden">
        <motion.div
          style={{ y: y2 }}
          className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 opacity-10"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <Quote className="h-16 w-16 text-primary mx-auto mb-8" />
              <motion.p
                variants={fadeInUp}
                className="text-3xl sm:text-4xl font-bold mb-6"
              >
                "The future belongs to those who believe in the beauty of their
                dreams."
              </motion.p>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-muted-foreground"
              >
                We're not just educating students, we're shaping the future
                leaders of tomorrow.
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
