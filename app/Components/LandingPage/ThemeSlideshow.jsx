"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Themeone from "../themes/themeone"
import ThemeTwo from "../themes/themetwo"
import ThemeThree from "../themes/themethree"
import ThemeFour from "../themes/themefour"
import ThemeFive from "../themes/themefive"
import adam from "../../../public/adam.json"

export default function ThemeSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef(null)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % 5)
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 4000)
    return () => clearInterval(timerRef.current)
  }, [nextSlide])

  const themes = [
    { Component: Themeone, id: 1 },
    { Component: ThemeTwo, id: 2 },
    { Component: ThemeThree, id: 3 },
    { Component: ThemeFour, id: 4 },
    { Component: ThemeFive, id: 5 },
  ]

  // Mock user links for preview
  const userLinks = [
    { platform: "github", url: "https://github.com" },
    { platform: "linkedin", url: "https://linkedin.com" }
  ]

  return (
    <div className="relative md:block hidden h-96 rounded-lg overflow-hidden bg-gray-900 border border-white/10 shadow-2xl">
      {themes.map((theme, index) => {
        const ThemeComponent = theme.Component
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            <div className="w-full h-full relative overflow-hidden">
              {/* Scaling container to fit the theme into the slideshow box */}
              <div className="absolute top-0 left-0 w-[1070px] origin-top-left transform scale-[0.3] md:scale-[0.5] h-[1000px]">
                <ThemeComponent userDetails={adam} userLinks={userLinks} />
              </div>
            </div>
          </div>
        )
      })}

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {themes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
              }`}
          />
        ))}
      </div>
    </div>
  )
}
