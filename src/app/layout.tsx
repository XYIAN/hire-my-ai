import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "primereact/resources/themes/lara-dark-amber/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { PrimeReactAppProvider } from "@/lib/providers/prime-react-provider";
import { ToastProvider } from '@/components/toast-provider'

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HireMyAI - AI-Powered Cover Letter Generator",
  description: "Generate tailored cover letters, recruiter responses, and follow-up messages using AI. Stand out from the crowd with personalized content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <PrimeReactAppProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </PrimeReactAppProvider>
      </body>
    </html>
  );
}
