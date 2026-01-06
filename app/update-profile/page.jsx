"use client"
import { useContext, useState } from "react"
import { MyContext } from "../context/context"
import MagicalLoader from "../Components/MagicalLoader"
import Header from "../Components/LandingPage/header"
import Userinfo from "./components/Userinfo"
import About from "./components/About"
import Services from "./components/Services"
import Skills from "./components/Skills"
import Education from "./components/Education"
import Languages from "./components/Languages"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Bgcolor from "./components/Bgcolor"
import Socials from "./components/Socials"
import Theme from "./components/Theme"
import DisplayLanguage from "./components/DisplayLanguage"
import Certificates from "./components/Certificates"
import SectionOrdering from "./components/SectionOrdering"

export default function UpdateProfilePage() {
  const { EmailUser, userLinks, userDetails, setUserDetails, loadingAll } = useContext(MyContext)
  const [activeTab, setActiveTab] = useState("displayLanguage")

  if (loadingAll || !EmailUser || !userDetails) {
    return <MagicalLoader />
  }

  const tabs = [
    {
      id: "displayLanguage",
      label: {
        en: "🌍 Display Lang",
        fr: "🌍 Langue d'affichage",
        es: "🌍 Idioma de visualización",
        ar: "🌍 لغة العرض",
        de: "🌍 Anzeigesprache",
        ru: "🌍 Язык отображения",
        ja: "🌍 表示言語",
        zh: "🌍 显示语言",
        nl: "🌍 Weergavetaal",
        pt: "🌍 Idioma de Exibição",
        it: "🌍 Lingua Visualizzazione",
        hi: "🌍 प्रदर्शन भाषा",
        tr: "🌍 Görüntüleme Dili",
        ko: "🌍 표시 언어",
        id: "🌍 Bahasa Tampilan",
        pl: "🌍 Język wyświetlania",
      },
      component: DisplayLanguage,
    },
    {
      id: "about",
      label: {
        en: "📝 About",
        fr: "📝 À propos",
        es: "📝 Acerca de",
        ar: "📝 نبذة",
        de: "📝 Über",
        ru: "📝 Обо мне",
        ja: "📝 について",
        zh: "📝 关于",
        nl: "📝 Over",
        pt: "📝 Sobre",
        it: "📝 Informazioni",
        hi: "📝 परिचय",
        tr: "📝 Hakkında",
        ko: "📝 정보",
        id: "📝 Tentang",
        pl: "📝 O mnie",
      },
      component: About,
    },
    {
      id: "skills",
      label: {
        en: "💡 Skills",
        fr: "💡 Compétences",
        es: "💡 Habilidades",
        ar: "💡 المهارات",
        de: "💡 Fähigkeiten",
        ru: "💡 Навыки",
        ja: "💡 スキル",
        zh: "💡 技能",
        nl: "💡 Vaardigheden",
        pt: "💡 Habilidades",
        it: "💡 Competenze",
        hi: "💡 कौशल",
        tr: "💡 Yetenekler",
        ko: "💡 기술",
        id: "💡 Keahlian",
        pl: "💡 Umiejętności",
      },
      component: Skills,
    },
    {
      id: "services",
      label: {
        en: "💼 Services",
        fr: "💼 Services",
        es: "💼 Servicios",
        ar: "💼 الخدمات",
        de: "💼 Dienstleistungen",
        ru: "💼 Услуги",
        ja: "💼 サービス",
        zh: "💼 服务",
        nl: "💼 Diensten",
        pt: "💼 Serviços",
        it: "💼 Servizi",
        hi: "💼 सेवाएं",
        tr: "💼 Hizmetler",
        ko: "💼 서비스",
        id: "💼 Layanan",
        pl: "💼 Usługi",
      },
      component: Services,
    },
    {
      id: "education",
      label: {
        en: "🎓 Education",
        fr: "🎓 Éducation",
        es: "🎓 Educación",
        ar: "🎓 التعليم",
        de: "🎓 Bildung",
        ru: "🎓 Образование",
        ja: "🎓 学歴",
        zh: "🎓 教育",
        nl: "🎓 Opleiding",
        pt: "🎓 Educação",
        it: "🎓 Istruzione",
        hi: "🎓 शिक्षा",
        tr: "🎓 Eğitim",
        ko: "🎓 교육",
        id: "🎓 Pendidikan",
        pl: "🎓 Edukacja",
      },
      component: Education,
    },
    {
      id: "experience",
      label: {
        en: "⭐ Experience",
        fr: "⭐ Expérience",
        es: "⭐ Experiencia",
        ar: "⭐ الخبرة",
        de: "⭐ Erfahrung",
        ru: "⭐ Опыт",
        ja: "⭐ 経験",
        zh: "⭐ 经验",
        nl: "⭐ Ervaring",
        pt: "⭐ Experiência",
        it: "⭐ Esperienza",
        hi: "⭐ अनुभव",
        tr: "⭐ Deneyim",
        ko: "⭐ 경력",
        id: "⭐ Pengalaman",
        pl: "⭐ Doświadczenie",
      },
      component: Experience,
    },
    {
      id: "projects",
      label: {
        en: "🚀 Projects",
        fr: "🚀 Projets",
        es: "🚀 Proyectos",
        ar: "🚀 المشاريع",
        de: "🚀 Projekte",
        ru: "🚀 Проекты",
        ja: "🚀 プロジェクト",
        zh: "🚀 项目",
        nl: "🚀 Projecten",
        pt: "🚀 Projetos",
        it: "🚀 Progetti",
        hi: "🚀 परियोजनाएं",
        tr: "🚀 Projeler",
        ko: "🚀 프로젝트",
        id: "🚀 Proyek",
        pl: "🚀 Projekty",
      },
      component: Projects,
    },
    {
      id: "certificates",
      label: {
        en: "🏅 Certificates",
        fr: "🏅 Certificats",
        es: "🏅 Certificados",
        ar: "🏅 الشهادات",
        de: "🏅 Zertifikate",
        ru: "🏅 Сертификаты",
        ja: "🏅 証明書",
        zh: "🏅 证书",
        nl: "🏅 Certificaten",
        pt: "🏅 Certificados",
        it: "🏅 Certificati",
        hi: "🏅 प्रमाण पत्र",
        tr: "🏅 Sertifikalar",
        ko: "🏅 자격증",
        id: "🏅 Sertifikat",
        pl: "🏅 Certyfikaty",
      },
      component: Certificates,
    },
    {
      id: "languages",
      label: {
        en: "🌐 Languages",
        fr: "🌐 Langues",
        es: "🌐 Idiomas",
        ar: "🌐 اللغات",
        de: "🌐 Sprachen",
        ru: "🌐 Языки",
        ja: "🌐 言語",
        zh: "🌐 语言",
        nl: "🌐 Talen",
        pt: "🌐 Idiomas",
        it: "🌐 Lingue",
        hi: "🌐 भाषाएं",
        tr: "🌐 Diller",
        ko: "🌐 언어",
        id: "🌐 Bahasa",
        pl: "🌐 Języki",
      },
      component: Languages,
    },
    {
      id: "socials",
      label: {
        en: "🔗 Socials",
        fr: "🔗 Réseaux sociaux",
        es: "🔗 Redes sociales",
        ar: "🔗 الشبكات الاجتماعية",
        de: "🔗 Soziale Medien",
        ru: "🔗 Соцсети",
        ja: "🔗 ソーシャル",
        zh: "🔗 社交",
        nl: "🔗 Socials",
        pt: "🔗 Redes Sociais",
        it: "🔗 Social",
        hi: "🔗 सोशल मीडिया",
        tr: "🔗 Sosyal Medya",
        ko: "🔗 소셜 미디어",
        id: "🔗 Sosial",
        pl: "🔗 Społeczności",
      },
      component: Socials,
    },
    {
      id: "bgcolor",
      label: {
        en: "🎨 Bgcolor",
        fr: "🎨 Couleur de fond",
        es: "🎨 Color de fondo",
        ar: "🎨 لون الخلفية",
        de: "🎨 Hintergrundfarbe",
        ru: "🎨 Цвет фона",
        ja: "🎨 背景色",
        zh: "🎨 背景颜色",
        nl: "🎨 Achtergrondkleur",
        pt: "🎨 Cor de Fundo",
        it: "🎨 Colore Sfondo",
        hi: "🎨 पृष्ठभूमि रंग",
        tr: "🎨 Arka Plan Rengi",
        ko: "🎨 배경색",
        id: "🎨 Warna Latar",
        pl: "🎨 Kolor tła",
      },
      component: Bgcolor,
    },
    {
      id: "theme",
      label: {
        en: "🧩 Theme",
        fr: "🧩 Thème",
        es: "🧩 Tema",
        ar: "🧩 القوالب",
        de: "🧩 Thema",
        ru: "🧩 Тема",
        ja: "🧩 テーマ",
        zh: "🧩 主题",
        nl: "🧩 Thema",
        pt: "🧩 Tema",
        it: "🧩 Tema",
        hi: "🧩 थीम",
        tr: "🧩 Tema",
        ko: "🧩 테마",
        id: "🧩 Tema",
        pl: "🧩 Motyw",
      },
      component: Theme,
    },
    {
      id: "sectionOrdering",
      label: {
        en: "🏗 Arrangement",
        fr: "🏗 Disposition",
        es: "🏗 Disposición",
        ar: "🏗 الترتيب",
        de: "🏗 Anordnung",
        ru: "🏗 Расположение",
        ja: "🏗 配置",
        zh: "🏗 排列",
        nl: "🏗 Rangschikking",
        pt: "🏗 Disposição",
        it: "🏗 Disposizione",
        hi: "🏗 व्यवस्था",
        tr: "🏗 Düzenleme",
        ko: "🏗 배치",
        id: "🏗 Urutan",
        pl: "🏗 Układ",
      },
      component: SectionOrdering,
    },
  ].map((tab) => ({
    ...tab,
    label: tab.label[userDetails?.displayLanguage || "en"],
  }))

  const currentTab = tabs.find((tab) => tab.id === activeTab)
  const CurrentComponent = currentTab?.component

  return (
    <section>
      <Header lang={userDetails?.displayLanguage} />
      <div
        style={{ backgroundColor: userDetails.bgcolorp }}
        dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
        className="flex items-center justify-center pt-4 pb-6 duration-300 min-h-screen"
      >
        <div className="w-full max-w-5xl">
          <div className="md:mx-4 px-2 md:px-8 pb-14 bg-white rounded-2xl shadow-2xl space-y-8 pt-8">
            <Userinfo userData={userDetails} setUserDetails={setUserDetails} />
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`md:px-4 py-2 rounded-lg font-semibold transition-all text-xs md:text-base ${activeTab === tab.id
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } ${userDetails.theme !== 1 && tab.id === "bgcolor" ? "hidden" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="text-xs md:text-base">
              {userDetails && CurrentComponent && <CurrentComponent setUserDetails={setUserDetails} userData={userDetails} userLinks={userLinks} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
