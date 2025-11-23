"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"

const slides = [
  { imageUrl: "/themes/image1.png" },
  { imageUrl: "/themes/image2.png" },
  { imageUrl: "/themes/image3.png" },
  { imageUrl: "/themes/image4.png" },
  { imageUrl: "/themes/image5.png" },
]

export default function ThemeSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true)
  const timerRef = useRef(null)

  const nextSlide = useCallback(() => {
    setFade(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
      setFade(true)
    }, 500)
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 4000)
    return () => clearInterval(timerRef.current)
  }, [nextSlide])

  return (
    <div className="relative h-96 rounded-lg overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.imageUrl}
            alt={`Theme ${index + 1}`}
            width={700}
            height={700}
            className="object-cover rounded-lg"
            priority={index === 0}
          />
          {/* Optional gradient overlay for better visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent hidden" />
        </div>
      ))}
    </div>
  )
}
