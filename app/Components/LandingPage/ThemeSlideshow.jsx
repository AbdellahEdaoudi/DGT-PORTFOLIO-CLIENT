"use client"
import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"


export default function ThemeSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef(null)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % 11)
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 4000)
    return () => clearInterval(timerRef.current)
  }, [nextSlide])

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
  ]



  return (
    <div className="relative md:h-96 h-72 rounded-lg overflow-hidden ">
      {themes.map((theme, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          <div className="w-full h-full relative overflow-hidden">
            <Image
              width={1920}
              height={1080}
              src={theme.image}
              alt={`Theme ${theme.id}`}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      ))}

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
