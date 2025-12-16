import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { BackToTop } from "@/components/back-to-top";
import { InstallPrompt } from "@/components/install-prompt";
import { SWRegister } from "@/app/sw-register";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Shri Ramsewak Saxena Memorial Mahavidalaya",
    template: "%s | Shri Ramsewak Saxena Memorial Mahavidalaya",
  },
  description: "Affiliated to Bundelkhand University. Offering B.A., B.Sc., B.Ed., and D.El.Ed. programs. Located in Madnepur, Kuthond, District-Jalaun.",
  keywords: ["college", "education", "Bundelkhand University", "B.A.", "B.Sc.", "B.Ed.", "D.El.Ed.", "Jalaun"],
  authors: [{ name: "Shri Ramsewak Saxena Memorial Mahavidalaya" }],
  creator: "Shri Ramsewak Saxena Memorial Mahavidalaya",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shri Ramsewak Saxena Memorial Mahavidalaya",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-college-website.com",
    siteName: "Shri Ramsewak Saxena Memorial Mahavidalaya",
    title: "Shri Ramsewak Saxena Memorial Mahavidalaya",
    description: "Affiliated to Bundelkhand University. Offering B.A., B.Sc., B.Ed., and D.El.Ed. programs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shri Ramsewak Saxena Memorial Mahavidalaya",
    description: "Affiliated to Bundelkhand University. Offering B.A., B.Sc., B.Ed., and D.El.Ed. programs.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={`${rubik.variable} font-sans antialiased`}>
        <SWRegister />
        <AuthProvider>
            <ScrollProgress />
            <Navbar />
            <main className="min-h-screen pt-16">
              {children}
            </main>
            <Footer />
            <BackToTop />
            <InstallPrompt />
        </AuthProvider>
      </body>
    </html>
  );
}
