"use client"
import { useState } from "react"
import { Briefcase, CheckCircle2, Copy, Mail } from "lucide-react"
import QrcodeProfile from "../../[username]/components/QrcodeProfile"
import UserLinks from "../../[username]/components/UserLinks"
import Image from "next/image"
import Link from "next/link"

export default function ThemeTwo({ userDetails, userLinks,bgcolor }) {
  const [activeTab, setActiveTab] = useState("about")
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const PORTFOLIO = `https://${userDetails?.username}.dgtportfolio.com`


  const copyProfileLink = () => {
    const urlToCopy = PORTFOLIO
    navigator.clipboard.writeText(urlToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      style={{ backgroundColor:bgcolor || userDetails?.bgcolorp || "#0E201D" }}
      className="min-h-screen text-white overflow-hidden">
      <div className="relative z-10 px-4 md:px-6">
        {/* Header */}
        <header className="pt-7 pb-8">
          <div className="max-w-4xl mx-auto">
            {/* Top toolbar */}
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-white text-2xl font-bold cursor-pointer">
                <Link href={"https://dgtportfolio.com"}>Portfolio</Link>
              </h1>
              <div className="flex gap-3">
                {/* // Copy link and QR code buttons */}
                <button
                  title="Copy Link Profile"
                  onClick={copyProfileLink}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10"
                >
                  {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  {/* {copied ? "Copied" : "Copy Link"} */}
                  {copied}
                </button>
                 {/* // Qrcode */}
                <div
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center gap-2 px-2 cursor-pointer bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10"
                >
                <QrcodeProfile path={`/${userDetails?.username}`} userDetails={userDetails} />
                </div>
                {/* // User Links */}
                <div
                  className="flex items-center gap-2 px-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10"
                >
                  <UserLinks userLinks={userLinks} />
                </div>
              </div>
            </div>

            {/* Header Content */}
            <div className="flex flex-col-reverse md:flex-row gap-8 items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-6xl font-black mb-4">{userDetails?.fullname}</h1>
                <p className="text-2xl text-blue-200 font-semibold">{userDetails?.category}</p>
                <p className="text-gray-300 mt-4 max-w-lg leading-relaxed">{userDetails?.about}</p>
              </div>
              <div className="relative">
                <div className="absolute bg-gray-50 animate-pulse inset-0 rounded-3xl blur-2xl opacity-75"></div>
                <Image width={500} height={500}
                  src={userDetails?.urlimage}
                  alt={userDetails?.fullname}
                  className="relative imganim md:w-72 md:mb-5 md:h-80 w-52 h-56 rounded-lg object-cover border-4 border-white/20"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 flex-wrap">
              {[
                { key: "about", label: "About" },
                { key: "services", label: "Services", condition: userDetails?.services?.length > 0 },
                { key: "experience", label: "Experience", condition: userDetails?.experience?.length > 0 },
                { key: "projects", label: "Projects", condition: userDetails?.projects?.length > 0 },
                { key: "skills", label: "Skills", condition: userDetails?.skills?.length > 0 },
                { key: "education", label: "Education", condition: userDetails?.education?.length > 0 },
              ]
                .filter((tab) => tab.condition !== false)
                .map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-3 font-semibold border-b-2 transition capitalize ${
                      activeTab === tab.key
                        ? "border-gray-400 text-gray-300"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
            </div>
          </div>
        </header>

        {/* Content */}
          <div className="max-w-5xl mx-auto pb-20">
            {/* About */}
            {activeTab === "about" && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-black mb-6">About Me</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{userDetails.about}</p>
                  <div className="space-y-4">
                    {userDetails.country && (
                      <div className="flex gap-4">
                        <span className="text-gray-400 font-bold">Location:</span>
                        <span className="text-gray-300">{userDetails.country}</span>
                      </div>
                    )}
                    {userDetails.email && (
                      <div className="flex gap-4">
                        <span className="text-gray-400 font-bold">Email:</span>
                        <a href={`mailto:${userDetails.email}`} className="text-gray-300 hover:text-gray-100 transition">
                          {userDetails.email}
                        </a>
                      </div>
                    )}
                    {userDetails.phoneNumber && (
                      <div className="flex gap-4">
                        <span className="text-gray-400 font-bold">Phone:</span>
                        <span className="text-gray-300">{userDetails.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-6">Languages</h3>
                  <div className="space-y-3">
                    {userDetails.languages?.map((lang, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:border-gray-400/50 transition"
                      >
                        <p className="text-gray-200">{lang}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Services */}
            {activeTab === "services" && (
              <div className="grid md:grid-cols-2 gap-6">
                {userDetails.services?.map((service, i) => (
                  <div
                    key={i}
                    className="p-3 md:p-6 bg-white/20 border border-gray-500/30 rounded-lg hover:border-gray-400/60 transition hover:scale-105 transform"
                  >
                    <p className="text-gray-200">{service}</p>
                  </div>
                ))}
              </div>
            )}
             {/* Projects */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                {userDetails.projects?.map((project, i) => (
                  <div
                    key={i}
                    className="group p-4 md:p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:border-gray-400/50 hover:bg-white/15 transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-gray-300 group-hover:text-gray-100 transition">
                        {project.title}
                      </h3>
                      {project.image && (
                        <Image width={500} height={500} src={project.image} alt={project.title} className="w-20 h-20 rounded-lg object-cover" />
                      )}
                    </div>
                    <p onClick={() => setExpanded(!expanded)}
                          className={`
                            text-white/80 mb-4 whitespace-pre-line cursor-pointer transition-all duration-300
                            ${expanded ? "line-clamp-none" : "line-clamp-3"}
                          `}
                        >
                          {project.description}
                  </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-500/20 border border-gray-500/40 rounded-full text-xs text-gray-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a
                      href={project.link}
                      target="_blank"
                      className="inline-block px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition font-semibold"
                      rel="noreferrer"
                    >
                      View →
                    </a>
                  </div>
                ))}
              </div>
            )}
             {/* Experience */}
            {activeTab === "experience" && (
              <div className="space-y-6">
                {userDetails.experience?.map((exp, i) => (
                  <div
                    key={i}
                    className="p-4 md:p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:border-gray-400/50 transition"
                  >
                    <div className="flex gap-4 mb-4">
                      <Briefcase className="text-gray-400 flex-shrink-0" size={24} />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-300">{exp.role}</h3>
                        <p className="text-gray-300 font-semibold">{exp.company}</p>
                        <p className="text-gray-400 text-sm">
                          {exp.startDate} - {exp.endDate}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-gray-300 whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

             {/* Skills */}
            {activeTab === "skills" && (
              <div className="grid md:grid-cols-2 gap-6">
                {userDetails.skills?.map((skill, i) => (
                  <div
                    key={i}
                    className="p-3 md:p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:border-gray-400/50 transition"
                  >
                    <p className="text-gray-200">{skill}</p>
                  </div>
                ))}
              </div>
            )}

             {/* Education */}
            {activeTab === "education" && (
              <div className="space-y-6 md:mx-32 text-gray-300">
                {userDetails.education?.map((edu, i) => (
                  <div
                    key={i}
                    className="p-3 md:p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:border-pink-500/50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{edu.degree || "Degree"}</h3>
                      <p className="text-sm mt-1">
                        {edu.startYear} - {edu.endYear || "Present"}
                      </p>
                    </div>
                    <p className="font-semibold">{edu.school}</p>
                    {edu.field && <p className="text-sm">{edu.field}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/30 backdrop-blur-md py-8 md:py-12">
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
                ]
                .filter((item) => item.url)
                .map((item, i) => (
                  <a
                    href={item.url}
                    key={i}
                    className="p-3 bg-white rounded-full transition hover:scale-105 duration-300"
                  >
                    <Image width={500} height={500} src={item.icon} alt={item.name} className="w-7 h-7" />
                  </a>
                ))}
            </div>
            <p className="text-gray-400">© {new Date().getFullYear()} {userDetails.fullname}. All rights reserved.</p>
          </div>
        </footer>
      </div>
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  )
}
