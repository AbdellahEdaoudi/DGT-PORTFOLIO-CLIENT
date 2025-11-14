"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function ThemeSlideshow() {
  const images = [
    "/themes/image1.png",
    "/themes/image2.png",
    "/themes/image3.png",
    "/themes/image4.png",
    "/themes/image5.png",
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
        setFade(true)
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative h-96 rounded-lg overflow-hidden">
      <Image
        key={images[currentIndex]}
        src={images[currentIndex]}
        alt="Theme preview"
        width={700}
        height={700}
        className={`rounded-lg object-cover transition-opacity duration-700 ease-in-out ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}
