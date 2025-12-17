"use client"
import { useState, useEffect, useMemo } from "react"
import { Sparkles, GraduationCap, Code, Globe, Share2, Loader, FileDown, Briefcase, Award, Menu, X, ArrowUp } from "../Icons"
import QrcodeProfile from "../../[username]/components/QrcodeProfile";
import UserLinks from "../../[username]/components/UserLinks";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "../../lib/translations";
import ImageModal from "../ImageModal"
import DownloadResume from "../downloadcv/DownloadResume"

export default function ThemeFour({ userDetails, userLinks }) {
  const { t } = useTranslation(userDetails?.displayLanguage || 'en')
  const [expanded, setExpanded] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showUserLinks, setShowUserLinks] = useState(false);
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
                <div className="relative z-50 flex md:flex-row flex-col gap-4 justify-between  items-center mb-12">
                  <h1 className="text-white text-2xl font-bold cursor-pointer hover:text-emerald-400 transition-colors">
                    <Link href={"https://dgtportfolio.com"}>{t('portfolio')}</Link>
                  </h1>
                  <div className="flex gap-3">
                    {/* Copy Link */}
                    <DownloadResume userDetails={userDetails} className="text-white bg-white/10 hover:bg-white/20 font-bold px-5 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg" />
                    {/* QR Code */}
                    <div
                      onClick={() => setShowQR(true)}
                      className="flex items-center gap-2 px-2 bg-white/10 hover:bg-emerald-500/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 cursor-pointer"
                    >
                      <QrcodeProfile userDetails={userDetails} className="text-white border-none hover:bg-transparent" isOpen={showQR} onClose={() => setShowQR(false)} />
                    </div>
                    {/* User Links */}
                    <div
                      onClick={() => setShowUserLinks(true)}
                      className="flex items-center gap-2 px-2 bg-white/10 hover:bg-emerald-500/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 cursor-pointer">
                      <UserLinks lang={userDetails?.displayLanguage} userLinks={userLinks} className="text-white border-none hover:bg-transparent" isOpen={showUserLinks} onClose={() => setShowUserLinks(false)} />
                    </div>
                    {/* Menu Button in Header */}
                    <button
                      onClick={() => setIsNavOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-emerald-500/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 font-medium"
                    >
                      <Menu size={20} />
                    </button>
                  </div>
                </div>

                {/* Full Screen Overlay Navigation */}
                <div className={`fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-3xl transition-all duration-500 overflow-y-auto ${isNavOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                  <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-8 relative">
                    <button
                      onClick={() => setIsNavOpen(false)}
                      className="absolute top-6 right-6 md:top-10 md:right-10 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all duration-300 border border-white/10"
                    >
                      <X size={28} />
                    </button>
                    <div dir={`${userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}`} className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl mx-auto ${isNavOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                      {(() => {
                        const sectionOrder = userDetails.sectionOrder && userDetails.sectionOrder.length > 0
                          ? userDetails.sectionOrder
                          : ["services", "experience", "skills", "projects", "education", "certificates", "languages"];

                        const navItems = {
                          services: { id: "services", label: t('services'), icon: "💼", condition: userDetails?.services?.length > 0 },
                          experience: { id: "experience", label: t('workExperience'), icon: "⭐", condition: userDetails?.experience?.length > 0 },
                          skills: { id: "skills", label: t('skills'), icon: "💡", condition: userDetails?.skills?.length > 0 },
                          projects: { id: "projects", label: t('projects'), icon: "📁", condition: userDetails?.projects?.length > 0 },
                          education: { id: "education", label: t('education'), icon: "🎓", condition: userDetails?.education?.length > 0 },
                          certificates: { id: "certificates", label: t('certificates'), icon: "📜", condition: userDetails?.certificates?.length > 0 },
                          languages: { id: "languages", label: t('languages'), icon: "🌍", condition: userDetails?.languages?.length > 0 },
                        };

                        return sectionOrder
                          .map(key => navItems[key])
                          .filter(tab => tab && tab.condition)
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
                              className={`group relative flex flex-col items-center justify-center p-6 md:p-8 gap-4 bg-white/5 hover:bg-emerald-500/10 border border-white/10 rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-emerald-500/30
                            ${isNavOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                          `}
                              style={{ transitionDelay: `${index * 50}ms` }}
                            >
                              <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{tab.icon}</span>
                              <span className="text-base md:text-lg font-medium text-white/80 group-hover:text-white transition-colors">{tab.label}</span>
                            </button>
                          ));
                      })()}
                    </div>
                  </div>
                </div>

                {/* Header Content */}
                <div className="flex flex-col-reverse md:flex-row gap-12 md:items-start items-center justify-between">
                  <div className="">
                    <p className="text-emerald-400 font-semibold uppercase tracking-widest mb-3 text-sm">{t('helloIm')}</p>
                    <h1 className="text-5xl md:text-6xl font-black mb-5">{userDetails?.fullname}</h1>
                    <p className="text-2xl text-emerald-300 font-semibold mb-5 flex items-center gap-2">
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
                  <div className="relative flex-shrink-0 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-blue-500/30 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <Image width={320} height={320} priority
                      src={userDetails?.urlimage}
                      alt={userDetails?.fullname || "Profile"}
                      className="relative rounded-3xl border-2 border-emerald-500/40 group-hover:border-emerald-500/60 transition-all duration-500 shadow-2xl w-56 h-56 md:w-80 md:h-80 object-cover"
                    />
                  </div>
                </div>

              </div>
            </header>

            <main>
              {/* Dynamic Sections */}
              {(() => {
                const sectionOrder = userDetails.sectionOrder && userDetails.sectionOrder.length > 0
                  ? userDetails.sectionOrder
                  : ["services", "experience", "skills", "projects", "education", "certificates", "languages"];

                const sectionContent = {
                  services: userDetails.services && userDetails.services.length > 0 && (
                    <section key="services" id="services" className="mb-20 scroll-mt-24">
                      <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                          <Briefcase size={32} className="text-emerald-400" />
                          <h2 className="text-3xl font-bold">{t('services')}</h2>
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
                  ),
                  experience: userDetails.experience && userDetails.experience.length > 0 && (
                    <section key="experience" id="experience" className="mb-20 scroll-mt-24">
                      <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                          <Briefcase size={32} className="text-emerald-400" />
                          <h2 className="text-3xl font-bold">{t('workExperience')}</h2>
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
                  ),
                  skills: userDetails.skills && userDetails.skills.length > 0 && (
                    <section key="skills" id="skills" className="mb-20 scroll-mt-24">
                      <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                          <Code size={32} className="text-emerald-400" />
                          <h2 className="text-3xl font-bold">{t('skills')}</h2>
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
                  ),
                  projects: userDetails.projects && userDetails.projects.length > 0 && (
                    <section key="projects" id="projects" className="mb-20 scroll-mt-24">
                      <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                          <Briefcase size={32} className="text-emerald-400" /> {/* Assuming Briefcase for projects, or a different icon if preferred */}
                          <h2 className="text-3xl font-bold">{t('projects')}</h2>
                        </div>
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
                                      alt={project.title || "Project Image"}
                                      onClick={() => setSelectedImage(project.image)}
                                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 cursor-pointer"
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
                  ),
                  education: userDetails.education && userDetails.education.length > 0 && (
                    <section key="education" id="education" className="mb-20 scroll-mt-24">
                      <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                          <GraduationCap size={32} className="text-emerald-400" />
                          <h2 className="text-3xl font-bold">{t('education')}</h2>
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
                  ),
                  certificates: userDetails.certificates && userDetails.certificates.length > 0 && (
                    <section key="certificates" id="certificates" className="mb-20 scroll-mt-24">
                      <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                          <Award size={32} className="text-emerald-400" />
                          <h2 className="text-3xl font-bold">{t('certificates')}</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {userDetails.certificates.map((cert, i) => (
                            <div
                              key={i}
                              className="group relative bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 overflow-hidden flex flex-col"
                            >

                              {cert.cfimage && (
                                <div className="relative h-56 w-full bg-slate-900/50 overflow-hidden cursor-pointer border-b border-emerald-500/20 flex items-center justify-center p-4 z-10" onClick={() => setSelectedImage(cert.cfimage)}>
                                  <Image
                                    src={cert.cfimage}
                                    alt={cert.name || "Certificate Image"}
                                    fill
                                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                  />
                                </div>
                              )}

                              <div className="p-4 relative z-10 flex-1">
                                {cert.description && (
                                  <p className="text-gray-300 font-medium break-all">{cert.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  ),
                  languages: userDetails.languages && userDetails.languages.length > 0 && (
                    <section key="languages" id="languages" className="mb-20 scroll-mt-24">
                      <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                          <Globe size={32} className="text-emerald-400" />
                          <h2 className="text-3xl font-bold">{t('languages')}</h2>
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
                };

                return sectionOrder.map(item => sectionContent[item]);
              })()}

              {/* Social Media */}
              {userDetails.socials && Object.values(userDetails.socials).some(url => url) && (
                <section
                  dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="mb-20 scroll-mt-24">
                  <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                      <Share2 className="text-emerald-400" size={30} />
                      <h2 className="text-3xl font-black">{t('followMe')}</h2>
                    </div>
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
            </main>

            {/* Footer */}
            <footer className="border-t border-emerald-500/20 bg-slate-950/50 backdrop-blur-md mt-12">
              <div className="max-w-5xl mx-auto px-4 py-8 text-center">
                <p className="text-gray-400">
                  © {new Date().getFullYear()} {userDetails?.fullname}. {t('allRightsReserved')}.
                </p>
              </div>
            </footer>
          </div>

          {/* Scroll To Top Button */}
          <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-40 p-3 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-white rounded-full shadow-2xl hover:bg-emerald-500/40 hover:scale-110 transition-all duration-300 group ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
          >
            <ArrowUp size={24} />
          </button>
        </div>
      )
      }
    </div >
  )
}
