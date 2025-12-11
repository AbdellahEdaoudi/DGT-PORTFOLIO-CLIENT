"use client"
import { useState, useEffect } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  FileDown,
  Loader,
  Award,
  Menu,
  X,
  ArrowUp,
} from "lucide-react"
import QrcodeProfile from "../../[username]/components/QrcodeProfile"
import UserLinks from "../../[username]/components/UserLinks"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "../../lib/translations"
import { PDFDownloadLink } from "@react-pdf/renderer"
import ResumePdf from "../../update-profile/components/ResumePdf"
import ImageModal from "../ImageModal"

export default function Themeone({ userDetails, userLinks, bgcolor }) {
  const { t } = useTranslation(userDetails?.displayLanguage || 'en')
  const [showQR, setShowQR] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div
      className="b min-h-screen relative overflow-hidden "
      style={{ backgroundColor: bgcolor || userDetails?.bgcolorp || "#OA3C4D" }}
      dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
    >

      <div className="">
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageSrc={selectedImage}
        />
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>



        {/* Full Screen Overlay Navigation */}
        <div className={`fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-3xl transition-all duration-500 overflow-y-auto ${isNavOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-8 relative">
            <button
              onClick={() => setIsNavOpen(false)}
              className="absolute top-6 right-6 md:top-10 md:right-10 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all duration-300 border border-white/10"
            >
              <X size={28} />
            </button>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 opacity-90 tracking-tight">{t('menu') || "Navigation"}</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
              {[
                { id: "services", label: t('services'), icon: "💼", condition: userDetails?.services?.length > 0 },
                { id: "experience", label: t('workExperience'), icon: "⭐", condition: userDetails?.experience?.length > 0 },
                { id: "skills", label: t('skills'), icon: "💡", condition: userDetails?.skills?.length > 0 },
                { id: "projects", label: t('projects'), icon: "📁", condition: userDetails?.projects?.length > 0 },
                { id: "education", label: t('education'), icon: "🎓", condition: userDetails?.education?.length > 0 },
                { id: "certificates", label: t('certificates'), icon: "📜", condition: userDetails?.certificates?.length > 0 },
                { id: "languages", label: t('languages'), icon: "🌍", condition: userDetails?.languages?.length > 0 },
              ]
                .filter(tab => tab.condition)
                .map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setIsNavOpen(false);
                      const element = document.getElementById(tab.id);
                      if (element) {
                        setTimeout(() => {
                          element.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 100);
                      }
                    }}
                    className={`group relative flex flex-col items-center justify-center p-6 md:p-8 gap-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-white/20
                    ${isNavOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                  `}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{tab.icon}</span>
                    <span className="text-base md:text-lg font-medium text-white/80 group-hover:text-white transition-colors">{tab.label}</span>
                  </button>
                ))}
            </div>


          </div>
        </div>

        {/* Artistic Side Navigation */}
        <div className="hidden">
          {[
            { id: "services", label: t('services'), icon: "💼", condition: userDetails?.services?.length > 0 },
            { id: "experience", label: t('workExperience'), icon: "⭐", condition: userDetails?.experience?.length > 0 },
            { id: "skills", label: t('skills'), icon: "💡", condition: userDetails?.skills?.length > 0 },
            { id: "projects", label: t('projects'), icon: "📁", condition: userDetails?.projects?.length > 0 },
            { id: "education", label: t('education'), icon: "🎓", condition: userDetails?.education?.length > 0 },
            { id: "certificates", label: t('certificates'), icon: <Award size={18} />, condition: userDetails?.certificates?.length > 0 },
            { id: "languages", label: t('languages'), icon: "🌍", condition: userDetails?.languages?.length > 0 },
          ]
            .filter(tab => tab.condition)
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  const element = document.getElementById(tab.id);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
                className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/20 hover:scale-110 transition-all duration-300"
              >
                <span className="text-white/70 group-hover:text-white transition-colors text-sm">{tab.icon}</span>

                {/* Tooltip Label */}
                <span className="absolute right-12 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                  {tab.label}
                </span>
              </button>
            ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 ">
          {/* Header section */}
          <section className="md:pt-8 pt-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Top toolbar */}
              <div className="flex md:flex-row flex-col gap-4 mb-5 justify-between items-center md:mb-10">
                <h1 className="text-white text-2xl font-bold cursor-pointer">
                  <Link href={"https://dgtportfolio.com"}>{t('portfolio')}</Link>
                </h1>
                <div className="flex gap-3">
                  {/* // Download CV */}
                  <PDFDownloadLink
                    document={<ResumePdf userData={userDetails} />}
                    title={(() => {
                      const translations = {
                        en: 'Download CV',
                        fr: 'Télécharger CV',
                        es: 'Descargar CV',
                        ar: 'تحميل السيرة الذاتية',
                        de: 'Lebenslauf herunterladen',
                        ru: 'Скачать резюме',
                        ja: '履歴書をダウンロード',
                        zh: '下载简历',
                      };
                      return translations[userDetails?.displayLanguage] || translations['en']
                    })()}
                    fileName={`cv.${userDetails?.username || 'resume'}.pdf`}
                    className=" text-white bg-white/10 hover:bg-white/20 font-bold px-5 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? (
                        <>
                          <Loader size={20} className="animate-spin" /> {t('loading') || 'Loading...'}
                        </>
                      ) : (
                        <>
                          <FileDown size={20} />
                        </>
                      )
                    }
                  </PDFDownloadLink>
                  {/* // Qrcode */}
                  <div
                    onClick={() => setShowQR(!showQR)}
                    className="flex items-center gap-2 px-2 cursor-pointer bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10"
                  >
                    <QrcodeProfile userDetails={userDetails} />
                  </div>
                  {/* // User Links */}
                  <div
                    className="flex items-center gap-2 px-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10"
                  >
                    <UserLinks lang={userDetails?.displayLanguage} userLinks={userLinks} />
                  </div>

                  {/* Menu Button in Header */}
                  <button
                    onClick={() => setIsNavOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10 font-medium"
                  >
                    <Menu size={20} />
                  </button>
                </div>
              </div>



              {/* Main profile card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 md:p-8 mb-8 hover:bg-white/15 transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-3 md:gap-8 items-start">
                  {/* Profile picture */}
                  <div className="flex-shrink-0 flex items-center gap-2 ">
                    <div className="relative w-24 h-24 md:w-40 md:h-40">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-full blur-xl"></div>
                      <Image width={500} height={500}
                        src={userDetails?.urlimage}
                        alt={userDetails?.fullname || "Profile Picture"}
                        className="relative w-full h-full rounded-full object-cover border-4 border-white/30 shadow-2xl"
                      />
                      {userDetails?.isOnline && (
                        <div className="absolute bottom-1 right-1 md:bottom-3 md:right-3 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>
                    <div className="md:hidden block mt-4">
                      <h2 className=" text-2xl  font-bold text-white mb-2">{userDetails?.fullname}</h2>
                      <p className="  text-lg text-white/80 mb-4">{userDetails?.category}</p>
                    </div>
                  </div>

                  {/* Profile info */}
                  <div className="flex-1">
                    <h2 className="md:block hidden text-3xl md:text-4xl font-bold text-white mb-2">{userDetails?.fullname}</h2>
                    <p className=" md:block hidden text-lg text-white/80 mb-4">{userDetails?.category}</p>
                    <p className="text-sm md:text-base text-white/70 leading-relaxed mb-4 max-w-2xl">{userDetails?.about}</p>

                    {/* Quick contact info */}
                    <div className="flex flex-wrap gap-4">
                      {userDetails?.country && (
                        <div className="flex items-center gap-2 text-white/80">
                          <MapPin size={18} />
                          <span>{userDetails.country}</span>
                        </div>
                      )}
                      {userDetails?.phoneNumber && (
                        <div className="flex items-center gap-2 text-white/80">
                          <Phone size={18} />
                          <a href={`tel:${userDetails?.phoneNumber}`} className="hover:text-white transition-colors">
                            {userDetails?.phoneNumber}
                          </a>
                        </div>
                      )}
                      {userDetails?.email && (
                        <div className="flex items-center gap-2 text-white/80">
                          <Mail size={18} />
                          <a href={`mailto:${userDetails?.email}`} className="hover:text-white transition-colors">
                            {userDetails?.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {userDetails && (
              <div className="max-w-4xl mx-auto">
                {/* Services */}
                {userDetails.services && userDetails.services.length > 0 && (
                  <div id="services" className="mb-12 scroll-mt-24">
                    <h3 className="text-2xl font-bold text-white mb-6">💼 {t('services')}</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {userDetails.services.map((service, idx) => (
                        <div
                          key={idx}
                          className="text-sm md:text-base bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 md:p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105"
                        >
                          <p className=" text-white/90 leading-relaxed">{service}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {userDetails.experience && userDetails.experience.length > 0 && (
                  <div id="experience" className="mb-12 scroll-mt-24">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      ⭐ {t('workExperience')}
                    </h3>
                    <div className="space-y-6">
                      {userDetails.experience?.map((exp, i) => (
                        <div
                          key={i}
                          className="p-4 md:p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:border-gray-400/50 transition"
                        >
                          <div className="flex gap-4 mb-4">
                            <Briefcase className="text-gray-400 flex-shrink-0" size={24} />
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-300">{exp.role}</h3>
                              <p className="text-gray-300 font-semibold">{exp.company}</p>
                              <p className="text-gray-400 text-sm">
                                {exp.startDate} - {exp.endDate}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm md:text-base text-gray-300 whitespace-pre-wrap">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {userDetails.skills && userDetails.skills.length > 0 && (
                  <div id="skills" className="mb-12 scroll-mt-24">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      💡 {t('skills')}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {userDetails.skills.map((skill, idx) => (
                        <div
                          key={idx}
                          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all duration-300"
                        >
                          <p className="text-white/90">{skill}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {userDetails.projects && userDetails.projects.length > 0 && (
                  <div id="projects" className="mb-12 scroll-mt-24">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      📁 {t('projects')}
                    </h3>
                    <div className="space-y-6">
                      {userDetails.projects.map((project, idx) => (
                        <div
                          key={idx}
                          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 group"
                        >
                          <div className="md:flex">
                            {project.image && (
                              <Image width={500} height={500}
                                src={project.image}
                                alt={project.title || "Project Image"}
                                onClick={() => setSelectedImage(project.image)}
                                className="w-full md:w-1/3 h-64 md:h-auto object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                              />
                            )}
                            <div className="p-6 flex-1">
                              <h4 className="text-lg md:text-xl font-bold text-white mb-2">{project.title}</h4>
                              <p onClick={() => setExpanded(!expanded)}
                                className={` text-sm md:text-base
                              text-white/80 mb-4 whitespace-pre-line cursor-pointer transition-all duration-300
                              ${expanded ? "line-clamp-none" : "line-clamp-3"}
                            `}
                              >
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies?.map((tech, i) => (
                                  <span
                                    key={i}
                                    className=" px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/80"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-300"
                              >
                                <Globe size={16} />
                                {t('viewProject')}
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {userDetails.education && userDetails.education.length > 0 && (
                  <div id="education" className="mb-12 text-sm md:text-base scroll-mt-24">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      🎓 {t('education')}
                    </h3>
                    <div className="space-y-4">
                      {userDetails.education.map((edu, idx) => (
                        <div
                          key={idx}
                          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 md:p-6 hover:bg-white/15 transition-all duration-300"
                        >
                          <div className="mb-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xl font-bold text-white">{edu.degree}</h4>
                              <span className="text-sm text-white/60">
                                {edu.startYear} - {edu.endYear}
                              </span>
                            </div>
                            <p className="text-white/80 font-semibold">{edu.school}</p>
                          </div>
                          {edu.field && (
                            <div className="mt-3 p-4 bg-black/30 rounded-lg border-l-4 border-white/30">
                              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{t('field')}</p>
                              <p className="text-sm md:text-base text-white/80 leading-relaxed">
                                {edu.field}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certificates */}
                {userDetails.certificates && userDetails.certificates.length > 0 && (
                  <div id="certificates" className="mb-12 text-sm md:text-base scroll-mt-24">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      📜 {t('certificates') || "Certificates"}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {userDetails.certificates.map((cert, idx) => (
                        <div
                          key={idx}
                          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300 group flex flex-col"
                        >
                          {cert.cfimage && (
                            <div className="relative h-56 w-full bg-gray-900/50 overflow-hidden cursor-pointer border-b border-white/10 flex items-center justify-center p-4" onClick={() => setSelectedImage(cert.cfimage)}>
                              <Image
                                src={cert.cfimage}
                                alt={cert.name || "Certificate Image"}
                                fill
                                className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                              />
                            </div>
                          )}
                          <div className="p-4 flex-1 flex flex-col">
                            {cert.description && (
                              <p className="text-white/90 font-medium text-base leading-relaxed whitespace-pre-wrap break-all">{cert.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {userDetails.languages && userDetails.languages.length > 0 && (
                  <div id="languages" className="mb-12 scroll-mt-24">
                    <h3 className="text-2xl font-bold text-white mb-6">🌍 {t('languages')}</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {userDetails.languages.map((lang, idx) => (
                        <div
                          key={idx}
                          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all duration-300"
                        >
                          <p className="text-white/90">{lang}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Media */}
                {userDetails.socials && Object.values(userDetails.socials).some(url => url) && (
                  <div className="mb-12">
                    <h3 className="text-2xl font-bold text-white mb-6">{t('followMe')}</h3>
                    <div className="flex gap-4 flex-wrap">
                      {[
                        { name: "linkedin", url: userDetails.socials.linkedin, icon: "/icons/linkedin.svg" },
                        { name: "github", url: userDetails.socials.github, icon: "/icons/github.svg" },
                        { name: "facebook", url: userDetails.socials.fb, icon: "/icons/facebook.svg" },
                        { name: "whatsapp", url: userDetails.socials.whatsapp, icon: "/icons/whatsapp.svg" },
                        { name: "tiktok", url: userDetails.socials.tiktok, icon: "/icons/tiktok.svg" },
                        { name: "reddit", url: userDetails.socials.reddit, icon: "/icons/reddit.svg" },
                        { name: "twitch", url: userDetails.socials.twitch, icon: "/icons/twitch.svg" },
                        { name: "instagram", url: userDetails.socials.instagram, icon: "/icons/instagram.svg" },
                        { name: "snapchat", url: userDetails.socials.snapchat, icon: "/icons/snapchat.svg" },
                        { name: "twitter", url: userDetails.socials.twitter, icon: "/icons/twitter.svg" },
                        { name: "youtube", url: userDetails.socials.youtube, icon: "/icons/youtube.svg" },
                        { name: "telegram", url: userDetails.socials.telegram, icon: "/icons/telegram.svg" },
                      ]
                        .filter((item) => item.url)
                        .map((item, i) => (
                          <a
                            key={i}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-white backdrop-blur-md border border-white/20 rounded-lg  transition-all duration-300"
                          >
                            <Image width={500} height={500} src={item.icon} alt={item.name || "Social Icon"} className="w-6 h-6" />
                          </a>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
              <p className="text-white/60">
                © {new Date().getFullYear()} {userDetails?.fullname}. {t('allRightsReserved')}.
              </p>
            </div>
          </footer>


          {/* Scroll To Top Button */}
          <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-40 p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full shadow-2xl hover:bg-white/20 hover:scale-110 transition-all duration-300 group ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
          >
            <ArrowUp size={24} />
          </button>
        </div>
      </div >
    </div >
  )
}