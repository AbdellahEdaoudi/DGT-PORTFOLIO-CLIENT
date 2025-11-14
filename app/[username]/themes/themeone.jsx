"use client"
import { useState} from "react"
import {
  Mail,
  Phone,
  MapPin,
  Copy,
  CheckCircle2,
  Globe,
} from "lucide-react"
import QrcodeProfile from "../components/QrcodeProfile"
import UserLinks from "../components/UserLinks"

export default function Themeone({userDetails,userLinks,bgcolor}) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000"
  const copyProfileLink = () => {
    const urlToCopy = `${CLIENT_URL}/${userDetails.username}`
    navigator.clipboard.writeText(urlToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div
      className="b min-h-screen relative overflow-hidden"
      style={{ backgroundColor: bgcolor || userDetails?.bgcolorp || "#OA3C4D" }}
    >
        
      <div className="">
        {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header section */}
        <section className="pt-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Top toolbar */}
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-white text-2xl font-bold">Portfolio</h1>
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
                  className="flex items-center gap-2 px-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md border border-white/10"
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

            {/* Main profile card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 md:p-8 mb-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-3 md:gap-8 items-start">
                {/* Profile picture */}
                <div className="flex-shrink-0 flex items-center gap-2 ">
                  <div className="relative w-24 h-24 md:w-40 md:h-40">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-full blur-xl"></div>
                    <img
                      src={userDetails?.urlimage}
                      alt={userDetails?.fullname}
                      className="relative w-full h-full rounded-full object-cover border-4 border-white/30 shadow-2xl"
                    />
                    {userDetails?.isOnline && (
                      <div className="absolute bottom-1 right-1 md:bottom-3 md:right-3 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    )}
                  </div>
                  <div className="md:hidden block mt-4">
                    <h2 className=" text-2xl  font-bold text-white mb-2">{userDetails?.fullname}</h2>
                     <p className="  text-lg text-white/80 mb-4">{userDetails?.category}</p>
                  </div>
                </div>

                {/* Profile info */}
                <div className="flex-1">
                  <h2 className="md:block hidden text-3xl md:text-4xl font-bold text-white mb-2">{userDetails?.fullname}</h2>
                  <p className=" md:block hidden text-lg text-white/80 mb-4">{userDetails?.category}</p>
                  <p className="text-sm md:text-base text-white/70 leading-relaxed mb-4 max-w-2xl">{userDetails?.about}</p>

                  {/* Quick contact info */}
                  <div className="flex flex-wrap gap-4">
                     {userDetails?.country && (
                      <div className="flex items-center gap-2 text-white/80">
                      <MapPin size={18} />
                      <span>{userDetails.country}</span>
                    </div>
                     )}
                     {userDetails?.phoneNumber && (
                     <div className="flex items-center gap-2 text-white/80">
                      <Phone size={18} />
                      <a href={`tel:${userDetails?.phoneNumber}`} className="hover:text-white transition-colors">
                        {userDetails?.phoneNumber}
                      </a>
                    </div>
                     )}
                     {userDetails?.email && (
                        <div className="flex items-center gap-2 text-white/80">
                      <Mail size={18} />
                      <a href={`mailto:${userDetails?.email}`} className="hover:text-white transition-colors">
                        {userDetails?.email}
                      </a>
                    </div>
                     )}
                  </div>
                </div>
              </div>
            </div>

            {userDetails && (
                <div>
            {/* Services */}
            {userDetails.services && userDetails.services.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6">💼 Services</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {userDetails.services.map((service, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 md:p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105"
                    >
                      <p className=" text-white/90 leading-relaxed">{service}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {userDetails.experience && userDetails.experience.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  ⭐ Work Experience
                </h3>
                <div className="space-y-6">
                  {userDetails.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
                    >
                      <div className="flex  justify-between items-start mb-2">
                        <h4 className="text-sm md:text-2xl font-bold text-white">{exp.role}</h4>
                        <span className="text-sm text-white/60">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      <p className="text-white/80 md:text-xl font-semibold mb-3">{exp.company}</p>
                      <p className="text-sm md:text-base text-white/70 whitespace-pre-wrap">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {userDetails.skills && userDetails.skills.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  💡 Skills 
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {userDetails.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all duration-300"
                    >
                      <p className="text-white/90">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {userDetails.projects && userDetails.projects.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  📁 Projects
                </h3>
                <div className="space-y-6">
                  {userDetails.projects.map((project, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 group"
                    >
                      <div className="md:flex">
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full md:w-1/3 h-64 md:h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        )}
                        <div className="p-6 flex-1">
                          <h4 className="text-xl font-bold text-white mb-2">{project.title}</h4>
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
                                className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/80"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all duration-300"
                          >
                            <Globe size={16} />
                            View Project
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} 

            {/* Education */}
            {userDetails.education && userDetails.education.length > 0 && (
              <div className="mb-12 text-sm md:text-base">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  🎓 Education
                </h3>
                <div className="space-y-4">
                  {userDetails.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
                    >
                      <div className="  mb-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xl font-bold text-white">{edu.degree}</h4>
                          <span className="text-sm text-white/60">
                          {edu.startYear} - {edu.endYear}
                        </span>
                        </div>
                          <p className="text-white/80 font-semibold">{edu.school}</p>
                      </div>
                      <p className="text-white/70">{edu.field}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {userDetails.languages && userDetails.languages.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6">🌍 Languages</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {userDetails.languages.map((lang, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all duration-300"
                    >
                      <p className="text-white/90">{lang}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media */}
            {userDetails.socials.length > 0 && (
              <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">Follow Me</h3>
              <div className="flex gap-4 flex-wrap">
                {[
                  { name: "linkedin", url: userDetails.socials.linkedin, icon: "/icons/link.svg" },
                  { name: "github", url: userDetails.socials.github, icon: "/icons/github.svg" },
                  { name: "facebook", url: userDetails.socials.fb, icon: "/icons/fb.svg" },
                  { name: "whatsapp", url: userDetails.socials.whatsapp, icon: "/icons/wts.svg" },
                  { name: "tiktok", url: userDetails.socials.tiktok, icon: "/icons/tiktok.svg" },
                  { name: "reddit", url: userDetails.socials.reddit, icon: "/icons/reddit.svg" },
                  { name: "twitch", url: userDetails.socials.twitch, icon: "/icons/twitch.svg" },
                  { name: "instagram", url: userDetails.socials.instagram, icon: "/icons/ins.svg" },
                  { name: "snapchat", url: userDetails.socials.snapchat, icon: "/icons/snap.svg" },
                  { name: "twitter", url: userDetails.socials.twitter, icon: "/icons/twit.svg" },
                  { name: "youtube", url: userDetails.socials.youtube, icon: "/icons/yt.svg" },
                  { name: "telegram", url: userDetails.socials.telegram, icon: "/icons/tele.svg" },
                  { name: "tiktok", url: userDetails.socials.tik, icon: "/icons/tik.svg" },
                  { name: "google", url: userDetails.socials.google, icon: "/icons/google.svg" },
                ]
                  .filter((item) => item.url)
                  .map((item,i) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-white backdrop-blur-md border border-white/20 rounded-lg  transition-all duration-300"
                    >
                      <img src={item.icon} alt={item.name} className="w-6 h-6" />
                    </a>
                  ))}
              </div>
            </div>
            )}
                </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <p className="text-white/60">
              © {new Date().getFullYear()} {userDetails?.fullname}. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
      </div>
    </div>
  )
}