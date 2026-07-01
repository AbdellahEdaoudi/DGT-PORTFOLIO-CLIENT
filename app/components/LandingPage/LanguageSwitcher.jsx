"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import "flag-icons/css/flag-icons.min.css"

export default function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const pathname = usePathname()

    // Supported languages and their configuration
    const languages = [
        { code: "en", label: "English", flag: "gb" },
        { code: "fr", label: "Français", flag: "fr" },
        { code: "de", label: "Deutsch", flag: "de" },
        { code: "es", label: "Español", flag: "es" },
        { code: "pt", label: "Português", flag: "pt" },
        { code: "ar", label: "العربية", flag: "sa" },
        { code: "it", label: "Italiano", flag: "it" },
        { code: "nl", label: "Nederlands", flag: "nl" },
        { code: "ru", label: "Русский", flag: "ru" },
        { code: "sv", label: "Svenska", flag: "se" },
        { code: "tr", label: "Türkçe", flag: "tr" },
        { code: "hi", label: "हिन्दी", flag: "in" },
        { code: "vi", label: "Tiếng Việt", flag: "vn" },
        { code: "id", label: "Bahasa Indonesia", flag: "id" },
        { code: "pl", label: "Polski", flag: "pl" },
        { code: "zh", label: "中文", flag: "cn" },
        { code: "ja", label: "日本語", flag: "jp" },
        { code: "ko", label: "한국어", flag: "kr" },
    ]

    // Detect current language
    // Logic: Split path, check if 2nd segment is a supported locale code. Default to 'en'.
    const currentLangCode = pathname?.split("/")[1]
    const isLangInPath = languages.some(l => l.code === currentLangCode)
    const currentLang = isLangInPath ? currentLangCode : "en"

    const currentFlag = languages.find((l) => l.code === currentLang)?.flag || "gb"

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Helper to generate the new path for a selected language
    const getNewPath = (newLangCode) => {
        if (isLangInPath) {
            // Replace existing locale (e.g., /fr/about -> /es/about)
            return `/${newLangCode}${pathname.substring(currentLang.length + 1)}`
        } else {
            // Prepend locale (e.g., /about -> /es/about)
            // Special case: if path is just '/', return '/es'
            return pathname === "/" ? `/${newLangCode}` : `/${newLangCode}${pathname}`
        }
    }

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-3 rounded-full border border-purple-500/30 hover:bg-slate-800 transition-colors bg-slate-900/50 backdrop-blur-sm"
                aria-label="Select Language"
            >
                <span className={`fi fi-${currentFlag} rounded-sm`} />
                <span className="uppercase text-sm font-semibold text-white">{currentLang}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 max-h-80 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[100] custom-scrollbar">
                    <div className="py-2">
                        {languages.map((lang) => (
                            <Link
                                key={lang.code}
                                href={getNewPath(lang.code)}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-slate-800 ${currentLang === lang.code ? "text-cyan-400 bg-slate-800/50" : "text-gray-300"
                                    }`}
                            >
                                <span className={`fi fi-${lang.flag} rounded-sm shadow-sm`} />
                                <span className={currentLang === lang.code ? "font-bold" : "font-medium"}>
                                    {lang.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
