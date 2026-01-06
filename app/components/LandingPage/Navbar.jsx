"use client"

import { useState, useEffect } from "react"

export default function Navbar({ children }) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  

  return (
    <nav
      className={` fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-slate-900/90 backdrop-blur-md border-b border-purple-500/20" : "bg-transparent"
      }`}
    >
      {children}
    </nav>
  )
}
