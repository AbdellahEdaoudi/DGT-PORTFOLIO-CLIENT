"use client"
import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"

export default function ThemeSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef(null)

  // Touch & Mouse Interaction States
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const [mouseDown, setMouseDown] = useState(false)
  const [mouseStartX, setMouseStartX] = useState(0)
  const [mouseEndX, setMouseEndX] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const themes = [
    { image: "/themes/theme2.png", id: 2 },
    { image: "/themes/theme3.png", id: 3 },
    { image: "/themes/theme4.png", id: 4 },
    { image: "/themes/theme5.png", id: 5 },
    { image: "/themes/theme1.png", id: 1 },
    { image: "/themes/theme6.png", id: 6 },
    { image: "/themes/theme7.png", id: 7 },
    { image: "/themes/theme8.png", id: 8 },
    { image: "/themes/theme9.png", id: 9 },
    { image: "/themes/theme10.png", id: 10 },
    { image: "/themes/theme11.png", id: 11 },
    { image: "/themes/theme12.png", id: 12 },
    { image: "/themes/theme13.png", id: 13 },
  ]

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % themes.length)
  }, [themes.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + themes.length) % themes.length)
  }, [themes.length])

  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setProgress(0)
    // 4000ms total duration
    timerRef.current = setInterval(nextSlide, 4000)
  }, [nextSlide])

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  // Progress Bar Logic
  useEffect(() => {
    // Reset progress when index changes
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) return 100
        return old + (100 / (4000 / 50)) // 4000ms duration, 50ms interval
      })
    }, 50)

    // Cleanup
    return () => clearInterval(interval)
  }, [currentIndex])

  useEffect(() => {
    if (!isHovering && !mouseDown) {
      startAutoPlay()
    }
    return () => stopAutoPlay()
  }, [currentIndex, isHovering, mouseDown, startAutoPlay, stopAutoPlay])

  // Interaction Handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX)
    setIsHovering(true)
  }

  const handleTouchMove = (e) => setTouchEndX(e.touches[0].clientX)

  const handleTouchEnd = () => {
    const swipeThreshold = 50
    if (touchStartX - touchEndX > swipeThreshold) nextSlide()
    else if (touchEndX - touchStartX > swipeThreshold) prevSlide()

    setTouchStartX(0)
    setTouchEndX(0)
    setIsHovering(false)
  }

  const handleMouseDown = (e) => {
    setMouseDown(true)
    setMouseStartX(e.clientX)
    setIsHovering(true)
  }

  const handleMouseMove = (e) => {
    if (mouseDown) setMouseEndX(e.clientX)
  }

  const handleMouseUp = () => {
    if (!mouseDown) return
    setMouseDown(false)
    const swipeThreshold = 50
    if (mouseStartX - mouseEndX > swipeThreshold) nextSlide()
    else if (mouseEndX - mouseStartX > swipeThreshold) prevSlide()

    setMouseStartX(0)
    setMouseEndX(0)
    setIsHovering(false)
  }

  const handleMouseLeave = () => {
    if (mouseDown) {
      setMouseDown(false);
      setIsHovering(false);
    }
  }

  return (
    <div
      className="group relative md:h-96 h-72 rounded-xl overflow-hidden flex flex-col bg-neutral-900/50 border border-white/10 shadow-2xl backdrop-blur-sm ring-1 ring-white/5"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); handleMouseLeave?.() }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >

      {/* Browser Header Window */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-black/40 backdrop-blur-md z-20 select-none">

        {/* Window Controls */}
        <div className="flex gap-1.5 group-hover:opacity-100 opacity-60 transition-opacity duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-sm" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-sm" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-sm" />
        </div>

        {/* Address Bar */}
        <div className="ml-2 flex-1 max-w-sm bg-neutral-800/50 rounded-md flex items-center px-3 py-1 text-[11px] md:text-xs text-neutral-400 font-mono border border-white/5 transition-colors group-hover:bg-neutral-800/80 group-hover:text-neutral-300">
          {/* Lock Icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 opacity-50"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          <span className="truncate">https://adam-carter.dgtportfolio.com</span>
        </div>

        {/* Menu Icon (Visual only) */}
        <div className="hidden md:block ml-auto opacity-30 hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-[49px] md:top-[53px] left-0 h-[1px] bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-75 ease-linear z-30 opacity-70" style={{ width: `${progress}%` }} />

      {/* Main Content Area */}
      <div className="relative flex-1 w-full overflow-hidden bg-neutral-900">
        {themes.map((theme, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out pointer-events-none ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            <div className="w-full h-full relative overflow-hidden">
              <Image
                width={1920}
                height={1080}
                src={theme.image}
                alt={`Theme ${theme.id}`}
                className={`w-full h-full object-cover object-top transition-transform duration-[4000ms] ease-out ${index === currentIndex ? "scale-[1.02]" : "scale-100"}`}
              />

              {/* Image Content Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/10 to-transparent pointer-events-none" />
            </div>
          </div>
        ))}

        {/* Overlay when hovering (optional hint) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none z-20" />
      </div>

      {/* Navigation Dots - Glassmorphic */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2 p-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/5 shadow-xl">
        {themes.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              stopAutoPlay();
              setTimeout(startAutoPlay, 1000);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white w-6 shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-white/30 w-1.5 hover:bg-white/50"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
