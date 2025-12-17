"use client"
import { useState, useRef } from "react"
import { FileDown, Loader, X } from "../Icons"

export default function DownloadResume({ userDetails, className }) {
    const [isDownloading, setIsDownloading] = useState(false);
    const isCancelledRef = useRef(false);

    const workerRef = useRef(null);

    const handleDownload = async () => {
        try {
            isCancelledRef.current = false;
            setIsDownloading(true);

            // Give the UI a moment to render the modal
            await new Promise(resolve => setTimeout(resolve, 100));

            if (isCancelledRef.current) return;

            // Initialize the worker
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

            workerRef.current.postMessage({ userData: userDetails });

        } catch (e) {
            console.error(e);
            if (!isCancelledRef.current) {
                setIsDownloading(false);
            }
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

    const getTitle = () => {
        const translations = {
            en: 'Download CV',
            fr: 'Télécharger CV',
            es: 'Descargar CV',
            ar: 'تحميل السيرة الذاتية',
            de: 'Lebenslauf herunterladen',
            ru: 'Скачать резюме',
            ja: '履歴書をダウンロード',
            zh: '下载简历',
            nl: 'CV downloaden',
            pt: 'Baixar CV',
            it: 'Scarica CV',
            hi: 'सीवी डाउनलोड करें',
            tr: 'CV İndir',
            ko: 'CV 다운로드',
        };
        return translations[userDetails?.displayLanguage] || translations['en'];
    };

    const getLoadingText = () => {
        const loadingTranslations = {
            en: 'Downloading CV...',
            fr: 'Téléchargement du CV...',
            es: 'Descargando CV...',
            ar: 'جاري تحميل السيرة الذاتية...',
            de: 'CV wird heruntergeladen...',
            ru: 'Загрузка резюме...',
            ja: '履歴書をダウンロード中...',
            zh: '正在下载简历...',
            nl: 'CV downloaden...',
            pt: 'Baixando CV...',
            it: 'Scaricando CV...',
            hi: 'CV डाउनलोड हो रहा है...',
            tr: 'CV İndiriliyor...',
            ko: 'CV 다운로드 중...',
        };
        return loadingTranslations[userDetails?.displayLanguage] || loadingTranslations['en'];
    };

    const getCancelText = () => {
        const cancelTranslations = {
            en: 'Cancel',
            fr: 'Annuler',
            es: 'Cancelar',
            ar: 'إلغاء',
            de: 'Abbrechen',
            ru: 'Отмена',
            ja: 'キャンセル',
            zh: '取消',
            nl: 'Annuleren',
            pt: 'Cancelar',
            it: 'Annulla',
            hi: 'रद्द करें',
            tr: 'İptal',
            ko: '취소',
        };
        return cancelTranslations[userDetails?.displayLanguage] || cancelTranslations['en'];
    };

    return (
        <>
            <div className="relative inline-block group">
                <button
                    type="button"
                    onClick={handleDownload}
                    className={className || "text-white bg-white/10 hover:bg-white/20 font-bold px-5 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"}
                >
                    <FileDown size={20} />
                </button>
                {/* Custom Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-1.5 bg-gray-900/90 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl backdrop-blur-sm z-50 translate-y-2 group-hover:translate-y-0">
                    {getTitle()}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/90"></div>
                </div>
            </div>

            {isDownloading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">

                        <div className="relative mb-6">
                            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FileDown size={24} className="text-blue-400 opacity-50" />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{getTitle()}</h3>
                        <p className="text-gray-400 mb-8">{getLoadingText()}</p>

                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors w-full flex items-center justify-center gap-2"
                        >
                            <X size={18} />
                            {getCancelText()}
                        </button>

                    </div>
                </div>
            )}
        </>
    );
}
