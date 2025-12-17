"use client"
import { useState, useEffect } from 'react'
import { ArrowLeft, LifeBuoy, User, CreditCard, Globe, ChevronDown } from "./Icons"
import Link from "next/link"

const translations = {
  en: {
    title: "Account Not Found",
    description: "We couldn't locate the account you're looking for. It might be renamed or the user hasn't subscribed",
    subscribe: "Subscribe Now",
    returnHome: "Return to Home page",
    contactSupport: "Contact Support",
    rights: "All rights reserved."
  },
  fr: {
    title: "Compte introuvable",
    description: "Nous n'avons pas pu trouver le compte que vous recherchez. Il a peut-être été renommé ou l'utilisateur n'est pas abonné",
    subscribe: "S'abonner maintenant",
    returnHome: "Retour à l'accueil",
    contactSupport: "Contacter le support",
    rights: "Tous droits réservés."
  },
  ar: {
    title: "الحساب غير موجود",
    description: "لم نتمكن من العثور على الحساب الذي تبحث عنه. ربما تم تغيير اسمه أو أن المستخدم غير مشترك",
    subscribe: "اشترك الآن",
    returnHome: "العودة إلى الصفحة الرئيسية",
    contactSupport: "الاتصال بالدعم",
    rights: "جميع الحقوق محفوظة."
  },
  de: {
    title: "Konto nicht gefunden",
    description: "Wir konnten das gesuchte Konto nicht finden. Es wurde möglicherweise umbenannt oder der Benutzer hat kein Abonnement",
    subscribe: "Jetzt abonnieren",
    returnHome: "Zurück zur Startseite",
    contactSupport: "Support kontaktieren",
    rights: "Alle Rechte vorbehalten."
  },
  ru: {
    title: "Аккаунт не найден",
    description: "Мы не смогли найти аккаунт, который вы ищете. Возможно, он был переименован или пользователь не подписан",
    subscribe: "Подписаться сейчас",
    returnHome: "Вернуться на главную",
    contactSupport: "Связаться с поддержкой",
    rights: "Все права защищены."
  },
  ja: {
    title: "アカウントが見つかりません",
    description: "お探しのアカウントが見つかりませんでした。名前が変更されたか、ユーザーが登録していない可能性があります",
    subscribe: "今すぐ登録",
    returnHome: "ホームページに戻る",
    contactSupport: "サポートに連絡",
    rights: "無断複写・転載を禁じます。"
  },
  zh: {
    title: "未找到帐户",
    description: "我们找不到您要查找的帐户。它可能已被重命名，或者用户尚未订阅",
    subscribe: "立即订阅",
    returnHome: "返回首页",
    contactSupport: "联系支持",
    rights: "版权所有。"
  },
  es: {
    title: "Cuenta no encontrada",
    description: "No pudimos encontrar la cuenta que buscas. Puede haber sido renombrada o el usuario no se ha suscrito",
    subscribe: "Suscribirse ahora",
    returnHome: "Volver a la página de inicio",
    contactSupport: "Contactar soporte",
    rights: "Todos los derechos reservados."
  },
  nl: {
    title: "Account niet gevonden",
    description: "We konden het account dat u zoekt niet vinden. Het is mogelijk hernoemd of de gebruiker heeft geen abonnement",
    subscribe: "Nu abonneren",
    returnHome: "Terug naar startpagina",
    contactSupport: "Contact support",
    rights: "Alle rechten voorbehouden."
  },
  pt: {
    title: "Conta Não Encontrada",
    description: "Não conseguimos localizar a conta que você está procurando. Ela pode ter sido renomeada ou o usuário não está inscrito",
    subscribe: "Inscrever-se Agora",
    returnHome: "Voltar para Início",
    contactSupport: "Contatar Suporte",
    rights: "Todos os direitos reservados."
  },
  it: {
    title: "Account Non Trovato",
    description: "Non siamo riusciti a trovare l'account che stai cercando. Potrebbe essere stato rinominato o l'utente non è abbonato",
    subscribe: "Iscriviti Ora",
    returnHome: "Torna alla Home",
    contactSupport: "Contatta Supporto",
    rights: "Tutti i diritti riservati."
  },
  hi: {
    title: "खाता नहीं मिला",
    description: "हम वह खाता नहीं ढूंढ सके जिसे आप खोज रहे हैं। इसका नाम बदला जा सकता है या उपयोगकर्ता ने सदस्यता नहीं ली है",
    subscribe: "अभी सदस्यता लें",
    returnHome: "होम पेज पर लौटें",
    contactSupport: "समर्थन से संपर्क करें",
    rights: "सर्वाधिकार सुरक्षित।"
  },
  tr: {
    title: "Hesap Bulunamadı",
    description: "Aradığınız hesabı bulamadık. Yeniden adlandırılmış olabilir veya kullanıcı abone olmamış olabilir",
    subscribe: "Şimdi Abone Ol",
    returnHome: "Ana Sayfaya Dön",
    contactSupport: "Destek ile İletişime Geç",
    rights: "Tüm hakları saklıdır."
  },
  ko: {
    title: "계정을 찾을 수 없음",
    description: "찾으시는 계정을 찾을 수 없습니다. 이름이 변경되었거나 사용자가 구독하지 않았을 수 있습니다",
    subscribe: "지금 구독하기",
    returnHome: "홈페이지로 돌아가기",
    contactSupport: "고객 지원 문의",
    rights: "모든 권리 보유."
  }
}


export default function AccountNotFound() {
  const [lang, setLang] = useState('en')
  const [isLangOpen, setIsLangOpen] = useState(false)
  const t = translations[lang]

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
              <Globe className="h-4 w-4 text-gray-400" />
              <span>
                {/* Display label based on current lang */}
                {{
                  en: "English",
                  fr: "Français",
                  ar: "العربية",
                  de: "Deutsch",
                  ru: "Русский",
                  es: "Español",
                  pt: "Português",
                  nl: "Nederlands",
                  it: "Italiano",
                  tr: "Türkçe",
                  ko: "한국어",
                  zh: "中文",
                  ja: "日本語",
                  hi: "हिंदी",
                }[lang]}
              </span>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLangOpen && (
            <div className="custom-scrollbar absolute top-full right-0 mt-2 w-full bg-[#2a2e32] border border-[#00a896]/30 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 max-h-72 overflow-y-auto">
              {[
                { code: "en", label: "English" },
                { code: "fr", label: "Français" },
                { code: "ar", label: "العربية" },
                { code: "de", label: "Deutsch" },
                { code: "ru", label: "Русский" },
                { code: "es", label: "Español" },
                { code: "pt", label: "Português" },
                { code: "nl", label: "Nederlands" },
                { code: "it", label: "Italiano" },
                { code: "tr", label: "Türkçe" },
                { code: "ko", label: "한국어" },
                { code: "zh", label: "中文" },
                { code: "ja", label: "日本語" },
                { code: "hi", label: "हिंदी" },
              ].map((language) => (
                <div
                  key={language.code}
                  onClick={() => {
                    setLang(language.code);
                    setIsLangOpen(false);
                  }}
                  className={`px-4 py-2 text-sm text-gray-200 hover:bg-[#00a896]/20 hover:text-white cursor-pointer transition-colors flex items-center justify-between ${lang === language.code ? 'bg-[#00a896]/10 text-[#00a896]' : ''}`}
                >
                  {language.label}
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
          <h1 className="text-4xl font-bold text-white mb-4">{t.title}</h1>
          <p className="text-gray-400 text-lg mb-8">
            {t.description}
          </p>
          <div className="space-y-4">
            <Link href={"https://dgtportfolio.com/subscription"} className="w-full flex items-center justify-center gap-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105">
              <CreditCard className="mr-2 h-4 w-4" /> {t.subscribe}
            </Link>

            <Link href={"https://dgtportfolio.com/" + lang} className="w-full flex items-center justify-center gap-1 bg-[#00a896] hover:bg-[#008080] text-white py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t.returnHome}
            </Link>

            <Link href={"https://dgtportfolio.com/support"} className="w-full flex items-center justify-center gap-1 bg-white border border-[#00a896] text-[#00a896] hover:bg-[#00a896] hover:text-white py-2 px-4 rounded-md transition-all duration-300">
              <LifeBuoy className="mr-2 h-4 w-4" /> {t.contactSupport}
            </Link>
          </div>
        </div>
      </main>
      <footer className="hidden bg-[#2a2e32] text-center py-4 text-gray-400 text-sm z-10">
        <p>© {new Date().getFullYear()} DGT Portfolio. {t.rights}</p>
      </footer>
    </div>
  )
}