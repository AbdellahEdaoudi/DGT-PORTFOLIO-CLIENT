"use client"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { FileDown, Loader, X } from "../Icons"

export default function DownloadResume({ userDetails, className }) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const isCancelledRef = useRef(false);

    const workerRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    const TRANSLATIONS = {
        en: {
            waitTitle: 'Please wait...',
            title: 'Download CV',
            loading: (name) => `Downloading CV for ${name}...`,
            cancel: 'Cancel',
        },
        fr: {
            waitTitle: 'Veuillez patienter...',
            title: 'Télécharger CV',
            loading: (name) => `Téléchargement du CV de ${name}...`,
            cancel: 'Annuler',
        },
        es: {
            waitTitle: 'Por favor, espere...',
            title: 'Descargar CV',
            loading: (name) => `Descargando CV de ${name}...`,
            cancel: 'Cancelar',
        },
        ar: {
            waitTitle: 'المرجو الانتظار...',
            title: 'تحميل السيرة الذاتية',
            loading: (name) => `جاري تحميل السيرة الذاتية لـ ${name}...`,
            cancel: 'إلغاء',
        },
        de: {
            waitTitle: 'Bitte warten...',
            title: 'Lebenslauf herunterladen',
            loading: (name) => `Lebenslauf von ${name} wird heruntergeladen...`,
            cancel: 'Abbrechen',
        },
        ru: {
            waitTitle: 'Пожалуйста, подождите...',
            title: 'Скачать резюме',
            loading: (name) => `Загрузка резюме ${name}...`,
            cancel: 'Отмена',
        },
        ja: {
            waitTitle: '少々お待ちください...',
            title: '履歴書をダウンロード',
            loading: (name) => `${name}の履歴書をダウンロード中...`,
            cancel: 'キャンセル',
        },
        zh: {
            waitTitle: '请稍候...',
            title: '下载简历',
            loading: (name) => `正在下载 ${name} 的简历...`,
            cancel: '取消',
        },
        nl: {
            waitTitle: 'Even geduld a.u.b....',
            title: 'CV downloaden',
            loading: (name) => `CV van ${name} downloaden...`,
            cancel: 'Annuleren',
        },
        pt: {
            waitTitle: 'Por favor, aguarde...',
            title: 'Baixar CV',
            loading: (name) => `Baixando CV de ${name}...`,
            cancel: 'Cancelar',
        },
        it: {
            waitTitle: 'Attendere prego...',
            title: 'Scarica CV',
            loading: (name) => `Scaricando il CV di ${name}...`,
            cancel: 'Annulla',
        },
        hi: {
            waitTitle: 'कृपया प्रतीक्षा करें...',
            title: 'सीवी डाउनलोड करें',
            loading: (name) => `${name} का सीवी डाउनलोड हो रहा है...`,
            cancel: 'रद्द करें',
        },
        tr: {
            waitTitle: 'Lütfen bekleyin...',
            title: 'CV İndir',
            loading: (name) => `${name} kişisinin CV'si indiriliyor...`,
            cancel: 'İptal',
        },
        ko: {
            waitTitle: '잠시만 기다려 주세요...',
            title: 'CV 다운로드',
            loading: (name) => `${name}의 CV 다운로드 중...`,
            cancel: '취소',
        },
        id: {
            waitTitle: 'Mohon tunggu...',
            title: 'Unduh CV',
            loading: (name) => `Mengunduh CV untuk ${name}...`,
            cancel: 'Batal',
        },
        pl: {
            waitTitle: 'Proszę czekać...',
            title: 'Pobierz CV',
            loading: (name) => `Pobieranie CV dla ${name}...`,
            cancel: 'Anuluj',
        },
    };

    const t = TRANSLATIONS[userDetails?.displayLanguage] || TRANSLATIONS['en'];
    const fullName = userDetails?.fullname || userDetails?.username || 'User';

    return (
        <>
            <div className="relative group flex">
                <button
                    type="button"
                    onClick={handleDownload}
                    className={className || "text-white bg-white/10 hover:bg-white/20 font-bold px-5 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"}
                >
                    <FileDown size={20} />
                    <span className="hidden md:block">{t.title}</span>
                </button>
            </div>

            {isDownloading && mounted && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">

                        <div className="relative mb-6">
                            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FileDown size={24} className="text-blue-400 opacity-50" />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{t.waitTitle}</h3>
                        <p className="text-gray-400 mb-8">{t.loading(fullName)}</p>

                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors w-full flex items-center justify-center gap-2"
                        >
                            <X size={18} />
                            {t.cancel}
                        </button>

                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
