"use client"
import Image from "next/image"

export default function GlobalLoader() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
            <div className="relative flex flex-col items-center gap-6">

                {/* Logo Container with clean ring */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border-[3px] border-gray-100"></div>
                    {/* Active Spinner Segment */}
                    <div className="absolute inset-0 rounded-full border-[3px] border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>

                    {/* Logo */}
                    <div className="relative w-16 h-16">
                        <Image
                            src="/Qrimage.jpg"
                            alt="DGT Portfolio Logo"
                            width={80}
                            height={80}
                            className="w-full h-full object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Brand Text */}
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                        DGTPortfolio
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">Loading</span>
                        <div className="flex gap-1">
                            <span className="w-1 h-1 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1 h-1 bg-cyan-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1 h-1 bg-purple-600 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
