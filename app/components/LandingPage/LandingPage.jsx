import { ArrowRight, Code2, Zap, Share2, Globe2, SquareMousePointer, QrCode, Layout, Check } from "../Icons"
import Image from "next/image"
import ThemeSlideshow from "./ThemeSlideshow"
import Navbar from "./Navbar"
import AuthButtons from "./AuthButtons"
import Link from "next/link"
import LanguageSwitcher from "./LanguageSwitcher"
import { getTranslation } from "../../translations/landing-page"

export default function LandingPage({ lang }) {
  const PORTFOLIO = `https://adam-carter.dgtportfolio.com`
  const t = getTranslation(lang || 'en');

  const featuresList = [
    { icon: Code2 },
    { icon: SquareMousePointer },
    { icon: QrCode },
    { icon: Layout },
    { icon: Share2 },
    { icon: Zap },
  ]

  const featuresItems = t('features.items') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0  opacity-5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Navigation */}
      <Navbar>
        <div className=" mx-auto md:mx-3 px-6 py-6 flex justify-between items-center relative">
          <Link href={"/"}>
            <div className="flex items-center gap-0.5 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent cursor-pointer">
              <Image src={"/Logowbg.png"} width={500} height={500} className="w-12 h-10" alt="DGT Portfolio - Personal Portfolio Builder" />
              <h1 className="md:block hidden">DGTPortfolio</h1>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href={"#Features"} className="hover:text-cyan-400 transition">
              {t('navbar.features')}
            </Link>
            <Link href={PORTFOLIO} target="_blank" className="hover:text-cyan-400 transition">
              {t('navbar.showcase')}
            </Link>
            <Link href={"#pricing"} className="hover:text-cyan-400 transition">
              {t('navbar.pricing')}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <AuthButtons lang={lang || 'en'} />
          </div>
        </div>
      </Navbar>
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-28 md:mx-5 md:pb-20 px-6 mb-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {t('hero.title_part1')}
                </span>
                <br />
                <span className="text-white">{t('hero.title_part2')}</span>
              </h1>
              <p className="text-lg  text-gray-300 leading-relaxed">
                {t('hero.description')}
                <span className=" m-4 text-sm bg-gradient-to-r from-cyan-400 to-purple-500 text-black rounded-full px-3  py-1 font-semibold shadow-lg shadow-cyan-500/30">
                  {t('hero.free_trial')}
                </span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={"/update-profile"} className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center justify-center gap-2 text-sm md:text-base">
                {t('hero.start_building')} <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
              <Link href={PORTFOLIO} target="_blank" className="px-6 py-3 md:px-8 md:py-4 border border-purple-500/50 rounded-full hover:bg-purple-500/10 transition text-center text-sm md:text-base">
                {t('hero.watch_demo')}
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
            <h2 className="text-5xl font-bold mb-4">{t('features.title')}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {Array.isArray(featuresItems) && featuresItems.map((feature, i) => {
              const Icon = featuresList[i]?.icon || Code2;
              return (
                <div
                  key={i}
                  className={`p-8 rounded-2xl border transition-all duration-300 cursor-pointer 
                     hover:bg-purple-500/20 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20"
                     bg-slate-800/50 border-purple-500/20 
                `}>
                  <Icon className="w-12 h-12 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400" dangerouslySetInnerHTML={{ __html: feature.description }} />
                </div>
              )
            })}
          </div>
        </div>
      </section>
      {/* Pricing / Offers Section */}
      <section id="pricing" className="px-6 py-20 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">{t('pricing.title') || "One Price. Lifetime Access."}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('pricing.subtitle') || "Get full access to your creative portfolio, forever. No subscriptions, no hidden fees."}
            </p>
          </div>

          {/* Pricing Card */}
          <div className="flex justify-center max-w-4xl mx-auto mt-8">
            <div className="relative w-full">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap shadow-md">
                  {t('pricing.recommended') || "Recommended"}
                </span>
              </div>

              <div className="rounded-3xl border shadow-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-400/50 shadow-cyan-500/20 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left: Price & CTA */}
                  <div className="p-8 pt-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-cyan-400/20">
                    <h3 className="text-2xl font-extrabold mb-2 text-white">
                      {t('pricing.lifetime.name') || "Lifetime Portfolio"}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      {t('pricing.lifetime.description') || "Everything you need to showcase your work online."}
                    </p>

                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          {lang === "ar" ? "١٠٠$" : "$100"}
                        </span>
                        <span className="text-gray-400">{t('pricing.lifetime.period') || "one-time"}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href="/payment" className="block w-full">
                      <button className="w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-black hover:shadow-lg hover:shadow-cyan-500/50">
                        {t('pricing.cta') || "Start Building Your Portfolio"}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </Link>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      {t('pricing.noFees') || "No subscription • No monthly fees • Yours forever"}
                    </p>
                  </div>

                  {/* Right: Features grid */}
                  <div className="p-8 pt-10 bg-slate-950/30 flex flex-col justify-center">
                    <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-4">
                      {t('pricing.whatsIncluded') || "What's included"}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                      {(t('pricing.features') || []).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm leading-snug">
                          <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 border-t border-purple-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-3xl md:p-12 p-6">
            <h2 className="text-2xl md:text-5xl font-bold mb-6">{t('cta.title')}</h2>
            <p className=" md:text-xl text-gray-300 mb-8">
              {t('cta.subtitle')}
            </p>
            <Link className="text-sm md:text-base" href={"/update-profile"}>
              <button
                className=" px-10 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center gap-2 mx-auto">
                {t('cta.button')} <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 px-6 py-12 text-gray-400 text-center">
        <p> © {new Date().getFullYear()} <span className="font-semibold">DGT Portfolio</span>. {t('footer.rights')}</p>
      </footer>
    </div>
  )
}
