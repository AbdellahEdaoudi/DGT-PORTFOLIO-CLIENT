"use client"
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

const ImageModal = ({ isOpen, onClose, imageSrc, altText }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Small delay to trigger animation after mount
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen || !imageSrc) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={onClose}
        >
            <div
                className={`relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-20 right-0 md:top-4 md:right-4 p-2 bg-slate-700 hover:bg-slate-800 rounded-full text-white transition-all duration-200 hover:scale-110 z-10"
                >
                    <X size={32} />
                </button>
                <div className="relative w-full h-full">
                    <Image
                        src={imageSrc}
                        alt={altText || 'Project Image'}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
