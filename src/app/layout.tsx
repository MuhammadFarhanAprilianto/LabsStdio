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
  title: "LabStdio - Agency.",
  description: "We design and build award-winning websites, SaaS platforms, and digital experiences that drive exponential growth.",
  icons: {
    icon: [
      { url: "/images/P-LOGO.webp", type: "image/webp" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/images/P-LOGO.webp",
    apple: "/images/P-LOGO.webp",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={questrial.variable}>
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
