"use client"
import { useState } from "react"
import { Mail, Code2, Briefcase, GraduationCap, Globe, Sparkles, User, Layers, Zap, Loader, FileDown } from "lucide-react"
import QrcodeProfile from "../../[username]/components/QrcodeProfile"
import UserLinks from "../../[username]/components/UserLinks"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "../../lib/translations"
import { PDFDownloadLink } from "@react-pdf/renderer"
import ResumePdf from "../../update-profile/components/ResumePdf"
import ImageModal from "../ImageModal"

export default function ThemeTwo({ userDetails, userLinks }) {
  const { t } = useTranslation(userDetails?.displayLanguage || 'en')
  const [activeTab, setActiveTab] = useState("about")
  const [showQR, setShowQR] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div
      style={{ backgroundColor: "#0D131C" }}
      dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen text-white overflow-hidden relative"
    >
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageSrc={selectedImage}
      />
      {/* Background Effects (Blue/Cyan based) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-sky-600/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"
          style={{ animationDelay: "4s" }}
        ></div>
        <div className="absolute inset-0  opacity-5 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="pt-8 pb-10">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-white text-2xl font-bold cursor-pointer hover:text-blue-400 transition-colors">
              <Link href={"https://dgtportfolio.com"}>{t('portfolio')}</Link>
            </h1>
            <div className="flex gap-3">
              {/* Copy Link */}
              <PDFDownloadLink
                document={<ResumePdf userData={userDetails} />}
                fileName={`cv.${userDetails?.username || 'resume'}.pdf`}
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
              {/* QR Code */}
              <div
                onClick={() => setShowQR(!showQR)}
                className="flex items-center gap-2 px-2 bg-white/10 hover:bg-blue-500/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-blue-500/50 cursor-pointer"
              >
                <QrcodeProfile userDetails={userDetails} />
              </div>
              {/* User Links */}
              <div className="flex items-center gap-2 px-2 bg-white/10 hover:bg-blue-500/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-blue-500/50">
                <UserLinks lang={userDetails?.displayLanguage} userLinks={userLinks} />
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className={`flex flex-col-reverse md:flex-row gap-10 items-center justify-between mb-8`}>
            <div className={`flex-1 text-center  ${userDetails?.displayLanguage === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
              <div className="inline-block px-3 py-1 mb-4 text-xs tracking-wider text-blue-300 uppercase bg-blue-500/10 rounded-full border border-blue-500/20">
                Welcome to my world
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight text-white">
                {userDetails?.fullname}
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-blue-300/90 mb-6 flex items-center justify-center md:justify-start gap-2">
                <Sparkles size={24} className="text-cyan-400" />
                {userDetails?.category}
                <Sparkles size={24} className="text-cyan-400" />
              </p>
              <p className={`text-md  text-gray-300 max-w-2xl leading-relaxed mx-auto md:mx-0 ${userDetails?.displayLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                {userDetails?.about}
              </p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-[2rem] blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative">
                <Image width={500} height={500}
                  src={userDetails?.urlimage}
                  alt={userDetails?.fullname}
                  className="w-64 h-64 md:w-80 md:h-80 rounded-[1.8rem] object-cover border-2 border-white/10 shadow-2xl transform transition duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center md:justify-start pb-2">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 p-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 w-full md:w-auto">
              {[
                { key: "about", label: t('about'), icon: User },
                { key: "services", label: t('services'), icon: Layers, condition: userDetails?.services?.length > 0 },
                { key: "experience", label: t('experience'), icon: Briefcase, condition: userDetails?.experience?.length > 0 },
                { key: "projects", label: t('projects'), icon: Code2, condition: userDetails?.projects?.length > 0 },
                { key: "skills", label: t('skills'), icon: Zap, condition: userDetails?.skills?.length > 0 },
                { key: "education", label: t('education'), icon: GraduationCap, condition: userDetails?.education?.length > 0 },
              ]
                .filter((tab) => tab.condition !== false)
                .map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap text-sm md:text-base ${activeTab === tab.key
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                      {tab.label}
                    </button>
                  );
                })}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="min-h-[400px] pb-20">
          {userDetails && (
            <div className="animate-fadeIn">
              {/* About Tab */}
              {activeTab === "about" && (
                <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                  <div className="bg-white/5 backdrop-blur-md rounded-3xl p-5 md:p-8 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                    <h3 className="text-2xl mb-6 flex items-center gap-2 text-white">
                      <User className="text-blue-400" /> {t('aboutMe')}
                    </h3>
                    <div className="space-y-4 md:space-y-6">
                      {userDetails.email && (
                        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/5 rounded-2xl overflow-hidden">
                          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                            <Mail size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-400">Email</p>
                            <a href={`mailto:${userDetails.email}`} className="text-white hover:text-blue-300 transition break-all text-sm md:text-base">
                              {userDetails.email}
                            </a>
                          </div>
                        </div>
                      )}
                      {userDetails.country && (
                        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/5 rounded-2xl">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                            <Globe size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">{t('country')}</p>
                            <p className="text-white">{userDetails.country}</p>
                          </div>
                        </div>
                      )}
                      {userDetails.phoneNumber && (
                        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/5 rounded-2xl">
                          <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">{t('phone')}</p>
                            <p className="text-white">{userDetails.phoneNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {userDetails?.languages?.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                      <h3 className="text-2xl mb-6 flex items-center gap-2 text-white">
                        <Globe className="text-cyan-400" /> {t('languages')}
                      </h3>
                      <div className="grid gap-3">
                        {userDetails.languages?.map((lang, i) => (
                          <div
                            key={i}
                            className="flex items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
                          >
                            <span className="text-gray-200">{lang}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Services Tab */}
              {activeTab === "services" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userDetails.services?.map((service, i) => (
                    <div
                      key={i}
                      className="group p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Layers className="text-blue-400" size={24} />
                      </div>
                      <h4 className="text-lg text-white mb-2">{service}</h4>
                      <p className="text-sm text-gray-400">Professional service tailored to your needs.</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === "projects" && (
                <div className="space-y-8">
                  {userDetails.projects?.map((project, i) => (
                    <div
                      key={i}
                      className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-500"
                    >
                      <div className="flex flex-col md:flex-row">
                        {project.image && (
                          <div className="md:w-1/3 relative overflow-hidden h-64 md:h-auto">
                            <Image
                              width={500}
                              height={500}
                              src={project.image}
                              alt={project.title}
                              onClick={() => setSelectedImage(project.image)}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent mix-blend-multiply pointer-events-none"></div>
                          </div>
                        )}
                        <div className="flex-1 p-4 md:p-8">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                              {project.title}
                            </h3>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-white/10 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300"
                              >
                                <Globe size={20} />
                              </a>
                            )}
                          </div>

                          <p
                            onClick={() => setExpanded(expanded === i ? null : i)}
                            className={`text-gray-300 whitespace-pre-wrap mb-6 leading-relaxed cursor-pointer hover:text-white transition-colors ${expanded === i ? "line-clamp-none" : "line-clamp-4"
                              }`}
                          >
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {project.technologies?.map((tech, j) => (
                              <span
                                key={j}
                                className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === "experience" && (
                <div className="grid gap-6">
                  {userDetails.experience?.map((exp, i) => (
                    <div key={i} className="p-5 md:p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                            <Briefcase size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl text-white mb-1">{exp.role}</h3>
                            <div className="text-blue-400 text-sm">{exp.company}</div>
                          </div>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 whitespace-nowrap">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap pl-0 sm:pl-[4rem]">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === "skills" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userDetails.skills?.map((skill, i) => (
                    <div
                      key={i}
                      className="group relative p-4 md:p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 overflow-hidden"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Zap size={20} className="text-yellow-400" />
                        </div>
                        <span className="text-gray-200 group-hover:text-white transition-colors text-start">{skill}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Education Tab */}
              {activeTab === "education" && (
                <div className="grid md:grid-cols-2 gap-6">
                  {userDetails.education?.map((edu, i) => (
                    <div
                      key={i}
                      className="relative p-4 md:p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:border-blue-500/30 transition-all duration-300 group overflow-hidden"
                    >
                      <div className={`absolute top-0 ${userDetails.displayLanguage === "ar" ? "left-0" : "right-0"} p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 ${edu.field ? "" : "hidden"}`}>
                        <GraduationCap size={100} />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl text-white mb-2">{edu.degree || "Degree"}</h3>
                          <span className="inline-block px-3 py-1 mb-4 text-xs text-blue-300 bg-blue-500/10 rounded-full border border-blue-500/20">
                            {edu.startYear} - {edu.endYear || "Present"}
                          </span>
                        </div>
                        <p className="text-lg text-cyan-300 mb-4">{edu.school}</p>
                        {edu.field && (
                          <div className="p-4 bg-slate-900/50 rounded-lg border-l-4 border-cyan-500/50">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{t('field')}</p>
                            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                              {edu.field}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12">
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: "linkedin", url: userDetails.socials?.linkedin, icon: "/icons/linkedin.svg" },
                { name: "github", url: userDetails.socials?.github, icon: "/icons/github.svg" },
                { name: "facebook", url: userDetails.socials?.fb, icon: "/icons/facebook.svg" },
                { name: "whatsapp", url: userDetails.socials?.whatsapp, icon: "/icons/whatsapp.svg" },
                { name: "tiktok", url: userDetails.socials?.tiktok, icon: "/icons/tiktok.svg" },
                { name: "reddit", url: userDetails.socials?.reddit, icon: "/icons/reddit.svg" },
                { name: "twitch", url: userDetails.socials?.twitch, icon: "/icons/twitch.svg" },
                { name: "instagram", url: userDetails.socials?.instagram, icon: "/icons/instagram.svg" },
                { name: "snapchat", url: userDetails.socials?.snapchat, icon: "/icons/snapchat.svg" },
                { name: "twitter", url: userDetails.socials?.twitter, icon: "/icons/twitter.svg" },
                { name: "youtube", url: userDetails.socials?.youtube, icon: "/icons/youtube.svg" },
                { name: "telegram", url: userDetails.socials?.telegram, icon: "/icons/telegram.svg" },
              ]
                .filter((item) => item.url)
                .map((item, i) => (
                  <a
                    href={item.url}
                    key={i}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <Image width={500} height={500} src={item.icon} alt={item.name} className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
            </div>
            <p dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'} className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {userDetails.fullname}. {t('allRightsReserved')}.
            </p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
