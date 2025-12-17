"use client"
import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"


export default function ThemeSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef(null)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const [mouseDown, setMouseDown] = useState(false) // New state for mouse drag
  const [mouseStartX, setMouseStartX] = useState(0) // New state for mouse drag start
  const [mouseEndX, setMouseEndX] = useState(0) // New state for mouse drag end

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
    clearInterval(timerRef.current) // Clear any existing interval
    timerRef.current = setInterval(nextSlide, 4000)
  }, [nextSlide])

  const stopAutoPlay = useCallback(() => {
    clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    startAutoPlay()
    return () => stopAutoPlay()
  }, [startAutoPlay, stopAutoPlay])

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX)
    stopAutoPlay() // Stop autoplay when user interacts
  }

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    const swipeThreshold = 50 // Minimum pixels to register a swipe
    if (touchStartX - touchEndX > swipeThreshold) {
      // Swiped left
      nextSlide()
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Swiped right
      prevSlide()
    }
    // Restart autoplay after a short delay to allow for multiple swipes
    setTimeout(startAutoPlay, 1000);
    setTouchStartX(0); // Reset touch positions
    setTouchEndX(0);
  }

  const handleMouseDown = (e) => {
    setMouseDown(true)
    setMouseStartX(e.clientX)
    stopAutoPlay()
  }

  const handleMouseMove = (e) => {
    if (!mouseDown) return
    setMouseEndX(e.clientX)
  }

  const handleMouseUp = () => {
    if (!mouseDown) return
    setMouseDown(false)
    const swipeThreshold = 50
    if (mouseStartX - mouseEndX > swipeThreshold) {
      nextSlide()
    } else if (mouseEndX - mouseStartX > swipeThreshold) {
      prevSlide()
    }
    setTimeout(startAutoPlay, 1000)
    setMouseStartX(0)
    setMouseEndX(0)
  }

  const handleMouseLeave = () => {
    if (mouseDown) { // If mouse was down and left the component, reset state
      setMouseDown(false)
      setTimeout(startAutoPlay, 1000) // Restart autoplay
    }
  }


  return (
    <div
      className="relative md:h-96 h-72 rounded-lg overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown} // Add mouse down handler
      onMouseMove={handleMouseMove} // Add mouse move handler
      onMouseUp={handleMouseUp}     // Add mouse up handler
      onMouseLeave={handleMouseLeave} // Add mouse leave handler
    >
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
            onClick={() => {
              setCurrentIndex(index);
              stopAutoPlay(); // Stop autoplay on manual dot click
              setTimeout(startAutoPlay, 1000); // Restart after a delay
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
              }`}
          />
        ))}
      </div>
    </div>
  )
}
