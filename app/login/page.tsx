"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useAuth } from "@/lib/auth-context";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});


export default function Login() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState("");
  const [resetLoading, setResetLoading] = React.useState(false);
  const [resetSuccess, setResetSuccess] = React.useState(false);
  const [resetError, setResetError] = React.useState("");
  const router = useRouter();
  const { signIn, user, resetPassword } = useAuth();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Load remembered email from localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const rememberedEmail = localStorage.getItem("rememberedEmail");
      if (rememberedEmail) {
        loginForm.setValue("email", rememberedEmail);
        setRememberMe(true);
      }
    }
  }, [loginForm]);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Handle remember me functionality
      if (rememberMe && typeof window !== "undefined") {
        localStorage.setItem("rememberedEmail", values.email);
      } else if (typeof window !== "undefined") {
        localStorage.removeItem("rememberedEmail");
      }

      const result = await signIn(values.email, values.password) as { success: boolean; user?: any; error?: string };
      
      if (result.success) {
        // Store user info if remember me is checked
        if (rememberMe && typeof window !== "undefined" && result.user) {
          localStorage.setItem("userEmail", result.user.email || values.email);
        }

        setSuccess("Login successful! Redirecting...");
        
        // Show success message briefly before redirect
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        // Use error message from manual auth
        setError(result.error || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError("");
    setResetSuccess(false);

    try {
      const result = await resetPassword(resetEmail) as { success: boolean; error?: string };
      if (result.success) {
        setResetSuccess(true);
        setResetEmail("");
      } else {
        setResetError(result.error || "Password reset is not available. Please contact administrator.");
      }
    } catch (err) {
      setResetError("An unexpected error occurred. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 opacity-50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-md mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Shri Ramsewak Saxena Memorial Mahavidalaya Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                  priority
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Shri Ramsewak Saxena Memorial Mahavidalaya
              </h2>
              <p className="text-sm text-muted-foreground">
                Affiliated to Bundelkhand University
              </p>
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center gap-2 border border-red-300">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2 border border-green-300">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}

                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(handleLogin)}
                    className="space-y-4"
                  >
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="email"
                                  placeholder="your.email@example.com"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  className="pl-10 pr-10"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                          />
                          <span className="text-muted-foreground">
                            Remember me
                          </span>
                        </label>
                        <Link
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsForgotPasswordOpen(true);
                            setResetEmail(loginForm.getValues("email") || "");
                          }}
                          className="text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        variant="gradient"
                        className="w-full rounded-lg relative overflow-hidden"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Signing in...
                          </span>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            {resetError && !resetSuccess && (
              <div className="p-3 bg-red-100 text-red-800 rounded-lg flex items-center gap-2 border border-red-300">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{resetError}</span>
              </div>
            )}
            {resetSuccess && (
              <div className="p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2 border border-green-300">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">
                  Password reset email sent! Please check your inbox and follow the instructions.
                </span>
              </div>
            )}
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="pl-10"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  disabled={resetLoading || resetSuccess}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsForgotPasswordOpen(false);
                  setResetEmail("");
                  setResetError("");
                  setResetSuccess(false);
                }}
                disabled={resetLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                className="flex-1"
                disabled={resetLoading || resetSuccess}
              >
                {resetLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : resetSuccess ? (
                  "Email Sent!"
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}