"use client"
import { useState, useEffect, useMemo } from "react"
import { Layers, Rocket, Star, ArrowUpRight, Loader, FileDown, Award, Menu, X, ArrowUp } from "../Icons"
import QrcodeProfile from "../portfolio/QrcodeProfile"
import UserLinks from "../portfolio/UserLinks"
import Image from "next/image"
import Link from "next/link"
import { getTranslation } from "../../translations/portfolio"
import ImageModal from "../portfolio/ImageModal"
import DownloadResume from "../downloadcv/DownloadResume"

export default function ThemeEleven({ userDetails, userLinks }) {
    const t = getTranslation(userDetails?.displayLanguage || 'en')
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
    const PORTFOLIO = `https://${userDetails?.username}.dgtportfolio.com`

    // Generate random stars
    const [stars, setStars] = useState([]);
    useEffect(() => {
        const newStars = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 5
        }));
        setStars(newStars);
    }, []);



    const activeSectionsCount = [
        userDetails?.services,
        userDetails?.experience,
        userDetails?.skills,
        userDetails?.projects,
        userDetails?.education,
        userDetails?.certificates,
        userDetails?.languages
    ].filter(section => section && section.length > 0).length;

    return (
        <div
            dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
            className="min-h-screen bg-[#050510] text-cyan-50 font-mono overflow-x-hidden relative selection:bg-cyan-500 selection:text-black">
            <ImageModal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageSrc={selectedImage}
            />

            {/* Space Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Stars */}
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute rounded-full bg-white animate-twinkle"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            animationDuration: `${star.duration}s`,
                            animationDelay: `${star.delay}s`
                        }}
                    />
                ))}
                {/* Nebulas */}
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-5">

                {/* HUD Header */}
                <header className="flex md:flex-row flex-col justify-between items-center mb-8 border-b border-cyan-900/50 pb-4 backdrop-blur-sm gap-4">
                    <div className="flex items-center gap-2">
                        <Rocket className="text-cyan-400" />
                        <Link href="https://dgtportfolio.com" className="text-lg md:text-xl font-bold tracking-widest uppercase text-cyan-400 hover:text-cyan-300 shadow-cyan-500/50 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
                            <span className="text-white">{t('portfolio')}</span>
                        </Link>
                        <Rocket className="text-cyan-400 md:hidden block" />
                    </div>

                    <div className="flex gap-4">
                        <DownloadResume userDetails={userDetails} className="cursor-pointer px-5 py-2 border border-cyan-500/30 bg-cyan-950/30 rounded hover:bg-cyan-500/20 transition-all text-cyan-400 font-bold text-xs flex items-center" />
                        <div onClick={() => setShowQR(true)} className="cursor-pointer border border-cyan-500/30 bg-cyan-950/30 rounded hover:bg-cyan-500/20 transition-all text-cyan-400 font-bold text-xs flex items-center justify-center">
                            <QrcodeProfile userDetails={userDetails} className="text-cyan-400 border-none bg-transparent hover:bg-transparent shadow-none" isOpen={showQR} onClose={() => setShowQR(false)} />
                        </div>
                        {userLinks?.length > 0 && (
                            <div onClick={() => setShowUserLinks(true)} className="cursor-pointer border border-cyan-500/30 bg-cyan-950/30 rounded hover:bg-cyan-500/20 transition-all text-cyan-400 font-bold text-xs flex items-center justify-center">
                                <UserLinks lang={userDetails?.displayLanguage} userLinks={userLinks} className="text-cyan-400 border-none bg-transparent hover:bg-transparent shadow-none" isOpen={showUserLinks} onClose={() => setShowUserLinks(false)} />
                            </div>
                        )}
                        {/* Menu Button in Header */}
                        {activeSectionsCount >= 3 && (
                            <button
                                onClick={() => setIsNavOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 border border-cyan-500/30 bg-cyan-950/30 rounded hover:bg-cyan-500/20 text-cyan-400 transition-all duration-300 backdrop-blur-md font-medium"
                            >
                                <Menu size={20} />
                            </button>
                        )}
                    </div>
                </header>

                {/* Full Screen Overlay Navigation */}
                <div className={`fixed inset-0 z-50 bg-[#050510]/95 backdrop-blur-3xl transition-all duration-500 overflow-y-auto ${isNavOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                    <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-8 relative">
                        <button
                            onClick={() => setIsNavOpen(false)}
                            className="absolute top-6 right-6 md:top-10 md:right-10 p-3 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-full text-cyan-400 hover:text-cyan-300 transition-all duration-300 border border-cyan-500/20"
                        >
                            <X size={28} />
                        </button>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
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
                                            className={`group relative flex flex-col items-center justify-center p-6 md:p-8 gap-4 bg-cyan-900/10 hover:bg-cyan-500/10 border border-cyan-500/20 rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:border-cyan-500/40
                            ${isNavOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                          `}
                                            style={{ transitionDelay: `${index * 50}ms` }}
                                        >
                                            <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">{tab.icon}</span>
                                            <span className="text-base md:text-lg font-medium text-cyan-100/80 group-hover:text-cyan-50 transition-colors">{tab.label}</span>
                                        </button>
                                    ));
                            })()}
                        </div>
                    </div>
                </div>

                {/* Main Interface */}
                <main className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column: Profile */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden border-4 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                                <Image
                                    src={userDetails?.urlimage}
                                    alt={userDetails?.fullname || "Profile"}
                                    width={500}
                                    height={500}
                                    className="w-full h-full object-cover relative z-10 rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                                {/* Scanline effect */}
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30"></div>
                            </div>
                        </div>

                        <div className={`text-center ${userDetails?.displayLanguage === 'ar' ? 'lg:text-right' : 'lg:text-left'}`}>
                            <div className="inline-block px-2 py-1 mb-2 border border-cyan-500/50 text-xs text-cyan-400 uppercase tracking-[0.2em] bg-cyan-950/50">
                                {
                                    {
                                        en: 'Verified',
                                        fr: 'Vérifié',
                                        ar: 'متحقق',
                                        de: 'Verifiziert',
                                        ru: 'Проверено',
                                        ja: '認証済み',
                                        zh: '已验证',
                                        es: 'Verificado',
                                        pt: 'Verificado',
                                        nl: 'Geverifieerd',
                                        it: 'Verificato',
                                        tr: 'Doğrulanmış',
                                        ko: '인증됨',
                                        id: 'Terverifikasi',
                                        pl: 'Zweryfikowano',
                                        hi: 'सत्यापित',
                                    }[userDetails?.displayLanguage] || 'Verified'
                                }
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                                {userDetails?.fullname}
                            </h1>
                            <p className="text-lg md:text-xl text-cyan-200/80 font-light tracking-wide mb-6 flex items-center justify-center lg:justify-start gap-2">
                                <Star size={16} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                                {userDetails?.category}
                                <Star size={16} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                            </p>

                            <div className="p-6 border border-cyan-500/20 bg-cyan-950/20 rounded-lg backdrop-blur-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500"></div>
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500"></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500"></div>
                                <p className="text-cyan-100/80 leading-relaxed text-sm">
                                    {userDetails?.about}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Data Modules */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Dynamic Section Rendering */}
                        {(() => {
                            const sectionOrder = userDetails.sectionOrder && userDetails.sectionOrder.length > 0
                                ? userDetails.sectionOrder
                                : ["services", "experience", "skills", "projects", "education", "certificates", "languages"];

                            const sectionContent = {
                                services: userDetails.services && userDetails.services.length > 0 && (
                                    <section key="services" id="services" className="mb-20 scroll-mt-24">
                                        <h3 className="text-cyan-400 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-8 h-[1px] bg-cyan-500"></span>
                                            {t('services')}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {userDetails.services.map((service, i) => (
                                                <div key={i} className="bg-cyan-950/30 border border-cyan-500/20 p-4 hover:bg-cyan-500/10 transition-colors group cursor-crosshair">
                                                    <Layers className="text-cyan-600 mb-2 group-hover:text-cyan-400 transition-colors" size={20} />
                                                    <p className="text-cyan-100 font-bold text-sm">{service}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                ),
                                experience: userDetails.experience && userDetails.experience.length > 0 && (
                                    <section key="experience" id="experience" className="mb-20 scroll-mt-24">
                                        <h2 className="text-cyan-400 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-8 h-[1px] bg-cyan-500"></span> {t('workExperience')}
                                        </h2>
                                        <div className="space-y-4">
                                            {userDetails.experience.map((exp, i) => (
                                                <div key={i} className={`${userDetails.displayLanguage === "ar" ? "border-r pr-6" : "border-l pl-6"} relative   border-cyan-500/30 pb-4 last:pb-0`}>
                                                    {userDetails.displayLanguage === "ar" ? (
                                                        <div className="absolute -right-[5px] top-1 w-2.5 h-2.5 bg-black border border-cyan-500 rounded-full"></div>
                                                    ) : (
                                                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-black border border-cyan-500 rounded-full"></div>
                                                    )}
                                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-1 gap-1">
                                                        <h4 className="text-lg font-bold text-white">{exp.role}</h4>
                                                        <span className={`${userDetails.displayLanguage === "ar" ? "flex gap-1" : "flex flex-row-reverse gap-1"} text-xs text-cyan-400 font-mono border border-cyan-500/30 px-2 py-0.5 rounded bg-cyan-950/30 whitespace-nowrap`}>
                                                            <p>{exp.startDate}</p>
                                                            <p> - </p>
                                                            <p>{exp.endDate}</p>
                                                        </span>
                                                    </div>
                                                    <p className="text-purple-300 text-sm mb-2">{exp.company}</p>
                                                    <p className="text-cyan-100/60 text-sm">{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                ),
                                skills: userDetails.skills && userDetails.skills.length > 0 && (
                                    <section key="skills" id="skills" className="mb-20 scroll-mt-24">
                                        <h2 className="text-cyan-400 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-8 h-[1px] bg-cyan-500"></span> {t('skills')}
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            {userDetails.skills.map((skill, i) => (
                                                <div key={i} className="px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-100 text-sm hover:bg-cyan-500 hover:text-black transition-all cursor-default clip-path-slant">
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                ),
                                projects: userDetails.projects && userDetails.projects.length > 0 && (
                                    <section key="projects" id="projects" className="mb-20 scroll-mt-24">
                                        <h2 className="text-cyan-400 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-8 h-[1px] bg-cyan-500"></span> {t('projects')}
                                        </h2>
                                        <div className="grid gap-4">
                                            {userDetails.projects.map((project, i) => (
                                                <div key={i} className="flex flex-col sm:flex-row gap-4 bg-black/40 border border-cyan-500/20 p-4 hover:border-cyan-500/50 transition-all group">
                                                    {project.image && (
                                                        <div className="w-full sm:w-24 h-48 sm:h-24 bg-cyan-900/20 flex-shrink-0 overflow-hidden border border-cyan-500/20">
                                                            <Image width={500} height={500}
                                                                src={project.image}
                                                                alt={project.title || "Project Image"}
                                                                onClick={() => setSelectedImage(project.image)}
                                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-bold text-cyan-50 text-lg group-hover:text-cyan-400 transition-colors">{project.title}</h4>
                                                            {project.link && (
                                                                <a
                                                                    href={project.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1 text-cyan-400 hover:text-white hover:underline transition-colors text-sm whitespace-nowrap"
                                                                >
                                                                    {t('viewProject')}
                                                                    <ArrowUpRight size={16} />
                                                                </a>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-cyan-100/60 mt-1 line-clamp-2">{project.description}</p>
                                                        <div className="flex gap-2 mt-3 flex-wrap">
                                                            {project.technologies?.map((tech, j) => (
                                                                <span key={j} className="text-[10px] uppercase text-cyan-300 bg-cyan-900/30 px-2 py-1 border border-cyan-500/20">
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                ),
                                education: userDetails.education && userDetails.education.length > 0 && (
                                    <section key="education" id="education" className="mb-20 scroll-mt-24">
                                        <h2 className="text-cyan-400 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-8 h-[1px] bg-cyan-500"></span> {t('education')}
                                        </h2>
                                        <div className="space-y-4">
                                            {userDetails.education.map((edu, i) => (
                                                <div key={i} className={`${userDetails.displayLanguage === "ar" ? "border-r pr-6" : "border-l pl-6"} relative   border-cyan-500/30 pb-4 last:pb-0`}>
                                                    {userDetails.displayLanguage === "ar" ? (
                                                        <div className="absolute -right-[5px] top-1 w-2.5 h-2.5 bg-black border border-cyan-500 rounded-full"></div>
                                                    ) : (
                                                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-black border border-cyan-500 rounded-full"></div>
                                                    )}
                                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-1 gap-1">
                                                        <h4 className="text-lg font-bold text-white">{edu.school}</h4>
                                                        <span className="text-xs text-cyan-400 font-mono border border-cyan-500/30 px-2 py-0.5 rounded bg-cyan-950/30 whitespace-nowrap">
                                                            {edu.startYear} - {edu.endYear}
                                                        </span>
                                                    </div>
                                                    <p className="text-purple-300 text-sm mb-2">{edu.degree}: {edu.field}</p>
                                                    <p className="text-cyan-100/60 text-sm">{edu.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                ),
                                certificates: userDetails.certificates && userDetails.certificates.length > 0 && (
                                    <section key="certificates" id="certificates" className="mb-20 scroll-mt-24">
                                        <h2 className="text-cyan-400 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-8 h-[1px] bg-cyan-500"></span> {t('certificates') || "Certificates"}
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {userDetails.certificates.map((cert, i) => (
                                                <div key={i} className="group relative p-4 bg-cyan-950/30 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all">
                                                    {/* Corner Accents */}
                                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500"></div>
                                                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500"></div>
                                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500"></div>
                                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500"></div>

                                                    {cert.cfimage && (
                                                        <div className="relative h-48 w-full bg-black/50 overflow-hidden cursor-pointer border border-cyan-500/20 mb-4" onClick={() => setSelectedImage(cert.cfimage)}>
                                                            <Image
                                                                src={cert.cfimage}
                                                                alt={cert.description || "Certificate"}
                                                                fill
                                                                className="object-contain p-2 hover:scale-105 transition-transform duration-500 hover:opacity-100 opacity-80"
                                                            />
                                                        </div>
                                                    )}

                                                    {cert.description && (
                                                        <div className="text-cyan-100/80 text-sm break-all font-mono leading-relaxed">
                                                            <span className="text-cyan-500 mr-2">{">"}</span>
                                                            {cert.description}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                ),
                                languages: userDetails.languages && userDetails.languages.length > 0 && (
                                    <section key="languages" id="languages" className="mb-20 scroll-mt-24">
                                        <h2 className="text-cyan-400 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-8 h-[1px] bg-cyan-500"></span> {t('languages')}
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            {userDetails.languages.map((lang, i) => (
                                                <div key={i} className="px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-100 text-sm hover:bg-cyan-500 hover:text-black transition-all cursor-default clip-path-slant">
                                                    {lang}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )
                            };

                            return sectionOrder.map(item => sectionContent[item]);
                        })()}

                        {/* Socials Module */}
                        {userDetails.socials && Object.values(userDetails.socials).some(url => url) && (
                            <section>
                                <h3 className="text-cyan-400 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-cyan-500"></span>
                                    {t('followMe')}
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        { name: "linkedin", url: userDetails.socials.linkedin, icon: "/icons/linkedin.svg" },
                                        { name: "github", url: userDetails.socials.github, icon: "/icons/github.svg" },
                                        { name: "facebook", url: userDetails.socials.facebook, icon: "/icons/facebook.svg" },
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
                                                className="group relative p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300 overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <Image width={500} height={500} src={item.icon} alt={item.name} className="w-6 h-6 relative z-10 opacity-70 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        ))}
                                </div>
                            </section>
                        )}
                    </div>
                </main>

                <footer className="mt-20 border-t border-cyan-900/30 pt-8 text-center text-cyan-800 text-xs uppercase tracking-widest">
                    <p>End of Transmission /// © {new Date().getFullYear()} {userDetails?.fullname} ©</p>
                </footer>

            </div>

            <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation-name: twinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .clip-path-slant {
           clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
        }
      `}</style>
            {/* Scroll To Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 z-40 p-3 bg-cyan-500/10 backdrop-blur-md border border-cyan-500/20 text-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-500/20 hover:scale-110 transition-all duration-300 group ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
            >
                <ArrowUp size={24} />
            </button>
        </div>
    )
}
