import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Our University",
  description: "Learn about our university's history, mission, values, leadership, and accreditation. A legacy of excellence in education spanning over seven decades.",
  openGraph: {
    title: "About Our University",
    description: "Learn about our university's history, mission, values, leadership, and accreditation.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

