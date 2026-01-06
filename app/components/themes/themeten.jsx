"use client"
import { useState, useMemo } from "react"
import { Mail, Code2, Briefcase, GraduationCap, Globe, Sparkles, User, Layers, Zap, Loader, FileDown, Award } from "../Icons"
import QrcodeProfile from "../portfolio/QrcodeProfile"
import UserLinks from "../portfolio/UserLinks"
import Image from "next/image"
import Link from "next/link"
import { getTranslation } from "../../translations/portfolio"
import ImageModal from "../portfolio/ImageModal"
import DownloadResume from "../downloadcv/DownloadResume"

export default function ThemeTen({ userDetails, userLinks }) {
    const t = getTranslation(userDetails?.displayLanguage || 'en')
    const [activeTab, setActiveTab] = useState("about")
    const [showQR, setShowQR] = useState(false);
    const [showUserLinks, setShowUserLinks] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);



    return (
        <div
            dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
            className="min-h-screen bg-[#020617] text-slate-200 overflow-hidden relative selection:bg-indigo-500 selection:text-white">
            <ImageModal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageSrc={selectedImage}
            />

            {/* Background Effects (Dark/Indigo based) */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full filter blur-[100px] opacity-40 animate-blob"></div>
                <div
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-900/20 rounded-full filter blur-[100px] opacity-40 animate-blob"
                    style={{ animationDelay: "2s" }}
                ></div>
                <div
                    className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-slate-800/20 rounded-full filter blur-[100px] opacity-40 animate-blob"
                    style={{ animationDelay: "4s" }}
                ></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 px-4 md:px-8 max-w-6xl mx-auto">
                {/* Header */}
                <header className="pt-8 pb-10">
                    {/* Toolbar */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-slate-100 text-2xl font-bold cursor-pointer hover:text-indigo-400 transition-colors">
                            <Link href={"https://dgtportfolio.com"}>{t('portfolio')}</Link>
                        </h1>
                        <div className="flex gap-3">
                            {/* Copy Link */}
                            <DownloadResume userDetails={userDetails} className="text-white bg-white/10 hover:bg-white/20 font-bold px-5 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg" />
                            {/* QR Code */}
                            <div
                                onClick={() => setShowQR(true)}
                                className="flex items-center gap-2 px-2 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-slate-300 transition-all duration-300 border border-slate-700 hover:border-indigo-500/50 cursor-pointer"
                            >
                                <QrcodeProfile userDetails={userDetails} className="text-slate-300 border-none hover:bg-transparent" isOpen={showQR} onClose={() => setShowQR(false)} />
                            </div>
                            {/* User Links */}
                            {userLinks?.length > 0 && (
                                <div
                                    onClick={() => setShowUserLinks(true)}
                                    className="flex items-center gap-2 px-2 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-slate-300 transition-all duration-300 border border-slate-700 hover:border-indigo-500/50 cursor-pointer">
                                    <UserLinks lang={userDetails?.displayLanguage} userLinks={userLinks} className="text-slate-300 border-none hover:bg-transparent" isOpen={showUserLinks} onClose={() => setShowUserLinks(false)} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="flex flex-col-reverse md:flex-row gap-10 items-center justify-between mb-8">
                        <div className={`flex-1 text-center  ${userDetails?.displayLanguage === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
                            <div className="inline-block px-3 py-1 mb-4 text-xs tracking-wider text-indigo-400 uppercase bg-indigo-950/50 rounded-full border border-indigo-900/50">
                                {t('welcometomyworld')}
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight text-white">
                                {userDetails?.fullname}
                            </h1>
                            <p className="text-2xl md:text-3xl font-bold text-indigo-400 mb-6 flex items-center justify-center md:justify-start gap-2">
                                <Sparkles size={24} className="text-violet-400" />
                                {userDetails?.category}
                                <Sparkles size={24} className="text-violet-400" />
                            </p>
                            <p className={`text-md  text-slate-400 max-w-2xl leading-relaxed mx-auto md:mx-0 ${userDetails?.displayLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                                {userDetails?.about}
                            </p>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[2rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                            <div className="relative">
                                <Image width={500} height={500}
                                    src={userDetails?.urlimage}
                                    alt={userDetails?.fullname}
                                    className="w-64 h-64 md:w-80 md:h-80 rounded-[1.8rem] object-cover border-4 border-slate-800 shadow-2xl transform transition duration-500 hover:scale-[1.02]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex justify-center md:justify-start pb-2">
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 p-1 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 w-full md:w-auto">
                            {(() => {
                                const sectionOrder = userDetails.sectionOrder && userDetails.sectionOrder.length > 0
                                    ? userDetails.sectionOrder
                                    : ["services", "experience", "projects", "skills", "education", "certificates"];

                                const tabsMap = {
                                    services: { key: "services", label: t('services'), icon: Layers, condition: userDetails?.services?.length > 0 },
                                    experience: { key: "experience", label: t('experience'), icon: Briefcase, condition: userDetails?.experience?.length > 0 },
                                    projects: { key: "projects", label: t('projects'), icon: Code2, condition: userDetails?.projects?.length > 0 },
                                    skills: { key: "skills", label: t('skills'), icon: Zap, condition: userDetails?.skills?.length > 0 },
                                    education: { key: "education", label: t('education'), icon: GraduationCap, condition: userDetails?.education?.length > 0 },
                                    certificates: { key: "certificates", label: t('certificates'), icon: Award, condition: userDetails?.certificates?.length > 0 },
                                };

                                const aboutTab = { key: "about", label: t('about'), icon: User };

                                const orderedTabs = [
                                    aboutTab,
                                    ...sectionOrder
                                        .filter(key => tabsMap[key])
                                        .map(key => tabsMap[key])
                                        .filter(tab => tab.condition !== false)
                                ];

                                return orderedTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap text-sm md:text-base ${activeTab === tab.key
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                                                }`}
                                        >
                                            <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                                            {tab.label}
                                        </button>
                                    );
                                });
                            })()}
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
                                    <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-5 md:p-8 border border-slate-800 shadow-lg">
                                        <h3 className="text-2xl mb-6 flex items-center gap-2 text-white">
                                            <User className="text-indigo-500" /> {t('aboutMe')}
                                        </h3>
                                        <div className="space-y-4 md:space-y-6">
                                            {userDetails.email && (
                                                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 shrink-0">
                                                        <Mail size={20} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm text-slate-400">Email</p>
                                                        <a href={`mailto:${userDetails.email}`} className="text-slate-200 hover:text-indigo-400 transition break-all text-sm md:text-base font-medium">
                                                            {userDetails.email}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                            {userDetails.country && (
                                                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                                    <div className="w-10 h-10 rounded-full bg-violet-900/50 flex items-center justify-center text-violet-400 shrink-0">
                                                        <Globe size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-400">{t('country')}</p>
                                                        <p className="text-slate-200 font-medium">{userDetails.country}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {userDetails.phoneNumber && (
                                                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                                    <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 shrink-0">
                                                        <Briefcase size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-400">{t('phone')}</p>
                                                        <p className="text-slate-200 font-medium">{userDetails.phoneNumber}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {userDetails?.languages?.length > 0 && (
                                        <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-8 border border-slate-800 shadow-lg">
                                            <h3 className="text-2xl mb-6 flex items-center gap-2 text-white">
                                                <Globe className="text-violet-500" /> {t('languages')}
                                            </h3>
                                            <div className="grid gap-3">
                                                {userDetails.languages?.map((lang, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors"
                                                    >
                                                        <span className="text-slate-200 font-medium">{lang}</span>
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
                                            className="group p-6 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl hover:bg-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <Layers className="text-indigo-400" size={24} />
                                            </div>
                                            <h4 className="text-lg text-white font-bold mb-2">{service}</h4>
                                            <p className="text-sm text-slate-400">Professional service tailored to your needs.</p>
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
                                            className="group bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500"
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
                                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/50 to-transparent mix-blend-multiply pointer-events-none"></div>
                                                    </div>
                                                )}
                                                <div className="flex-1 p-4 md:p-8">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                                            {project.title}
                                                        </h3>
                                                        {project.link && (
                                                            <a
                                                                href={project.link}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 text-slate-400"
                                                            >
                                                                <Globe size={20} />
                                                            </a>
                                                        )}
                                                    </div>

                                                    <p
                                                        onClick={() => setExpanded(expanded === i ? null : i)}
                                                        className={`text-slate-400 whitespace-pre-wrap mb-6 leading-relaxed cursor-pointer hover:text-slate-200 transition-colors ${expanded === i ? "line-clamp-none" : "line-clamp-4"
                                                            }`}
                                                    >
                                                        {project.description}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        {project.technologies?.map((tech, j) => (
                                                            <span
                                                                key={j}
                                                                className="px-3 py-1 bg-indigo-950/30 border border-indigo-900/50 rounded-full text-xs text-indigo-300 font-medium"
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
                                        <div key={i} className="p-5 md:p-6 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800 hover:shadow-lg transition-all duration-300">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-indigo-900/30 flex items-center justify-center text-indigo-400 shrink-0">
                                                        <Briefcase size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl text-white font-bold mb-1">{exp.role}</h3>
                                                        <div className="text-indigo-400 text-sm font-medium">{exp.company}</div>
                                                    </div>
                                                </div>
                                                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap font-medium">
                                                    {exp.startDate} - {exp.endDate}
                                                </span>
                                            </div>
                                            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap pl-0 sm:pl-[4rem]">
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
                                            className="group relative p-4 md:p-6 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl hover:bg-slate-800 hover:shadow-lg transition-all duration-300 overflow-hidden"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                                    <Zap size={20} className="text-yellow-500" />
                                                </div>
                                                <span className="text-slate-300 font-medium group-hover:text-white transition-colors text-start">{skill}</span>
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
                                            className="relative p-4 md:p-8 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl hover:shadow-xl transition-all duration-300 group overflow-hidden"
                                        >
                                            <div className={`absolute top-0 ${userDetails.displayLanguage === "ar" ? "left-0" : "right-0"} p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 ${edu.field ? "" : "hidden"}`}>
                                                <GraduationCap size={100} />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl text-white font-bold mb-2">{edu.degree || "Degree"}</h3>
                                                    <span className="inline-block px-3 py-1 mb-4 text-xs text-indigo-300 bg-indigo-950/30 rounded-full border border-indigo-900/50 font-medium">
                                                        {edu.startYear} - {edu.endYear || "Present"}
                                                    </span>
                                                </div>
                                                <p className="text-lg text-indigo-400 font-medium mb-4">{edu.school}</p>
                                                {edu.field && (
                                                    <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-indigo-500/50">
                                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{t('field')}</p>
                                                        <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                                                            {edu.field}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Certificates Tab */}
                            {activeTab === "certificates" && (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {userDetails.certificates?.map((cert, i) => (
                                        <div
                                            key={i}
                                            className="group relative bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl hover:bg-slate-800 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                                        >
                                            {cert.cfimage && (
                                                <div className="relative h-56 w-full bg-slate-900 overflow-hidden cursor-pointer border-b border-slate-700/50 flex items-center justify-center p-4" onClick={() => setSelectedImage(cert.cfimage)}>
                                                    <Image
                                                        src={cert.cfimage}
                                                        alt={cert.description || "Certificate"}
                                                        fill
                                                        className="object-contain p-2 hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-4 relative z-10 flex-1">
                                                {cert.description && (
                                                    <div className="text-slate-200 font-medium break-all">{cert.description}</div>
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
                <footer className="border-t border-slate-800 py-12">
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
                                        className="p-3 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-indigo-600 hover:border-indigo-500 hover:scale-110 hover:-translate-y-1 transition-all duration-300 group shadow-lg"
                                    >
                                        <Image width={500} height={500} src={item.icon} alt={item.name} className="w-6 h-6 transition-opacity" />
                                    </a>
                                ))}
                        </div>
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} {userDetails.fullname}. {t('allRightsReserved')} ©
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
