"use client"
import { useState } from "react"
import { Sparkles, CheckCircle2, Copy, Briefcase, GraduationCap, Code, Globe, Share2, Loader, FileDown } from "lucide-react"
import QrcodeProfile from "../../[username]/components/QrcodeProfile";
import UserLinks from "../../[username]/components/UserLinks";
import MagicalLoader from "../MagicalLoader";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "../../lib/translations";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumePdf from "../../update-profile/components/ResumePdf";
import ImageModal from "../ImageModal";

export default function ThemeFour({ userDetails, userLinks }) {
  const { t } = useTranslation(userDetails?.displayLanguage || 'en')
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const PORTFOLIO = `https://${userDetails?.username}.dgtportfolio.com`


  const copyProfileLink = () => {
    const urlToCopy = PORTFOLIO
    navigator.clipboard.writeText(urlToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  if (!userDetails || !userLinks) { return <MagicalLoader /> }

  return (
    <div>
      {userDetails && (
        <div dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-950 text-white overflow-hidden">
          <ImageModal
            isOpen={!!selectedImage}
            onClose={() => setSelectedImage(null)}
            imageSrc={selectedImage}
          />
          <div className="px-4 md:px-6">
            {/* Header */}
            <header className="pt-7 pb-12">
              <div className="max-w-5xl mx-auto">
                {/* Toolbar */}
                <div className="relative z-50 flex justify-between  items-center mb-12">
                  <h1 className="text-white text-2xl font-bold cursor-pointer hover:text-emerald-400 transition-colors">
                    <Link href={"https://dgtportfolio.com"}>{t('portfolio')}</Link>
                  </h1>
                  <div className="flex gap-3">
                    {/* Copy Link */}
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
                    {/* QR Code */}
                    <div
                      onClick={() => setShowQR(!showQR)}
                      className="flex items-center gap-2 px-2 bg-white/10 hover:bg-emerald-500/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 cursor-pointer"
                    >
                      <QrcodeProfile userDetails={userDetails} />
                    </div>
                    {/* User Links */}
                    <div className="flex items-center gap-2 px-2 bg-white/10 hover:bg-emerald-500/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-emerald-500/50">
                      <UserLinks lang={userDetails?.displayLanguage} userLinks={userLinks} />
                    </div>
                  </div>
                </div>

                {/* Header Content */}
                <div className="flex flex-col-reverse md:flex-row gap-12 md:items-start items-center justify-between">
                  <div className="">
                    <h1 className="text-5xl md:text-6xl font-black mb-5">{userDetails?.fullname}</h1>
                    <p className="text-2xl text-emerald-300 font-semibold mb-5 flex items-center gap-2 animate-pulse">
                      <Sparkles size={24} className="text-emerald-400" />
                      {userDetails.category}
                      <Sparkles size={24} className="text-emerald-400" />
                    </p>
                    <div className="text-gray-300 mt-4 max-w-lg">
                      <p className="mb-6">{userDetails?.about}</p>
                      <div className="p-4 md:p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                        {userDetails.email && (
                          <div className="flex gap-2 items-start">
                            <span className="font-bold text-emerald-400 whitespace-nowrap">Email:</span>
                            <a href={`mailto:${userDetails.email}`} className="text-gray-300 hover:text-emerald-300 transition break-all">{userDetails.email}</a>
                          </div>
                        )}
                        {userDetails.country && (
                          <div className="flex gap-2 items-start">
                            <span className="font-bold text-emerald-400 whitespace-nowrap">{t('country')}:</span>
                            <span className="text-gray-300">{userDetails.country}</span>
                          </div>
                        )}
                        {userDetails.phoneNumber && (
                          <div className="flex gap-2 items-start">
                            <span className="font-bold text-emerald-400 whitespace-nowrap">{t('phone')}:</span>
                            <span className="text-gray-300">{userDetails.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <Image width={500} height={500}
                      src={userDetails?.urlimage}
                      alt={userDetails?.fullname}
                      className="relative imganim md:w-80 md:h-80 w-52 h-56 rounded-2xl object-cover border-4 border-white/20 group-hover:border-white/40 transition-all duration-500 shadow-2xl"
                    />
                  </div>
                </div>

              </div>
            </header>

            {/* Services */}
            {userDetails.services?.length > 0 && (
              <section className="py-8 border-t border-emerald-500/20">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center gap-3 mb-8">
                    <Briefcase className="text-emerald-400" size={32} />
                    <h2 className="text-4xl font-black">{t('services')}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {userDetails.services.map((service, i) => (
                      <div key={i} className="group p-6 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                        <p className="text-sm md:text-base text-gray-200 relative z-10">{service}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Experience */}
            {userDetails.experience?.length > 0 && (
              <section className="py-8 border-t border-emerald-500/20">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center gap-3 mb-8">
                    <Briefcase className="text-emerald-400" size={32} />
                    <h2 className="text-4xl font-black">{t('experience')}</h2>
                  </div>
                  <div className="space-y-6">
                    {userDetails.experience.map((exp, i) => (
                      <div key={i} className="group relative p-6 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 overflow-hidden">
                        {/* Decorative element */}
                        {userDetails.displayLanguage === "ar" ? (
                          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        ) : (
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}

                        <div className="relative z-10">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                            <h3 className="text-xl md:text-2xl font-bold text-emerald-300 group-hover:text-emerald-200 transition">{exp.role}</h3>
                            <span className={`text-gray-400 text-sm ${userDetails.displayLanguage === "ar" ? "flex gap-1" : "flex flex-row-reverse gap-1"}`}>
                              <p>{exp.startDate}</p>
                              <p> - </p>
                              <p>{exp.endDate}</p>
                            </span>
                          </div>
                          <p className="text-emerald-400 font-semibold mb-3 text-lg">{exp.company}</p>
                          <div className={`mt-3 p-4 bg-slate-900/50 rounded-lg  border-emerald-500/50 ${userDetails.displayLanguage === "ar" ? "border-r-4" : "border-l-4"}`}>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{t('description')}</p>
                            <p className={`text-gray-300 text-sm whitespace-pre-wrap leading-relaxed`}>
                              {exp.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
            {/* Skills */}
            {userDetails.skills?.length > 0 && (
              <section className="py-8 border-t border-emerald-500/20">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center gap-3 mb-8">
                    <Code className="text-emerald-400" size={32} />
                    <h2 className="text-4xl font-black">{t('skills')}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {userDetails.skills.map((skill, i) => (
                      <div key={i} className="group relative p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <p className="text-gray-200 group-hover:text-emerald-200 transition font-medium relative z-10">{skill}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section >
            )}

            {/* Projects */}
            {userDetails.projects && userDetails.projects.length > 0 && (
              <section className="py-8 border-t border-emerald-500/20">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-4xl font-black mb-8 text-center md:text-start">{t('projects')}</h2>
                  <div className="space-y-6">
                    {userDetails.projects.map((project, idx) => (
                      <div
                        key={idx}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group"
                      >
                        <div className="md:flex">
                          {project.image && (
                            <div className="md:w-1/3 relative">
                              <Image width={500} height={500}
                                src={project.image}
                                alt={project.title}
                                onClick={() => setSelectedImage(project.image)}
                                className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-transparent group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
                            </div>
                          )}
                          <div className={`py-6 flex-1 px-6 group-hover:px-8 transition-all duration-300`}>
                            <h3 className="text-2xl font-bold text-emerald-300 mb-3 group-hover:text-emerald-200 transition">{project.title}</h3>
                            <p onClick={() => setExpanded(expanded === idx ? null : idx)}
                              className={`text-sm md:text-base text-gray-300 mb-4 whitespace-pre-line cursor-pointer transition-all duration-300 leading-relaxed
                                ${expanded === idx ? "line-clamp-none" : "line-clamp-3"}
                              `}
                            >
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-6">
                              {project.technologies?.map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-xs text-emerald-300"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/50 rounded-lg text-emerald-300 transition-all duration-300 font-medium"
                              >
                                <Globe size={18} />
                                {t('viewProject')}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Education */}
            {
              userDetails.education?.length > 0 && (
                <section className="py-8 border-t border-emerald-500/20">
                  <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                      <GraduationCap className="text-emerald-400" size={32} />
                      <h2 className="text-4xl font-black">{t('education')}</h2>
                    </div>
                    <div className="space-y-6">
                      {userDetails.education.map((edu, i) => (
                        <div
                          key={i}
                          className="group relative p-6 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 overflow-hidden"
                        >
                          {/* Decorative corner accent */}
                          {userDetails.displayLanguage === "ar" ? (
                            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          ) : (
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          )}
                          <div className="relative z-10">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                              <h3 className="text-xl md:text-2xl font-bold text-emerald-300 group-hover:text-emerald-200 transition">{edu.degree}</h3>
                              <p className="text-gray-400 text-sm md:text-base whitespace-nowrap">
                                {edu.startYear} - {edu.endYear}
                              </p>
                            </div>

                            <p className="text-emerald-400 font-semibold text-lg mb-3">{edu.school}</p>

                            {edu.field && (
                              <div className={`p-4 bg-slate-900/50 rounded-lg ${userDetails.displayLanguage === "ar" ? "border-r-4" : "border-l-4"} border-emerald-500/50`}>
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
                  </div>
                </section>
              )
            }

            {/* Languages */}
            {
              userDetails.languages?.length > 0 && (
                <section className="py-8 border-t border-emerald-500/20">
                  <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                      <Globe className="text-emerald-400" size={32} />
                      <h2 className="text-4xl font-black">{t('languages')}</h2>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {userDetails.languages.map((lang, i) => (
                        <div
                          key={i}
                          className="group relative px-6 py-3 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-full text-gray-200 hover:border-emerald-500/60 hover:text-emerald-200 transition-all duration-300 cursor-pointer overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                          <span className="relative z-10 font-semibold">{lang}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )
            }

            {/* Social Media */}
            {userDetails.socials && Object.values(userDetails.socials).some(url => url) && (
              <section
                dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
                className="py-8 border-t border-emerald-500/20">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center gap-3 mb-8">
                    <Share2 className="text-emerald-400" size={30} />
                    <h2 className="text-3xl font-black">{t('followMe')}</h2>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    {[
                      { name: "linkedin", url: userDetails.socials.linkedin, icon: "/Icons/linkedin.svg" },
                      { name: "github", url: userDetails.socials.github, icon: "/Icons/github.svg" },
                      { name: "facebook", url: userDetails.socials.fb, icon: "/Icons/fb.svg" },
                      { name: "whatsapp", url: userDetails.socials.whatsapp, icon: "/Icons/wts.svg" },
                      { name: "tiktok", url: userDetails.socials.tiktok, icon: "/Icons/tiktok.svg" },
                      { name: "reddit", url: userDetails.socials.reddit, icon: "/Icons/reddit.svg" },
                      { name: "twitch", url: userDetails.socials.twitch, icon: "/Icons/twitch.svg" },
                      { name: "instagram", url: userDetails.socials.instagram, icon: "/Icons/ins.svg" },
                      { name: "snapchat", url: userDetails.socials.snapchat, icon: "/Icons/snap.svg" },
                      { name: "twitter", url: userDetails.socials.twitter, icon: "/Icons/twit.svg" },
                      { name: "youtube", url: userDetails.socials.youtube, icon: "/Icons/youtube.svg" },
                      { name: "telegram", url: userDetails.socials.telegram, icon: "/Icons/tele.svg" },
                      { name: "tiktok", url: userDetails.socials.tik, icon: "/Icons/tiktok.svg" },
                      { name: "google", url: userDetails.socials.google, icon: "/Icons/google.svg" },
                    ]
                      .filter((item) => item.url)
                      .map((item, i) => (
                        <a
                          key={i}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative p-3 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <Image width={500} height={500} src={item.icon} alt={item.name} className="w-7 h-7 relative z-10" />
                        </a>
                      ))}
                  </div>
                </div>
              </section>
            )}

            {/* Footer */}
            <footer className="border-t border-emerald-500/20 bg-slate-950/50 backdrop-blur-md mt-12">
              <div className="max-w-5xl mx-auto px-4 py-8 text-center">
                <p className="text-gray-400">
                  © {new Date().getFullYear()} {userDetails?.fullname}. {t('allRightsReserved')}.
                </p>
              </div>
            </footer>
          </div>


        </div>
      )}
    </div>
  )
}