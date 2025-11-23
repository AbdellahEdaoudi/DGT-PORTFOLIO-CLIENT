import "./globals.css";
import { Inter, Prompt } from "next/font/google";
import { Toaster } from "../components/ui/sonner"
import { MyProvider } from "./Context/MyContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import NextAuthProvider from "./providers/NextAuthProvider";
import { Analytics } from "@vercel/analytics/react"
import Head from "next/head";
import Script from "next/script";

const inter = Inter({ subsets: ['latin'] });
const prompt = Prompt({ subsets: ['latin'], weight: '400' });

export const metadata = {
  title: "DGT PORTFOLIO – BUILD YOUR PROFESSIONAL PORTFOLIO ONLINE",
  description: "No code, no hassle. Just a clean, modern portfolio in minutes.Showcase your career, skills, projects, and work links like never before — leave a lasting impression and unlock new opportunities.",
  icons: {
    icon: "https://dgtportfolio.com/logo.png",
    shortcut: "https://dgtportfolio.com/logo.png",
    apple: "https://dgtportfolio.com/logo.png",
  },
  openGraph: {
    title: "DGT PORTFOLIO – BUILD YOUR PROFESSIONAL PORTFOLIO ONLINE",
    description: "No code, no hassle. Just a clean, modern portfolio in minutes.Showcase your career, skills, projects, and work links like never before — leave a lasting impression and unlock new opportunities.",
    url: "https://dgtportfolio.com",
    images: ["https://dgtportfolio.com/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DGT PORTFOLIO – BUILD YOUR PROFESSIONAL PORTFOLIO ONLINE",
    description: "No code, no hassle. Just a clean, modern portfolio in minutes.Showcase your career, skills, projects, and work links like never before — leave a lasting impression and unlock new opportunities.",
    images: ["https://dgtportfolio.com/logo.png"],
  },
};


export default function RootLayout({ children }) {
  return (
      <html className="scroll-smooth" lang="en">
        <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        </Head>
        <body className={`${prompt.className} min-h-screen scrollbar-none bg-gray-800 g-gradient-to-r from-blue-500 to-purple-500`}>
        {/* Structured Data Script */}
        <Script type="application/ld+json" id="structured-data">
        {`
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "DGT PORTFOLIO",
          "url": "https://dgtportfolio.com",
          "keywords": "DGT Portfolio, Portfolio Builder, Professional Portfolio, Showcase Skills, Interactive Portfolio",
          "description": "No code, no hassle. Just a clean, modern portfolio in minutes.Showcase your career, skills, projects, and work links like never before — leave a lasting impression and unlock new opportunities.",
          "image": "https://dgtportfolio.com/logo.png"
          }
        `}
        </Script>
        <NextAuthProvider>
          <MyProvider>
            {children}
        </MyProvider>
        </NextAuthProvider>
          <Toaster />
          <ToastContainer />
        <Analytics />
        </body>
      </html>
  );
}
