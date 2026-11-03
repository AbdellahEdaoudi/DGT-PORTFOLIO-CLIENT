"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FileDown, Loader, X } from "../lucide-react";
import { getDownloadCvTranslation } from "../../translations/download-cv";

export default function DownloadResume({ userDetails, className }) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const isCancelledRef = useRef(false);
    const workerRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const lang = userDetails?.displayLanguage || 'en';
    const [content, setContent] = useState({});
    const fullName = userDetails?.fullname || userDetails?.username || 'User';

    useEffect(() => {
        getDownloadCvTranslation(lang).then((dict) => setContent(dict || {}));
    }, [lang]);

    const startDownload = async () => {
        if (isDownloading) return;
        try {
            isCancelledRef.current = false;
            setIsDownloading(true);

            await new Promise((resolve) => setTimeout(resolve, 100));
            if (isCancelledRef.current) return;

            workerRef.current = new Worker(new URL('./pdfWorker.js', import.meta.url));

            workerRef.current.onmessage = (event) => {
                if (isCancelledRef.current) {
                    workerRef.current.terminate();
                    return;
                }
                if (event.data.success) {
                    const blob = event.data.blob;
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `cv.${userDetails?.username || 'resume'}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                } else {
                    console.error("PDF generation failed:", event.data.error);
                }
                setIsDownloading(false);
                workerRef.current.terminate();
                workerRef.current = null;
            };

            workerRef.current.onerror = (error) => {
                console.error("Worker error:", error);
                setIsDownloading(false);
                workerRef.current.terminate();
                workerRef.current = null;
            };

            // CV without projects and without services
            const cvData = {
                ...userDetails,
                projects: [],
                services: [],
            };

            workerRef.current.postMessage({ userData: cvData });

        } catch (e) {
            console.error(e);
            if (!isCancelledRef.current) setIsDownloading(false);
        }
    };

    const handleCancel = () => {
        isCancelledRef.current = true;
        setIsDownloading(false);
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
    };

    return (
        <>
            <div className="relative group flex">
                <button
                    type="button"
                    onClick={startDownload}
                    disabled={isDownloading}
                    className={className || "text-white bg-white/10 hover:bg-white/20 font-bold px-5 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg cursor-pointer disabled:opacity-50"}
                >
                    {isDownloading ? <Loader size={20} className="animate-spin" /> : <FileDown size={20} />}
                    <span className="hidden md:block">{content?.title || "Download CV"}</span>
                </button>
            </div>

            {/* Downloading Spinner Modal */}
            {isDownloading && mounted && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FileDown size={24} className="text-blue-400 opacity-50" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{content?.waitTitle || "Please wait..."}</h3>
                        <p className="text-gray-400 mb-8">{content?.loading ? content.loading.replace('{name}', fullName) : `Generating CV for ${fullName}...`}</p>
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors w-full flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <X size={18} />
                            {content?.cancel || "Cancel"}
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
