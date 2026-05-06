"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../../components/Toast";
import { Loader, CheckCheck, ArrowLeft, ArrowRight } from "../../components/Icons";
import Image from "next/image";
import { createPortal } from "react-dom";
import { getTranslation } from '../../translations/update-profile'

export default function Theme({ userData, setUserDetails }) {
  const toast = useToast();
  const t = getTranslation(userData?.displayLanguage || 'en');
  const [selectedTheme, setSelectedTheme] = useState(userData.theme || 1);
  const [loading, setLoading] = useState(false);
  const [pendingTheme, setPendingTheme] = useState(null);
  const [previewTheme, setPreviewTheme] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  const handleNextTheme = () => {
    const currentIndex = themes.indexOf(previewTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setPreviewTheme(themes[nextIndex]);
  };

  const handlePrevTheme = () => {
    const currentIndex = themes.indexOf(previewTheme);
    const prevIndex = (currentIndex - 1 + themes.length) % themes.length;
    setPreviewTheme(themes[prevIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (previewTheme === null) return;
      if (e.key === "ArrowRight") {
        userData?.displayLanguage === 'ar' ? handlePrevTheme() : handleNextTheme();
      }
      if (e.key === "ArrowLeft") {
        userData?.displayLanguage === 'ar' ? handleNextTheme() : handlePrevTheme();
      }
      if (e.key === "Escape") setPreviewTheme(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewTheme, userData?.displayLanguage]);

  const handleSave = async () => {
    if (!pendingTheme) return;
    setLoading(true);
    try {
      await axios.put(`/api/proxy/users/update/theme`, { theme: pendingTheme });
      setSelectedTheme(pendingTheme);
      setPendingTheme(null);
      setUserDetails({ ...userData, theme: pendingTheme });
      toast.success(t('theme.savedSuccessfully'));
    } catch (error) {
      console.error("Error updating theme:", error);
      toast.error(t('theme.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const handleThemeClick = (num) => {
    if (selectedTheme === num) {
      setPendingTheme(null);
    } else {
      setPendingTheme(num);
    }
  };

  return (
    <div className="space-y-4" dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-lg font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
          <span className="text-base sm:text-xl">🧩</span> {t('theme.selectTheme')}
        </h3>
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            disabled={loading || !pendingTheme}
            className={`px-3 py-1.5 sm:px-6 sm:py-2 font-semibold duration-300 rounded-lg text-white transition-all shadow-lg text-[10px] sm:text-base ${loading || !pendingTheme
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
              }`}
          >
            {loading ? (
              <Loader className="animate-spin inline-block w-3 h-3 sm:w-5 sm:h-5" />
            ) : (
              t('theme.save')
            )}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 sm:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
          <div
            key={num}
            className={`relative border-2 sm:border-4 rounded-lg sm:rounded-xl transition-all duration-300 group ${pendingTheme === num
              ? "border-yellow-400 scale-[1.02] sm:scale-105 z-10"
              : selectedTheme === num
                ? "border-green-500"
                : "border-transparent hover:border-gray-300 hover:z-20"
              }`}
          >
            <div
              onClick={() => handleThemeClick(num)}
              className="w-full h-16 sm:h-28 relative overflow-hidden bg-gray-900 cursor-pointer rounded-[4px] sm:rounded-[8px]"
            >
              <Image
                src={`/themes/theme${num}.png`}
                alt={`${t('theme.themeLabel')} ${num}`}
                width={150}
                height={100}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Preview Button Overlay */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreviewTheme(num);
              }}
              className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md backdrop-blur-sm z-20"
              title={t('theme.preview') || "Preview"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Full Preview Modal */}
      {mounted && previewTheme !== null && createPortal(
        <div dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setPreviewTheme(null)}>
          <div
            className="relative w-full max-w-[95%] sm:max-w-md md:max-w-3xl bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[60vh] md:h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-800 bg-gray-900 z-10 shrink-0">
              <h3 className="text-white font-bold text-lg">{t('theme.themeLabel')} {previewTheme}</h3>
              <button
                onClick={() => setPreviewTheme(null)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-1 bg-gray-900 custom-scrollbar relative group/modal">
              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevTheme();
                }}
                className="fixed left-4 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all backdrop-blur-md border border-white/10 shadow-xl hidden md:flex items-center justify-center hover:scale-110 active:scale-95"
                title={t('theme.previous') || "Previous"}
              >
                <ArrowLeft size={28} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextTheme();
                }}
                className="fixed right-4 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all backdrop-blur-md border border-white/10 shadow-xl hidden md:flex items-center justify-center hover:scale-110 active:scale-95"
                title={t('theme.next') || "Next"}
              >
                <ArrowRight size={28} />
              </button>

              {/* Mobile Navigation Bar */}
              <div className="md:hidden flex justify-between items-center px-4 py-2 bg-gray-800/50 backdrop-blur-md sticky top-0 z-20 border-b border-white/5">
                <button
                  onClick={handlePrevTheme}
                  className="flex items-center gap-1 text-gray-300 hover:text-white text-sm font-medium"
                >
                  <ArrowLeft size={18} /> {t('theme.previous') || "Prev"}
                </button>
                <span className="text-gray-400 text-xs font-mono">{themes.indexOf(previewTheme) + 1} / {themes.length}</span>
                <button
                  onClick={handleNextTheme}
                  className="flex items-center gap-1 text-gray-300 hover:text-white text-sm font-medium"
                >
                  {t('theme.next') || "Next"} <ArrowRight size={18} />
                </button>
              </div>

              <div className="relative w-full">
                <Image
                  src={`/themes/theme${previewTheme}.png`}
                  alt={`${t('theme.themeLabel')} ${previewTheme} Full Preview`}
                  width={800}
                  height={1200}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>

            <div className="p-3 sm:p-4 border-t border-gray-800 bg-gray-900 shrink-0 flex justify-end gap-3">
              <button
                onClick={() => setPreviewTheme(null)}
                className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors"
              >
                {t('theme.close') || "Close"}
              </button>
              <button
                onClick={() => {
                  handleThemeClick(previewTheme);
                  setPreviewTheme(null);
                }}
                className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg transition-colors"
              >
                {t('theme.selectThisTheme') || "Select This Theme"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
