"use client"
import { useState } from "react"
import {ArrowUpRight, Zap, Mail, Copy, CheckCircle2 } from "lucide-react"
import UserLinks from "../../[username]/components/UserLinks"
import QrcodeProfile from "../../[username]/components/QrcodeProfile"
import Image from "next/image"
import MagicalLoader from "../MagicalLoader"

export default function ThemeFive({ userDetails, userLinks }) {
  const [hoveredProject, setHoveredProject] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000"
  const [expanded, setExpanded] = useState(false);


  const copyProfileLink = () => {
    const urlToCopy = `${CLIENT_URL}/${userDetails.username}`
    navigator.clipboard.writeText(urlToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  if (!userDetails || !userLinks) {return <MagicalLoader />}

  return (
    <div className="min-h-screen bg-zinc-900 text-white overflow-x-hidden">
      {userDetails && (
        <div className="md:px-20 px-4">
          {/* Hero Section */}
          <section className="pt-8">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-8 gap-4">
              <h1 className="text-2xl font-bold">Portfolio</h1>
              <div className="flex flex-wrap gap-3">
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

            <div className="flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-8">
              <div className="flex-1 mb-4">
                <p className="text-yellow-400 font-semibold uppercase tracking-widest mb-2">Hello, I'm</p>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 leading-tight">
                  {userDetails.fullname.split(" ")[0]}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    {userDetails.fullname.split(" ")[1]}
                  </span>
                </h1>
                <p className="text-2xl text-yellow-400 font-bold mb-4">{userDetails.category}</p>
                <p className="text-md md:block hidden text-gray-300 mb-6 leading-relaxed max-w-lg">{userDetails.about}</p>
                <a
                  href={`mailto:${userDetails.email}`}
                  className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg font-bold text-black hover:shadow-lg hover:shadow-yellow-500/50 transition transform hover:scale-105"
                >
                  Let's Talk
                </a>
              </div>
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-3xl blur-2xl"></div>
                <Image width={300} height={300}
                  src={userDetails.urlimage}
                  alt={userDetails.fullname}
                  className="relative rounded-3xl border-2 border-yellow-500/30"
                />
              </div>
            </div>
          </section>

          {/* About, Services, Info */}
          {userDetails.about?.length > 0 &&(
            <section className="py-10 border-t border-zinc-800">
            <div className={`grid ${userDetails.services.length > 0 ? "md:grid-cols-3" :"md:grid-cols-3"}  gap-8`}>
              <div>
                <p className="text-yellow-400 font-bold uppercase tracking-widest mb-2 text-sm">About</p>
                <h2 className="text-3xl sm:text-4xl font-black mb-4">Who I am</h2>
                <p className="text-gray-300 leading-relaxed">{userDetails.about}</p>
              </div>
              {userDetails.services.length > 0 && (
                <div>
                <p className="text-yellow-400 font-bold uppercase tracking-widest mb-2 text-sm">Services</p>
                <div className="space-y-3">
                  {userDetails.services?.map((service, i) => (
                    <div key={i} className="p-3 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-yellow-500/50 transition">
                      <p className="text-gray-200 text-sm">{service}</p>
                    </div>
                  ))}
                </div>
              </div>
              )}
              <div>
                <p className="text-yellow-400 font-bold uppercase tracking-widest mb-2 text-sm">Info</p>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-500 uppercase mb-1">Location</p>
                    <p className="text-white">{userDetails.country}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase mb-1">Email</p>
                    <a href={`mailto:${userDetails.email}`} className="text-yellow-400 hover:text-yellow-300 transition">
                      {userDetails.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase mb-1">Phone</p>
                    <p className="text-white">{userDetails.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          )}
          
          {/* Experience */}
          {userDetails.experience?.length > 0 && (
            <section className="py-10 border-t border-zinc-800">
              <h2 className="text-3xl sm:text-4xl font-black mb-8">Experience</h2>
              <div className="space-y-4">
                {userDetails.experience.map((exp, i) => (
                  <div key={i} className="p-4 sm:p-6 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-yellow-500/50 transition">
                    <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-1">{exp.role}</h3>
                    <p className="text-gray-300 mb-1">{exp.company}</p>
                    <p className="text-gray-500 text-sm mb-2">{exp.startDate} - {exp.endDate}</p>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {/* Skills */}
          {userDetails.skills?.length > 0 && (
          <section className="py-10 border-t border-zinc-800">
            <h2 className="text-3xl sm:text-4xl font-black mb-8">Skills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {userDetails.skills?.map((skill, i) => (
                <div
                  key={i}
                  className="group p-4 sm:p-6 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-yellow-500/50 hover:bg-zinc-800 transition cursor-pointer"
                >
                  <Zap className="mb-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition" size={20} />
                  <p className="text-sm text-gray-300 group-hover:text-yellow-300 transition">{skill}</p>
                </div>
              ))}
            </div>
          </section>
          )}

          {/* Projects */}
          {userDetails.projects?.length > 0 && (
            <section className="py-12 border-t border-zinc-700">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-10 text-center text-white">
                Featured Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userDetails.projects.map((project, i) => (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredProject(i)}
                    onMouseLeave={() => setHoveredProject(null)}
                    className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-700 hover:border-yellow-400/60 shadow-lg hover:shadow-yellow-400/10 transition-all duration-500 cursor-pointer"
                  >
                    {project.image && (
                      <Image width={500} height={500}
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-yellow-400 group-hover:text-yellow-300 transition">
                        {project.title}
                      </h3>
                  
                      <p
                        onClick={() => setExpanded(expanded === i ? null : i)}
                        className={`text-sm text-gray-300 leading-relaxed mb-4 cursor-pointer transition-all duration-300 whitespace-pre-wrap ${
                          expanded === i ? "line-clamp-none" : "line-clamp-3"
                        }`}
                      >
                        {project.description}
                      </p>
                      
                      {/* التقنيات */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies?.map((tech, j) => (
                          <span
                            key={j}
                            className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-yellow-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      {/* الرابط */}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold transition"
                        >
                          View Project <ArrowUpRight size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}


          {/* Languages (improved design) */}
            {userDetails.languages?.length > 0 && (
              <section className="py-10 border-t border-zinc-800">
                <h2 className="text-3xl sm:text-4xl font-black mb-6">Languages</h2>
                <div className="flex flex-wrap gap-4">
                  {userDetails.languages.map((lang, i) => (
                    <div
                      key={i}
                      className="relative group px-4 hover:border-yellow-300 py-2 rounded-xl cursor-pointer overflow-hidden border border-zinc-700 bg-zinc-800/60 text-gray-200 font-semibold transition"
                    >
                      <span className="relative z-10">{lang}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

        </div>
        
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
                        className="p-3 bg-white text-gray-400 transition border rounded-full"
                      >
                        <Image width={500} height={500} src={social.icon} alt={social.name} className="w-5 h-5" />
                      </a>
                    )
                  )}
                </div>
                <p className="text-gray-400">© {new Date().getFullYear()} {userDetails.fullname}. All rights reserved.</p>
              </div>
        </footer>
         )}
         
    </div>
  )
}
