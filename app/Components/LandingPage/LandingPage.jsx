
import { ArrowRight, Code2, Zap, Share2, Globe2, SquareMousePointer, QrCode, Layout } from "lucide-react"
import Image from "next/image"
import ThemeSlideshow from "./ThemeSlideshow"
import Navbar from "./Navbar"
import AuthButtons from "./AuthButtons"
import Link from "next/link"

export default function LandingPage() {
  // const PORTFOLIO = `http://liam-carter.localhost:3000`
  const PORTFOLIO = `https://liam-carter.dgtportfolio.com`
  // const PORTFOLIO = `https://liam-carter.dgtportfolio.vercel.app`

  return (
    <div id="top" className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0  opacity-5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300`}>
          <Navbar>
        <div className=" mx-auto md:mx-3 px-6 py-6 flex justify-between items-center">
          <Link href={"#top"}>
          <h1 className="flex items-center gap- text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent cursor-pointer">
            {/* <Sparkles className="w-6 h-6 text-white" /> */}
            <Image src={"/LogoinQrcode.png"} width={500} height={500} className="w-12 h-10" alt="DGT Portfolio - Professional Portfolio Builder" />
            DGTPortfolio
          </h1>
          </Link>
          <div className="hidden md:flex gap-8">
            <Link href={"#Features"} className="hover:text-cyan-400 transition">
              Features
            </Link>
            <Link href={PORTFOLIO} target="_blank" className="hover:text-cyan-400 transition">
              Showcase
            </Link>
            <Link href={"#pricing"} className="hover:text-cyan-400 transition">
              Pricing
            </Link>
          </div>
          <AuthButtons />
        </div>
          </Navbar>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-28 md:mx-5 md:pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Your Portfolio,
                </span>
                <br />
                <span className="text-white">Elevated </span>
              </h1>
              <p className="text-lg  text-gray-300 leading-relaxed">
                No code, no hassle. Just a clean, modern portfolio in minutes. <br />  
                Showcase your career, skills, projects, and work links like never before —
                 leave a lasting impression and unlock new opportunities.
                  <span className=" m-4 text-sm bg-gradient-to-r from-cyan-400 to-purple-500 text-black rounded-full px-3  py-1 font-semibold shadow-lg shadow-cyan-500/30">
                    Free for 7 days
                  </span>
              </p>
            </div>
            <div className="flex gap-4">
              <Link href={"/update-profile"} className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center gap-2">
                Start Building <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href={PORTFOLIO} target="_blank" className="px-8 py-4 border border-purple-500/50 rounded-full hover:bg-purple-500/10 transition">
                Watch Demo
              </Link>
            </div>
          </div>
          <ThemeSlideshow />
        </div>
      </section>

      {/* Features Section */}
      <section id="Features" className="px-6 pt-8 pb-8 md:py-12 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Why Choose DGT Portfolio</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to showcase your best work and land your dream opportunities
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Code2,
                title: "Code-Free Design",
                description: "Create stunning portfolios without writing a single line of code",
              },
              {
                icon: SquareMousePointer,
                title: "Custom Subdomain",
                description: (
                  <>Get a personalized subdomain like <strong>yourname.dgtportfolio.com</strong> for your portfolio</>
                ),
              },
              {
                icon: QrCode,
                title: "QR Code Profile",
                description: (
                  <>Generate a QR code for your portfolio that you can download or share instantly</>
                ),
              },
              {
                icon: Layout,
                title: "Multiple Themes",
                description: "Choose from different themes to personalize your portfolio look and feel",
              },
              {
                icon: Share2,
                title: "Easy Link Sharing",
                description: "Share your portfolio link anywhere with just one click",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Blazing fast load times that keep visitors engaged",
              },
            ].map((feature, i) => (
              <div
                key={i} 
                className={`p-8 rounded-2xl border transition-all duration-300 cursor-pointer 
                     hover:bg-purple-500/20 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20"
                     bg-slate-800/50 border-purple-500/20 
                `}>
                <feature.icon className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
        {/* Pricing / Offers Section */}
      <section id="pricing" className="px-6 py-20 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the perfect plan for your creative portfolio
            </p>
          </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          {
            name: "Monthly Plan",
            description: "$10 for the month after",
            price: "$1",
            period: "/first month",
            cta: "Subscribe Monthly",
            highlight: false,
          },
          {
            name: "4-Month Plan",
            description: "Great mid‑term offer",
            price: "$30",
            period: "/4 months",
            cta: "Subscribe 4 Months",
            highlight: false,
          },
          {
            name: "Annual Plan",
            description: "Best value",
            price: "$60",
            period: "/year",
            cta: "Subscribe Yearly",
            highlight: true,
          },
        ].map((plan, index) => (
          <div
            key={index}
            className={`relative p-8 rounded-2xl border transition-all duration-300 ${
              plan.highlight
                ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20 md:scale-105"
                : "bg-slate-800/50 border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-500/10"
            }`}
          >
            {/* Badge */}
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                  Recommended
                </span>
              </div>
            )}
  
            {/* Plan Name */}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
          
            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {plan.price}
                </span>
                <span className="text-gray-400">{plan.period}</span>
              </div>
            </div>
          
            {/* CTA Button */}
            <Link href="/subscription" className="block">
              <button
                className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-black hover:shadow-lg hover:shadow-cyan-500/50"
                    : "border border-purple-500/50 text-white hover:bg-purple-500/20 hover:border-purple-400"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
      


      {/* CTA Section */}
      <section className="px-6 py-20 border-t border-purple-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-3xl p-12">
            <h2 className="text-2xl md:text-5xl font-bold mb-6">Ready to Showcase Your Talent?</h2>
            <p className=" md:text-xl text-gray-300 mb-8">
              Join thousands of creators building their dream portfolios today
            </p>
            <Link className="text-sm md:text-base" href={"/update-profile"}>
            <button
             className=" px-10 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center gap-2 mx-auto">
              Create Your Portfolio <ArrowRight className="w-5 h-5" />
            </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 px-6 py-12 text-gray-400 text-center">
        <p> © {new Date().getFullYear()} <span className="font-semibold">DGT Portfolio</span>. All rights reserved.</p>
      </footer>
    </div>
  )
}
