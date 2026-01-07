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

export default function ThemeThirteen({ userDetails, userLinks }) {
    const t = getTranslation(userDetails?.displayLanguage || 'en')
    const [activeTab, setActiveTab] = useState("about")
    const [showQR, setShowQR] = useState(false);
    const [showUserLinks, setShowUserLinks] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);



    return (
        <div
            style={{ backgroundColor: "#F8FAFC" }} // Slate-50 for a cleaner off-white
            dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
            className="min-h-screen text-slate-900 overflow-hidden relative selection:bg-indigo-100 selection:text-indigo-900"
        >
            <ImageModal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageSrc={selectedImage}
            />
            {/* Background Mesh Gradient - Subtle and Professional */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(224,242,254,0.7),transparent_50%)]"></div>
                <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] mix-blend-multiply opacity-60"></div>
                <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[100px] mix-blend-multiply opacity-60"></div>
            </div>

            <div className="relative z-10 px-4 md:px-8 max-w-6xl mx-auto">
                {/* Header */}
                <header className="pt-8 pb-10">
                    {/* Toolbar */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-slate-900 text-2xl font-extrabold tracking-tight cursor-pointer hover:text-blue-600 transition-colors">
                            <Link href={"https://dgtportfolio.com"}>{t('portfolio')}</Link>
                        </h1>
                        <div className="flex gap-3">
                            {/* Copy Link */}
                            <DownloadResume userDetails={userDetails} className="text-slate-700 bg-white border border-slate-200 hover:border-blue-500/50 hover:bg-slate-50 font-bold px-5 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-sm hover:shadow-md" />
                            {/* QR Code */}
                            <div
                                onClick={() => setShowQR(true)}
                                className="flex items-center gap-2 px-3 bg-white border border-slate-200 hover:border-blue-500/50 hover:bg-slate-50 rounded-xl text-slate-700 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                            >
                                <QrcodeProfile userDetails={userDetails} className="text-slate-700 border-none bg-transparent hover:bg-transparent shadow-none" isOpen={showQR} onClose={() => setShowQR(false)} />
                            </div>
                            {/* User Links */}
                            {userLinks?.length > 0 && (
                                <div
                                    onClick={() => setShowUserLinks(true)}
                                    className="flex items-center gap-2 px-3 bg-white border border-slate-200 hover:border-blue-500/50 hover:bg-slate-50 rounded-xl text-slate-700 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                                    <UserLinks lang={userDetails?.displayLanguage} userLinks={userLinks} className="text-slate-700 border-none bg-transparent hover:bg-transparent shadow-none" isOpen={showUserLinks} onClose={() => setShowUserLinks(false)} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className={`flex flex-col-reverse md:flex-row gap-10 items-center justify-between mb-8`}>
                        <div className={`flex-1 text-center  ${userDetails?.displayLanguage === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
                            <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wide text-blue-700 uppercase bg-blue-50 rounded-full border border-blue-100 shadow-sm">
                                {t('welcometomyworld')}
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-none text-slate-900 drop-shadow-sm">
                                {userDetails?.fullname}
                            </h1>
                            <p className="text-2xl md:text-3xl font-bold text-slate-700 mb-6 flex items-center justify-center md:justify-start gap-2">
                                <Sparkles size={24} className="text-amber-400 fill-amber-400" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                    {userDetails?.category}
                                </span>
                                <Sparkles size={24} className="text-amber-400 fill-amber-400" />
                            </p>
                            <p className={`text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto md:mx-0 font-medium ${userDetails?.displayLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                                {userDetails?.about}
                            </p>
                        </div>
                        <div className="relative group perspective-1000">
                            <div className="absolute -inset-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2rem] blur-lg opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative transform transition-all duration-500 hover:rotate-2">
                                <Image width={500} height={500}
                                    src={userDetails?.urlimage}
                                    alt={userDetails?.fullname}
                                    className="w-64 h-64 md:w-80 md:h-80 rounded-[1.8rem] object-cover border-[4px] border-white shadow-xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex justify-center md:justify-start pb-4">
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
                            {(() => {
                                const sectionOrder = userDetails?.sectionOrder && userDetails.sectionOrder?.length > 0
                                    ? userDetails.sectionOrder
                                    : ["services", "experience", "skills", "projects", "education", "certificates"];

                                const tabData = {
                                    about: { key: "about", label: t('aboutMe'), icon: User },
                                    services: { key: "services", label: t('services'), icon: Layers, condition: userDetails?.services?.length > 0 },
                                    experience: { key: "experience", label: t('workExperience'), icon: Briefcase, condition: userDetails?.experience?.length > 0 },
                                    projects: { key: "projects", label: t('projects'), icon: Code2, condition: userDetails?.projects?.length > 0 },
                                    skills: { key: "skills", label: t('skills'), icon: Zap, condition: userDetails?.skills?.length > 0 },
                                    education: { key: "education", label: t('education'), icon: GraduationCap, condition: userDetails?.education?.length > 0 },
                                    certificates: { key: "certificates", label: t('certificates'), icon: Award, condition: userDetails?.certificates?.length > 0 },
                                };

                                // Ensure 'about' is first, then the user ordered sections
                                const tabsToRender = ["about", ...sectionOrder]
                                    .map(key => tabData[key])
                                    .filter(tab => tab && tab.condition !== false);

                                return tabsToRender.map((tab) => {
                                    const Icon = tab.icon || User;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap text-sm font-medium ${activeTab === tab.key
                                                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 transform scale-[1.02]"
                                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                                }`}
                                        >
                                            <Icon size={18} />
                                            {tab.label}
                                        </button>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="min-h-[400px] pb-24">
                    {userDetails && (
                        <div className="animate-fadeIn">
                            {/* About Tab */}
                            {activeTab === "about" && (
                                <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                                    <div className="bg-white rounded-3xl p-5 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                                        <h3 className="text-2xl mb-6 flex items-center gap-2 text-slate-800 font-bold">
                                            <User className="text-blue-600" /> {t('aboutMe')}
                                        </h3>
                                        <div className="space-y-4 md:space-y-6">
                                            {userDetails.email && (
                                                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                                                        <Mail size={20} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</p>
                                                        <a href={`mailto:${userDetails.email}`} className="text-slate-900 hover:text-blue-600 transition break-all text-sm md:text-base font-bold">
                                                            {userDetails.email}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                            {userDetails.country && (
                                                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
                                                        <Globe size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{t('country')}</p>
                                                        <p className="text-slate-900 font-bold">{userDetails.country}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {userDetails.phoneNumber && (
                                                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-600 shrink-0">
                                                        <Briefcase size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{t('phone')}</p>
                                                        <p className="text-slate-900 font-bold">{userDetails.phoneNumber}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {userDetails?.languages?.length > 0 && (
                                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                                            <h3 className="text-2xl mb-6 flex items-center gap-2 text-slate-800 font-bold">
                                                <Globe className="text-indigo-600" /> {t('languages')}
                                            </h3>
                                            <div className="grid gap-3">
                                                {userDetails.languages?.map((lang, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors"
                                                    >
                                                        <span className="text-slate-700 font-bold text-lg">{lang}</span>
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
                                            className="group p-6 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <Layers size={24} className="text-blue-600" />
                                            </div>
                                            <h4 className="text-lg text-slate-900 font-bold mb-2">{service}</h4>
                                            <p className="text-slate-500 font-medium text-sm leading-relaxed"></p>
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
                                            className="group bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] overflow-hidden transition-all duration-500"
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
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none"></div>
                                                    </div>
                                                )}
                                                <div className="flex-1 p-4 md:p-8">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h3 className="text-2xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                            {project.title}
                                                        </h3>
                                                        {project.link && (
                                                            <a
                                                                href={project.link}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="p-2 bg-slate-100 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 text-slate-600 shadow-sm"
                                                            >
                                                                <Globe size={20} />
                                                            </a>
                                                        )}
                                                    </div>

                                                    <p
                                                        onClick={() => setExpanded(expanded === i ? null : i)}
                                                        className={`text-slate-600 whitespace-pre-wrap mb-6 leading-relaxed cursor-pointer hover:text-slate-900 transition-colors ${expanded === i ? "line-clamp-none" : "line-clamp-4"
                                                            }`}
                                                    >
                                                        {project.description}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        {project.technologies?.map((tech, j) => (
                                                            <span
                                                                key={j}
                                                                className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs text-blue-600 font-bold"
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
                                        <div key={i} className="p-5 md:p-6 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-blue-200 transition-all duration-300">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                                                        <Briefcase size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl text-slate-900 font-bold mb-1">{exp.role}</h3>
                                                        <div className="text-blue-600 text-sm">{exp.company}</div>
                                                    </div>
                                                </div>
                                                <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200 whitespace-nowrap">
                                                    {exp.startDate} - {exp.endDate}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap pl-0 sm:pl-[4rem] font-medium">
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
                                            className="group relative p-4 md:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-full bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <Zap size={20} className="text-amber-500 fill-amber-500" />
                                                </div>
                                                <span className="text-slate-700 font-bold group-hover:text-slate-900 transition-colors">{skill}</span>
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
                                            className="relative p-4 md:p-8 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group overflow-hidden"
                                        >
                                            <div className={`absolute top-0 ${userDetails.displayLanguage === "ar" ? "left-0" : "right-0"} p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 ${edu.field ? "" : "hidden"}`}>
                                                <GraduationCap size={100} className="text-slate-900" />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl text-slate-900 font-bold mb-2">{edu.degree || "Degree"}</h3>
                                                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-blue-700 bg-blue-50 rounded-full border border-blue-100 uppercase tracking-wider">
                                                        {edu.startYear} - {edu.endYear || "Present"}
                                                    </span>
                                                </div>
                                                <p className="text-lg text-blue-600 font-semibold mb-4">{edu.school}</p>

                                                {edu.field && (
                                                    <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">{t('field')}</p>
                                                        <p className="text-sm md:text-base text-slate-700 font-medium leading-relaxed">
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
                                            className="relative bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group flex flex-col"
                                        >
                                            {cert.cfimage && (
                                                <div className="relative h-56 w-full bg-slate-50 overflow-hidden cursor-pointer flex items-center justify-center p-4 border-b border-slate-50" onClick={() => setSelectedImage(cert.cfimage)}>
                                                    <Image
                                                        src={cert.cfimage}
                                                        alt={cert.description || "Certificate"}
                                                        fill
                                                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-4 relative z-10 flex-1 bg-white">
                                                {cert.description && (
                                                    <div className="text-slate-700 font-medium break-all">{cert.description}</div>
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
                <footer className="border-t border-slate-200 py-12 mt-10 bg-slate-50/50 -mx-4 md:-mx-6 px-4 md:px-6">
                    <div className="flex flex-col items-center gap-8 max-w-5xl mx-auto">
                        <div className="flex flex-wrap justify-center gap-6">
                            {[
                                { name: "linkedin", url: userDetails?.socials?.linkedin, icon: "/icons/linkedin.svg" },
                                { name: "github", url: userDetails?.socials?.github, icon: "/icons/github.svg" },
                                { name: "facebook", url: userDetails?.socials?.fb, icon: "/icons/facebook.svg" },
                                { name: "whatsapp", url: userDetails?.socials?.whatsapp, icon: "/icons/whatsapp.svg" },
                                { name: "tiktok", url: userDetails?.socials?.tiktok, icon: "/icons/tiktok.svg" },
                                { name: "reddit", url: userDetails?.socials?.reddit, icon: "/icons/reddit.svg" },
                                { name: "twitch", url: userDetails?.socials?.twitch, icon: "/icons/twitch.svg" },
                                { name: "instagram", url: userDetails?.socials?.instagram, icon: "/icons/instagram.svg" },
                                { name: "snapchat", url: userDetails?.socials?.snapchat, icon: "/icons/snapchat.svg" },
                                { name: "twitter", url: userDetails?.socials?.twitter, icon: "/icons/twitter.svg" },
                                { name: "youtube", url: userDetails?.socials?.youtube, icon: "/icons/youtube.svg" },
                                { name: "telegram", url: userDetails?.socials?.telegram, icon: "/icons/telegram.svg" },
                            ]
                                .filter((item) => item.url)
                                .map((item, i) => (
                                    <a
                                        href={item.url}
                                        key={i}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group shadow-sm"
                                    >
                                        <Image width={500} height={500} src={item.icon} alt={item.name} className="w-6 h-6 transition-opacity" />
                                    </a>
                                ))}
                        </div>
                        <p dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'} className="text-slate-400 font-medium text-sm">
                            © {new Date().getFullYear()} {userDetails?.fullname}. {t('allRightsReserved')} ©
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
          animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .perspective-1000 {
            perspective: 1000px;
        }
      `}</style>
        </div>
    )
}
