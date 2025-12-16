import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academic Programs",
  description: "Explore our diverse range of undergraduate and graduate programs across multiple disciplines including Engineering, Arts, Sciences, Business, and Education.",
  openGraph: {
    title: "Academic Programs",
    description: "Explore our diverse range of undergraduate and graduate programs across multiple disciplines.",
  },
};

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

