import "./globals.css";
import { Inter, Prompt } from "next/font/google";
import { Toaster } from "../components/ui/sonner"
import { MyProvider } from "./Context/MyContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import NextAuthProvider from "./providers/NextAuthProvider";
import { Analytics } from "@vercel/analytics/react"
import Head from "next/head";

const inter = Inter({ subsets: ['latin'] });
const prompt = Prompt({ subsets: ['latin'], weight: '400' });

// export const metadata = Metadata ;
// export const viewport = {
//   width: 'device-width',
//   initialScale: 0.9,
//   // maximumScale: 1,
//   // userScalable: false,
// };

export default function RootLayout({ children }) {
  return (
      <html className="scroll-smooth" lang="en">
        <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        </Head>
        <body className={`${prompt.className} min-h-screen scrollbar-none bg-gray-800 g-gradient-to-r from-blue-500 to-purple-500`}>
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
