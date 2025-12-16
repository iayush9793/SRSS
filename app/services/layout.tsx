import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Comprehensive solutions to help you build, grow, and succeed online.",
  openGraph: {
    title: "Services",
    description: "Comprehensive solutions to help you build, grow, and succeed online.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

