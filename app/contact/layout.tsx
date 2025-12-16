import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with us for admissions inquiries, program information, or general questions. Our admissions office and departments are ready to assist you.",
  openGraph: {
    title: "Contact Us",
    description: "Get in touch with us for admissions inquiries, program information, or general questions.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

