"use client"
import { useState } from "react"
import { Menu, X } from "../Icons"
import Link from "next/link"
import LanguageSwitcher from "./LanguageSwitcher"

export default function MobileMenu({ dict, portfolioLink }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="md:hidden flex items-center">
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-white hover:text-cyan-400 transition relative z-50"
                aria-label="Toggle Menu"
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-slate-900 border-b border-purple-500/20 p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-5 fade-in duration-200">
                    <Link
                        href={"#Features"}
                        className="text-lg font-medium hover:text-cyan-400 transition border-b border-gray-800 pb-2"
                        onClick={() => setIsOpen(false)}
                    >
                        {dict.navbar.features}
                    </Link>
                    <Link
                        href={portfolioLink}
                        target="_blank"
                        className="text-lg font-medium hover:text-cyan-400 transition border-b border-gray-800 pb-2"
                        onClick={() => setIsOpen(false)}
                    >
                        {dict.navbar.showcase}
                    </Link>
                    <Link
                        href={"#pricing"}
                        className="text-lg font-medium hover:text-cyan-400 transition border-b border-gray-800 pb-2"
                        onClick={() => setIsOpen(false)}
                    >
                        {dict.navbar.pricing}
                    </Link>

                    <div className="pt-2">
                        <p className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-semibold">Language</p>
                        <div className="w-full">
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
