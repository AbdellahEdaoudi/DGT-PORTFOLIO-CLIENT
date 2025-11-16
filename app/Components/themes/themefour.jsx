"use client"
import { useState } from "react"
import { Github, Linkedin, Mail, ChevronDown, Sparkles, CheckCircle2, Copy } from "lucide-react"
import QrcodeProfile from "../../[username]/components/QrcodeProfile";
import UserLinks from "../../[username]/components/UserLinks";
import MagicalLoader from "../MagicalLoader";
import Image from "next/image";

export default function ThemeFour({ userDetails, userLinks }) {
  const [expandedProject, setExpandedProject] = useState(-1);
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
  if (!userDetails || !userLinks) {return <MagicalLoader />}

  return (
    <div>
      {userDetails && (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
          {/* Animated background */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-950 to-blue-900/30"></div>
            <div className="absolute top-20 left-1/3 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-screen blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
          </div>

          <div className="relative z-10">
            {/* Header */}
        <header className="pt-7 px-6 pb-8">
          <div className="max-w-5xl mx-auto">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Portfolio</h1>
              <div className="flex gap-3">
                {/* Copy Link */}
                <button
                  title="Copy Link Profile"
                  onClick={copyProfileLink}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10"
                >
                  {copied ? <CheckCircle2 /> : <Copy />}
                </button>
                {/* QR Code */}
                <div
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center gap-2 px-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10"
                >
                  <QrcodeProfile path={`/${userDetails?.username}`} userDetails={userDetails} />
                </div>
                {/* User Links */}
                <div className="flex items-center gap-2 px-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10">
                  <UserLinks userLinks={userLinks} />
                </div>
              </div>
            </div>

            {/* Header Content */}
            <div className="flex flex-col-reverse md:flex-row gap-8 items-center justify-between mb-10">
              <div>
                <h1 className="text-5xl md:text-6xl font-black mb-4">{userDetails?.fullname}</h1>
                <p className="text-2xl text-emerald-300 font-semibold mb-6 flex items-center  gap-2">
                  <Sparkles size={24} />
                  {userDetails.category}
                  <Sparkles size={24} />
                </p>
                <div className="text-gray-300 mt-4 max-w-lg leading-relaxed">
                 {userDetails?.about}
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  {userDetails.country && (
                    <div className="flex gap-2"><span className="font-bold text-emerald-400">Location:</span> <span className="text-gray-300">{userDetails.country}</span></div>
                  )}
                  {userDetails.email && (
                    <div className="flex gap-2"><span className="font-bold text-emerald-400">Email:</span> <a href={`mailto:${userDetails.email}`} className="text-gray-300 hover:text-emerald-300">{userDetails.email}</a></div>
                  )}
                  {userDetails.phoneNumber && (
                    <div className="flex gap-2"><span className="font-bold text-emerald-400">Phone:</span> <span className="text-gray-300">{userDetails.phoneNumber}</span></div>
                  )}
                </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-white to-blue-400 rounded-3xl blur-2xl opacity-75"></div>
                <Image width={500} height={500}
                  src={userDetails?.urlimage}
                  alt={userDetails?.fullname}
                  className="relative Image width={500} height={500}anim md:w-80 md:h-80 w-40 h-40 rounded-lg object-cover border-4 border-white/20"
                />
              </div>
            </div>
            
          </div>
        </header>

            {/* Services */}
            {userDetails.services?.length > 0 && (
              <section className="py-10 px-6 border-t border-emerald-500/20">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-4xl font-black mb-6">Services</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {userDetails.services.map((service, i) => (
                      <div key={i} className="p-4 md:p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:border-emerald-500/60 transition">
                        <p className="text-sm md:text-base text-gray-200">{service}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Experience */}
            {userDetails.experience?.length > 0 && (
              <section className="py-10 px-6 border-t border-emerald-500/20">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-4xl font-black mb-6">Experience</h2>
                  <div className="space-y-6">
                    {userDetails.experience.map((exp, i) => (
                      <div key={i} className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:border-emerald-500/60 transition">
                        <h3 className="text-xl md:text-2xl font-bold text-emerald-300">{exp.role}</h3>
                        <p className="text-emerald-400 font-semibold">{exp.company}</p>
                        <p className="text-gray-400 text-sm">{exp.startDate} - {exp.endDate}</p>
                        <p className="py-1 text-sm">Description :</p>
                        <p className="text-gray-300  text-sm whitespace-pre-wrap">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Projects */}
            {userDetails.projects?.length > 0 && (
              <section className="py-10 px-6 border-t border-emerald-500/20">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-4xl font-black mb-6">Projects</h2>
                  <div className="space-y-6">
                    {userDetails.projects.map((project, i) => (
                      <div
                        key={i}
                        className="cursor-pointer p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:border-emerald-500/60 transition"
                        onClick={() => setExpandedProject(expandedProject === i ? -1 : i)}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-2xl font-bold text-emerald-300">{project.title}</h3>
                          <ChevronDown className={`text-emerald-400 transition transform ${expandedProject === i ? "rotate-180" : ""}`} size={24} />
                        </div>

                        {expandedProject === i && (
                          <div className="mt-4 space-y-4">
                            {project.image && <Image width={500} height={500} src={project.image || "/placeholder.svg"} alt={project.title} className="w-full rounded-lg" />}
                            <p className="text-sm md:text-base text-gray-300 whitespace-pre-wrap">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies?.map((tech, j) => (
                                <span key={j} className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-xs text-emerald-300">{tech}</span>
                              ))}
                            </div>
                            {project.link && (
                              <a href={project.link} target="_blank" rel="noreferrer" className="inline-block px-6 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition font-semibold">
                                View Project →
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Skills */}
            {userDetails.skills?.length > 0 && (
              <section className="py-10 px-6 border-t border-emerald-500/20">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-4xl font-black mb-6">Skills</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {userDetails.skills.map((skill, i) => (
                      <div key={i} className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/60 transition">
                        <p className="text-gray-200">{skill}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Languages */}
            {userDetails.languages?.length > 0 && (
              <section className="py-10 px-6 border-t border-emerald-500/20">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-4xl font-black mb-6">Languages</h2>
                  <div className="flex flex-wrap gap-4">
                    {userDetails.languages.map((lang, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-gray-200 hover:border-emerald-500/60 transition"
                      >
                        {lang}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Footer */}
            {userDetails.socials && (
              <footer className="border-t border-emerald-500/20 bg-black/50 backdrop-blur-md py-12 px-6">
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
                  { name: "tiktok", url: userDetails.socials.tik, icon: "/Icons/tik.svg" },
                  { name: "google", url: userDetails.socials.google, icon: "/Icons/google.svg" },
                ].filter((item) => item.url)
                  .map((social, i) => 
                    social.url && (
                      <a
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-white text-gray-400  transition border rounded-full"
                      >
                        <Image width={500} height={500} src={social.icon} alt={social.name} className="w-5 h-5" />
                      </a>
                    )
                  )}
                </div>
                <p className="text-gray-400">© {new Date().getFullYear()} {userDetails.fullname}. All rights reserved.</p>
              </div>
            </footer>
            ) }
          </div>
        </div>
      )}
    </div>
  )
}
