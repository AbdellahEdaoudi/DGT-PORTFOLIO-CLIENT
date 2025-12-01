"use client"
import { useState, useEffect } from "react"
import {
    Github, Linkedin, Mail, Code2, Briefcase, CheckCircle2, Copy,
    GraduationCap, Globe, Sparkles, User, Layers, Zap, Rocket, Star, Moon,
    ArrowUpRight
} from "lucide-react"
import QrcodeProfile from "../../[username]/components/QrcodeProfile"
import UserLinks from "../../[username]/components/UserLinks"
import Image from "next/image"
import Link from "next/link"

export default function ThemeEleven({ userDetails, userLinks }) {
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const PORTFOLIO = `https://${userDetails?.username}.dgtportfolio.com`

    const copyProfileLink = () => {
        const urlToCopy = PORTFOLIO
        navigator.clipboard.writeText(urlToCopy).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

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

    return (
        <div className="min-h-screen bg-[#050510] text-cyan-50 font-mono overflow-x-hidden relative selection:bg-cyan-500 selection:text-black">

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
                <header className="flex justify-between items-center mb-8 border-b border-cyan-900/50 pb-4 backdrop-blur-sm gap-4">
                    <div className="flex items-center gap-2">
                        <Rocket className="text-cyan-400" />
                        <Link href="https://dgtportfolio.com" className="text-lg md:text-xl font-bold tracking-widest uppercase text-cyan-400 hover:text-cyan-300 shadow-cyan-500/50 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
                            <span className="text-white">PORTFOLIO</span>
                        </Link>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={copyProfileLink} className="group relative px-4 py-2 border border-cyan-500/30 bg-cyan-950/30 rounded hover:bg-cyan-500/20 transition-all">
                            {copied ? <CheckCircle2 className="text-green-400" /> : <Copy className="text-cyan-400" />}
                        </button>
                        <div onClick={() => setShowQR(!showQR)} className="cursor-pointer px-2 py-2 border border-cyan-500/30 bg-cyan-950/30 rounded hover:bg-cyan-500/20 transition-all text-cyan-400 font-bold text-xs flex items-center">
                            <QrcodeProfile path={`/${userDetails?.username}`} userDetails={userDetails} />
                        </div>
                        <div onClick={() => setShowQR(!showQR)} className="cursor-pointer px-2 py-2 border border-cyan-500/30 bg-cyan-950/30 rounded hover:bg-cyan-500/20 transition-all text-cyan-400 font-bold text-xs flex items-center">
                            <UserLinks userLinks={userLinks} />
                        </div>
                        
                    </div>
                </header>

                {/* Main Interface */}
                <main className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column: Profile */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden border-4 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                                <Image
                                    src={userDetails?.urlimage}
                                    alt={userDetails?.fullname}
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                                {/* Scanline effect */}
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30"></div>
                            </div>
                        </div>

                        <div className="text-center lg:text-left">
                            <div className="inline-block px-2 py-1 mb-2 border border-cyan-500/50 text-xs text-cyan-400 uppercase tracking-[0.2em] bg-cyan-950/50">
                                Identity Verified
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

                        {/* Services Module */}
                        {userDetails?.services?.length > 0 && (
                            <section>
                                <h3 className="text-cyan-400 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-cyan-500"></span>
                                    System Capabilities
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
                        )}

                        {/* Experience Module */}
                        {userDetails?.experience?.length > 0 && (
                            <section>
                                <h3 className="text-cyan-400 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-cyan-500"></span>
                                    Mission Log
                                </h3>
                                <div className="space-y-4">
                                    {userDetails.experience.map((exp, i) => (
                                        <div key={i} className="relative pl-6 border-l border-cyan-500/30 pb-4 last:pb-0">
                                            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-black border border-cyan-500 rounded-full"></div>
                                            <div className="flex flex-col sm:flex-row justify-between items-start mb-1 gap-1">
                                                <h4 className="text-lg font-bold text-white">{exp.role}</h4>
                                                <span className="text-xs text-cyan-400 font-mono border border-cyan-500/30 px-2 py-0.5 rounded bg-cyan-950/30 whitespace-nowrap">
                                                    {exp.startDate} - {exp.endDate}
                                                </span>
                                            </div>
                                            <p className="text-purple-300 text-sm mb-2">{exp.company}</p>
                                            <p className="text-cyan-100/60 text-sm">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects Module */}
                        {userDetails?.projects?.length > 0 && (
                            <section>
                                <h3 className="text-cyan-400 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-cyan-500"></span>
                                    Deployed Projects
                                </h3>
                                <div className="grid gap-4">
                                    {userDetails.projects.map((project, i) => (
                                        <div key={i} className="flex flex-col sm:flex-row gap-4 bg-black/40 border border-cyan-500/20 p-4 hover:border-cyan-500/50 transition-all group">
                                            {project.image && (
                                                <div className="w-full sm:w-24 h-48 sm:h-24 bg-cyan-900/20 flex-shrink-0 overflow-hidden border border-cyan-500/20">
                                                    <Image src={project.image} alt={project.title} width={300} height={300} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-cyan-50 text-lg group-hover:text-cyan-400 transition-colors">{project.title}</h4>
                                                    {project.link && <a href={project.link} target="_blank" className="text-cyan-500 hover:text-white"><ArrowUpRight size={18} /></a>}
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
                        )}

                        {/* Skills Module */}
                        {userDetails?.skills?.length > 0 && (
                            <section>
                                <h3 className="text-cyan-400 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-cyan-500"></span>
                                    Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {userDetails.skills.map((skill, i) => (
                                        <div key={i} className="px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-100 text-sm hover:bg-cyan-500 hover:text-black transition-all cursor-default clip-path-slant">
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Socials Module */}
                        {userDetails.socials && Object.values(userDetails.socials).some(url => url) && (
                            <section>
                                <h3 className="text-cyan-400 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-cyan-500"></span>
                                    Communication Channels
                                </h3>
                                <div className="flex flex-wrap gap-4">
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
                    <p>End of Transmission /// © {new Date().getFullYear()} {userDetails?.fullname}</p>
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
        </div>
    )
}
