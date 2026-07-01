"use client"
import "flag-icons/css/flag-icons.min.css"
import { useState, useEffect } from 'react'
import { ArrowLeft, LifeBuoy, User, CreditCard, Globe, ChevronDown } from "../Icons"
import Link from "next/link"
import { getTranslation } from "../../translations/others"

const LANGUAGES = [
  { code: "en", label: "English", country: "gb" },
  { code: "fr", label: "Français", country: "fr" },
  { code: "ar", label: "العربية", country: "sa" },
  { code: "de", label: "Deutsch", country: "de" },
  { code: "ru", label: "Русский", country: "ru" },
  { code: "es", label: "Español", country: "es" },
  { code: "pt", label: "Português", country: "pt" },
  { code: "nl", label: "Nederlands", country: "nl" },
  { code: "it", label: "Italiano", country: "it" },
  { code: "vi", label: "Tiếng Việt", country: "vn" },
  { code: "sv", label: "Svenska", country: "se" },
  { code: "hi", label: "हिंदी", country: "in" },
  { code: "tr", label: "Türkçe", country: "tr" },
  { code: "pl", label: "Polski", country: "pl" },
  { code: "id", label: "Bahasa Indonesia", country: "id" },
  { code: "ko", label: "한국어", country: "kr" },
  { code: "zh", label: "中文", country: "cn" },
  { code: "ja", label: "日本語", country: "jp" },
];

export default function AccountNotFound() {
  const [lang, setLang] = useState('en')
  const [isLangOpen, setIsLangOpen] = useState(false)
  const t = getTranslation(lang)

  const [particles, setParticles] = useState([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const generateParticles = () => {
      return Array.from({ length: 50 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
      }))
    }

    setParticles(generateParticles())

    const handleResize = () => {
      setParticles(generateParticles())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const moveParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
        }))
      )
    }

    const intervalId = setInterval(moveParticles, 50)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e2124] overflow-hidden relative" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 168, 150, 0.5);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #00a896;
        }
      `}} />
      <div className="absolute inset-0">
        {particles.map((particle, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-[#00a896]"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: 0.6,
              transform: `translate(${(mousePos.x - particle.x) / 20}px, ${(mousePos.y - particle.y) / 20}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          />
        ))}
      </div>
      <div className="absolute top-4 right-4 z-50">
        <div className="relative inline-block w-40">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="w-full flex items-center justify-between bg-[#1e2124]/80 text-white border border-[#00a896]/30 hover:border-[#00a896] rounded-xl py-2.5 pl-3 pr-3 focus:outline-none focus:ring-2 focus:ring-[#00a896]/50 transition-all duration-300 backdrop-blur-md shadow-lg text-sm font-medium cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className={`fi fi-${LANGUAGES.find(l => l.code === lang)?.country} text-lg rounded-[2px] shadow-sm`}></span>
              <span>
                {LANGUAGES.find(l => l.code === lang)?.label}
              </span>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLangOpen && (
            <div className="custom-scrollbar absolute top-full right-0 mt-2 w-full bg-[#2a2e32] border border-[#00a896]/30 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 max-h-72 overflow-y-auto">
              {LANGUAGES.map((language) => (
                <div
                  key={language.code}
                  onClick={() => {
                    setLang(language.code);
                    setIsLangOpen(false);
                  }}
                  className={`px-4 py-2 text-sm text-gray-200 hover:bg-[#00a896]/20 hover:text-white cursor-pointer transition-colors flex items-center justify-between ${lang === language.code ? 'bg-[#00a896]/10 text-[#00a896]' : ''}`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`fi fi-${language.country} text-lg rounded-[2px] shadow-sm`}></span>
                    {language.label}
                  </span>
                  {lang === language.code && <div className="h-1.5 w-1.5 rounded-full bg-[#00a896]" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <main className="flex-grow flex items-start  justify-center px-4 z-10">
        <div className="max-w-md w-full text-center bg-[#2a2e32] p-8 rounded-lg shadow-2xl backdrop-blur-sm bg-opacity-80">
          <div className="mb-6 relative">
            <div className="w-24 h-24 mx-auto bg-[#00a896] rounded-full flex items-center justify-center overflow-hidden">
              <User className="text-[#1e2124] w-16 h-16" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{t('accountNotFound.title')}</h1>
          <p className="text-gray-400 text-lg mb-8">
            {t('accountNotFound.description')}
          </p>
          <div className="space-y-4">
            <Link href={"https://dgtportfolio.com/payment"} className="w-full flex items-center justify-center gap-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105">
              <CreditCard className="mr-2 h-4 w-4" /> {t('accountNotFound.payment')}
            </Link>

            <Link href={"https://dgtportfolio.com/" + lang} className="w-full flex items-center justify-center gap-1 bg-[#00a896] hover:bg-[#008080] text-white py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('accountNotFound.returnHome')}
            </Link>

            <Link href={"https://dgtportfolio.com/support"} className="w-full flex items-center justify-center gap-1 bg-white border border-[#00a896] text-[#00a896] hover:bg-[#00a896] hover:text-white py-2 px-4 rounded-md transition-all duration-300">
              <LifeBuoy className="mr-2 h-4 w-4" /> {t('accountNotFound.contactSupport')}
            </Link>
          </div>
        </div>
      </main>
      <footer className="hidden bg-[#2a2e32] text-center py-4 text-gray-400 text-sm z-10">
        <p>© {new Date().getFullYear()} DGT Portfolio. {t('accountNotFound.rights')}</p>
      </footer>
    </div>
  )
}