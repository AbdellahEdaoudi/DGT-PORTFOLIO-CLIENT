"use client"
import { useState } from "react"
import { ArrowUpRight, Zap, Mail, Copy, CheckCircle2, Briefcase, GraduationCap, Loader, FileDown, Globe } from "lucide-react"
import UserLinks from "../../[username]/components/UserLinks"
import QrcodeProfile from "../../[username]/components/QrcodeProfile"
import Image from "next/image"
import MagicalLoader from "../MagicalLoader"
import Link from "next/link"
import { useTranslation } from "../../lib/translations"
import { PDFDownloadLink } from "@react-pdf/renderer"
import ResumePdf from "../../update-profile/components/ResumePdf"

export default function ThemeFive({ userDetails, userLinks }) {
  const { t } = useTranslation(userDetails?.displayLanguage || 'en')
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const PORTFOLIO = `https://${userDetails?.username}.dgtportfolio.com`
  const [expanded, setExpanded] = useState(false);


  const copyProfileLink = () => {
    const urlToCopy = PORTFOLIO
    navigator.clipboard.writeText(urlToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  if (!userDetails || !userLinks) { return <MagicalLoader /> }

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black"></div>
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full mix-blend-screen blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full mix-blend-screen blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {userDetails && (
        <div dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
        className="relative z-10 md:px-20 px-4">
          {/* Hero Section */}
          <section className="pt-8 pb-12">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-12 gap-4">
              <h1 className="text-white text-2xl font-bold cursor-pointer hover:text-yellow-400 transition">
                <Link href={"https://dgtportfolio.com"}>{t('portfolio')}</Link>
              </h1>
              <div className="flex flex-wrap gap-3">
                {/* Copy Link */}
                <PDFDownloadLink
                   document={<ResumePdf userData={userDetails} />}
                   title={(() => {
                       const translations = {
                         en: 'Download CV',
                         fr: 'Télécharger CV',
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
                  className="flex items-center gap-2 px-2 bg-white/10 hover:bg-yellow-500/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-yellow-500/50 cursor-pointer"
                >
                  <QrcodeProfile path={`/${userDetails?.username}`} userDetails={userDetails} />
                </div>
                {/* User Links */}
                <div className="flex items-center gap-2 px-2 bg-white/10 hover:bg-yellow-500/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-yellow-500/50">
                  <UserLinks lang={userDetails?.displayLanguage} userLinks={userLinks} />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
              <div className="flex-1 mb-4">
                <p className="text-yellow-400 font-semibold uppercase tracking-widest mb-3 text-sm animate-pulse">{t('helloIm')}</p>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
                  {userDetails.fullname.split(" ")[0]}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 animate-gradient">
                    {userDetails.fullname.split(" ")[1]}
                  </span>
                </h1>
                <p className="text-2xl text-yellow-400 font-bold mb-6 flex items-center gap-2">
                  <Briefcase size={28} className="text-yellow-500" />
                  {userDetails.category}
                </p>
                <p className="text-md md:block hidden text-gray-300 mb-8 leading-relaxed max-w-lg">
                  {userDetails.about}
                </p>
                <a
                  href={`mailto:${userDetails.email}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl font-bold text-black hover:shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <Mail size={20} />
                  {t('letsTalk')}
                </a>
              </div>
              <div className="relative flex-shrink-0 group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-orange-600/30 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <Image width={320} height={320}
                  src={userDetails.urlimage}
                  alt={userDetails.fullname}
                  className="relative rounded-3xl border-2 border-yellow-500/40 group-hover:border-yellow-500/60 transition-all duration-500 shadow-2xl"
                />
              </div>
            </div>
          </section>

          {/* About, Services, Info */}
          {userDetails.about?.length > 0 && (
            <section className="py-12 border-t border-zinc-800/50">
              <div className={`grid ${userDetails.services.length > 0 ? "md:grid-cols-3" : "md:grid-cols-2"}  gap-8`}>
                <div className="group p-6 bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 rounded-2xl border border-zinc-700/50 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
                  <p className="text-yellow-400 font-bold uppercase tracking-widest mb-3 text-xs">{t('about')}</p>
                  <h2 className="text-3xl sm:text-4xl font-black mb-4 group-hover:text-yellow-400 transition">{t('whoIam')}</h2>
                  <p className="text-gray-300 leading-relaxed">{userDetails.about}</p>
                </div>
                {userDetails.services.length > 0 && (
                  <div className="group p-6 bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 rounded-2xl border border-zinc-700/50 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
                    <p className="text-yellow-400 font-bold uppercase tracking-widest mb-3 text-xs">{t('services')}</p>
                    <div className="space-y-3">
                      {userDetails.services?.map((service, i) => (
                        <div key={i} className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-yellow-500/50 hover:bg-zinc-800 transition-all duration-200">
                          <p className="text-gray-200 text-sm">{service}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="group p-6 bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 rounded-2xl border border-zinc-700/50 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
                  <p className="text-yellow-400 font-bold uppercase tracking-widest mb-3 text-xs">{t('info')}</p>
                  <div className="space-y-4 text-sm">
                    {userDetails.country && (
                      <div>
                        <p className="text-gray-500 uppercase mb-1 text-xs tracking-wider">{t('country')}</p>
                        <p className="text-white font-semibold">{userDetails.country}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500 uppercase mb-1 text-xs tracking-wider">Email</p>
                      <a href={`mailto:${userDetails.email}`} className="text-yellow-400 hover:text-yellow-300 transition font-semibold break-all">
                        {userDetails.email}
                      </a>
                    </div>
                    {userDetails.phoneNumber && (
                      <div>
                        <p className="text-gray-500 uppercase mb-1 text-xs tracking-wider">{t('phone')}</p>
                        <p className="text-white font-semibold">{userDetails.phoneNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Experience */}
          {userDetails.experience?.length > 0 && (
            <section className="py-12 border-t border-zinc-800/50">
              <div className="flex items-center gap-3 mb-8">
                <Briefcase className="text-yellow-400" size={32} />
                <h2 className="text-3xl sm:text-4xl font-black">{t('experience')}</h2>
              </div>
              <div className="space-y-6">
                {userDetails.experience.map((exp, i) => (
                  <div key={i} className="group relative p-6 bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 border border-zinc-700/50 rounded-2xl hover:border-yellow-500/60 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 overflow-hidden">
                    {/* Decorative element */}
                    {userDetails.displayLanguage === "ar" ? (
                      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-bl from-yellow-500/10 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    ) : (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}

                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition">{exp.role}</h3>
                        <span className={`text-gray-400 text-sm ${userDetails.displayLanguage === "ar" ? "flex gap-1" : "flex flex-row-reverse gap-1"}`}>
                            <p>{exp.startDate}</p>
                            <p> - </p>
                            <p>{exp.endDate}</p>
                          </span>
                      </div>
                      <p className="text-gray-200 font-semibold mb-3 text-lg">{exp.company}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{t('description')}</p>
                      <p className={`mt-3 p-2 text-gray-300 text-sm whitespace-pre-wrap leading-relaxed border-yellow-500/50  rounded-lg  ${userDetails.displayLanguage === "ar" ? "border-r-4" : "border-l-4"}`}>{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {userDetails.skills?.length > 0 && (
            <section className="py-12 border-t border-zinc-800/50">
              <h2 className="text-3xl sm:text-4xl font-black mb-8">💡{t('skills')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userDetails.skills?.map((skill, i) => (
                  <div
                    key={i}
                    className="flex gap-3 group relative p-5 bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 rounded-xl border border-zinc-700/50 hover:border-yellow-500/60 hover:bg-zinc-800/60 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Zap className="mb-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 flex-shrink-0" size={20} />
                    <p className="text-sm text-gray-300 group-hover:text-yellow-300 transition font-medium relative z-10">{skill}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {userDetails.projects && userDetails.projects.length > 0 && (
            <section className="py-8 border-t border-zinc-800/50">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl font-black mb-8 text-center md:text-start">⭐ {t('projects')}</h2>
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
                              className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-transparent group-hover:scale-110 transition-transform duration-500"></div>
                          </div>
                        )}
                        <div className={`py-6 flex-1 px-6 group-hover:px-8 transition-all duration-300`}>
                          <h3 className="text-2xl font-bold text-yellow-300 mb-3 group-hover:text-yellow-200 transition">{project.title}</h3>
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
                                className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded-full text-xs text-yellow-300"
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
                              className="inline-flex items-center gap-2 px-6 py-2 bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-500/50 rounded-lg text-yellow-300 transition-all duration-300 font-medium"
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
          {userDetails.education?.length > 0 && (
            <section className="py-12 border-t border-zinc-800/50">
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="text-yellow-400" size={32} />
                <h2 className="text-3xl sm:text-4xl font-black text-white">{t('education')}</h2>
              </div>

              <div className="space-y-6">
                {userDetails.education.map((edu, i) => (
                  <div
                    key={i}
                    className="group relative p-6 bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 border border-zinc-700/50 rounded-2xl 
                               hover:border-yellow-500/60 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 overflow-hidden"
                  >
                    {/* Decorative gradient overlay */}
                    {userDetails.displayLanguage === "ar" ? (
                      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-bl from-yellow-500/10 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    ) : (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                    {/* Animated border effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10">
                      {/* Header with degree and dates */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">
                          {edu.degree}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm sm:text-base">
                          <span className="whitespace-nowrap">{edu.startYear} - {edu.endYear}</span>
                        </div>
                      </div>

                      {/* School name */}
                      <p className="text-gray-200 font-semibold text-base sm:text-lg mb-3">{edu.school}</p>

                      {/* Field of study */}
                      {edu.field && (
                        <div className={`${userDetails.displayLanguage === "ar" ? "border-r-4" : "border-l-4"} border-yellow-500/50 p-4 bg-zinc-900/50 rounded-xl mb-3 ${userDetails.displayLanguage === "ar" ? "" : ""}`}>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{t('field')}</p>
                          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                            {edu.field}
                          </p>
                        </div>
                      )}

                      {/* Description */}
                      {edu.description && (
                        <div className="p-4 bg-zinc-900/30 rounded-xl border-l-4 border-yellow-500/50">
                          <p className="text-sm text-gray-400 whitespace-pre-wrap leading-relaxed">
                            {edu.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {userDetails.languages?.length > 0 && (
            <section className="py-12 border-t border-zinc-800/50">
              <h2 className="flex gap-2 text-3xl sm:text-4xl font-black mb-8">
                <Globe className="text-yellow-400" size={32} />
                {t('languages')}</h2>
              <div className="flex flex-wrap gap-4">
                {userDetails.languages.map((lang, i) => (
                  <div
                    key={i}
                    className="group relative px-6 py-3 rounded-xl cursor-pointer overflow-hidden border border-zinc-700/50 bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 hover:border-yellow-400/60 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 text-gray-200 group-hover:text-yellow-300 font-semibold transition">{lang}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

      )}
      {/* Footer */}
      {userDetails.socials && Object.values(userDetails.socials).some(url => url) && (
        <footer 
        dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
        className="relative z-10 border-t border-zinc-800/50 bg-black/50 backdrop-blur-md py-12 px-6 mt-12">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center gap-6 mb-6 flex-wrap">
              {[
                { name: "linkedin", url: userDetails.socials.linkedin, icon: "/Icons/link.svg" },
                { name: "github", url: userDetails.socials.github, icon: "/Icons/github.svg" },
                { name: "facebook", url: userDetails.socials.fb, icon: "/Icons/fb.svg" },
                { name: "whatsapp", url: userDetails.socials.whatsapp, icon: "/Icons/wts.svg" },
                { name: "tiktok", url: userDetails.socials.tiktok, icon: "/Icons/tiktok.svg" },
                { name: "reddit", url: userDetails.socials.reddit, icon: "/Icons/reddit.svg" },
                { name: "twitch", url: userDetails.socials.twitch, icon: "/Icons/twitch.svg" },
                { name: "instagram", url: userDetails.socials.instagram, icon: "/Icons/ins.svg" },
                { name: "snapchat", url: userDetails.socials.snapchat, icon: "/Icons/snap.svg" },
                { name: "twitter", url: userDetails.socials.twitter, icon: "/Icons/twit.svg" },
                { name: "youtube", url: userDetails.socials.youtube, icon: "/Icons/yt.svg" },
                { name: "telegram", url: userDetails.socials.telegram, icon: "/Icons/tele.svg" },
                { name: "google", url: userDetails.socials.google, icon: "/Icons/google.svg" },
              ].filter((item) => item.url)
                .map((social, i) =>
                  social.url && (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group p-2 md:p-3 bg-zinc-800/50 hover:bg-yellow-500/20 transition-all duration-300 border border-zinc-700/50 hover:border-yellow-500/50 rounded-full transform hover:scale-110"
                    >
                      <Image width={25} height={25} src={social.icon} alt={social.name} className="w-6 h-6 group-hover:brightness-125 transition" />
                    </a>
                  )
                )}
            </div>
            <p className="text-gray-400">© {new Date().getFullYear()} {userDetails.fullname}. {t('allRightsReserved')}.</p>
          </div>
        </footer>
      )}

    </div>
  )
}
