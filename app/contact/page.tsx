"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from "@/lib/animations";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(3, {
    message: "Subject must be at least 3 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    description: "Call our main office",
    value: "6263051362",
    href: "tel:+916263051362",
  },
  {
    icon: Phone,
    title: "Phone",
    description: "Call our main office",
    value: "7007620370",
    href: "tel:+917007620370",
  },
  {
    icon: MapPin,
    title: "Campus Location",
    description: "Visit our campus",
    value: "Madnepur, Kuthond, District-Jalaun",
    href: "#",
  },
  {
    icon: Mail,
    title: "General Inquiries",
    description: "Email us for general information",
    value: "info@college.edu",
    href: "mailto:info@college.edu",
  },
];

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(values);
    setIsSubmitted(true);
    form.reset();
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-teal-50/90" />
          <Image
            src="https://source.unsplash.com/1920x1080/?university,contact"
            alt="University campus"
            fill
            className="object-cover opacity-30"
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
            Contact Us
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto"
          >
            Have questions about admissions, programs, or campus life? We're here to help.
          </motion.p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInLeft}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
                <p className="text-muted-foreground mb-8">
                  Reach out to us through any of these channels. Our admissions
                  office and departments are ready to assist you.
                </p>
              </div>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.a
                      key={index}
                      href={info.href}
                      whileHover={{ scale: 1.02, x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50">
                        <CardHeader>
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg mb-1">
                                {info.title}
                              </CardTitle>
                              <CardDescription>{info.description}</CardDescription>
                              <p className="text-sm font-medium mt-2">
                                {info.value}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRight}
              className="lg:col-span-2"
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-3xl mb-2">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below for admissions inquiries, program
                    information, or general questions. We'll respond as soon as
                    possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your.email@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="What's this about?"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us more about your project..."
                                  className="min-h-[150px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Button
                          type="submit"
                          size="lg"
                          variant="gradient"
                          className="w-full group"
                          disabled={form.formState.isSubmitting || isSubmitted}
                        >
                          {form.formState.isSubmitting ? (
                            "Sending..."
                          ) : isSubmitted ? (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Message Sent!
                            </>
                          ) : (
                            <>
                              Send Message
                              <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </Button>
                      </motion.div>

                      {isSubmitted && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 rounded-xl bg-green-50 border border-green-200"
                        >
                          <p className="text-sm text-green-800">
                            Thank you for your message! We'll get back to you
                            soon.
                          </p>
                        </motion.div>
                      )}
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

