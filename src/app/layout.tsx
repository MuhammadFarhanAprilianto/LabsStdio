import type { Metadata } from "next";
import { Questrial } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const questrial = Questrial({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-questrial",
});

export const metadata: Metadata = {
  title: "LabsStdio",
  description: "Created with Next.js",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={questrial.variable}>
      <body className={`${questrial.className} antialiased bg-white text-gray-900`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
