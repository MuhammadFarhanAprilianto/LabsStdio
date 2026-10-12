import type { Metadata } from "next";
import { Questrial } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import CustomCursor from "@/components/ui/CustomCursor";

const questrial = Questrial({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-questrial",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://labsstdio.com"),
  title: {
    default: "Labs Stdio — Design & Technology Studio",
    template: "%s | Labs Stdio",
  },
  description:
    "We design and engineer venture-grade SaaS platforms, headless web applications, and digital experiences that drive exponential growth.",
  keywords: [
    "Design Agency",
    "Full Stack Engineering",
    "SaaS Development",
    "Next.js Agency",
    "Product Design",
    "UI/UX Architecture",
  ],
  authors: [{ name: "Labs Stdio Engineering Team" }],
  creator: "Labs Stdio",
  publisher: "Labs Stdio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://labsstdio.com",
    siteName: "Labs Stdio",
    title: "Labs Stdio — Design & Technology Studio",
    description:
      "We design and engineer venture-grade SaaS platforms, headless web applications, and digital experiences.",
    images: [
      {
        url: "/images/P-LOGO.webp",
        width: 1200,
        height: 630,
        alt: "Labs Stdio Product Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Labs Stdio — Design & Technology Studio",
    description:
      "We design and engineer venture-grade SaaS platforms and digital experiences.",
    images: ["/images/P-LOGO.webp"],
    creator: "@labsstdio",
  },
  icons: {
    icon: [
      { url: "/images/P-LOGO.webp", type: "image/webp" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/images/P-LOGO.webp",
    apple: "/images/P-LOGO.webp",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Labs Stdio",
  alternateName: "Labs Studio",
  url: "https://labsstdio.com",
  logo: "https://labsstdio.com/images/P-LOGO.webp",
  description:
    "Venture-grade digital product studio crafting high-converting web apps, SaaS platforms, and enterprise design systems.",
  priceRange: "$$$$",
  address: {
    "@type": "PostalAddress",
    addressCountry: "SG",
  },
  sameAs: [
    "https://twitter.com/labsstdio",
    "https://linkedin.com/company/labsstdio",
    "https://github.com/labsstdio",
  ],
  knowsAbout: [
    "Next.js Architecture",
    "Full Stack Development",
    "SaaS Engineering",
    "UI/UX Design Systems",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={questrial.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-white text-gray-900 selection:bg-[#d4f938] selection:text-black">
        <SmoothScrollProvider>
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
