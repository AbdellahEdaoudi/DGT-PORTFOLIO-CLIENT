"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../../components/Toast";
import { Loader, CheckCheck, ArrowLeft, ArrowRight } from "../../components/Icons";
import Image from "next/image";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
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
              : "bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600"
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
        {themes.map((num) => (
          <motion.div
            key={num}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: num * 0.03 }}
            className={`relative border-2 sm:border-4 rounded-lg transition-all duration-300 group overflow-hidden ${pendingTheme === num
              ? "border-yellow-400 scale-[1.02] z-10 shadow-lg"
              : selectedTheme === num
                ? "border-green-500"
                : "border-gray-200 hover:border-gray-300"
              }`}
          >
            <div
              onClick={() => handleThemeClick(num)}
              className="w-full h-24 sm:h-36 relative overflow-hidden bg-gray-900 cursor-pointer"
            >
              <Image
                src={`/themes/theme${num}.png`}
                alt={`${t('theme.themeLabel')} ${num}`}
                width={600}
                height={450}
                quality={100}
                priority={num <= 6}
                className="w-full h-full object-cover object-top transition-all duration-500 group-hover:brightness-110"
                style={{ imageRendering: 'auto' }}
              />

              {/* Overlay Label */}
              <div className="absolute bottom-0 inset-x-0 bg-black/40 p-1 text-center">
                <span className="text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                  {t('theme.themeLabel')} {num}
                </span>
              </div>

              {/* Modern Preview Button Overlay */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTheme(num);
                  }}
                  className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-xs font-bold border border-white/20 hover:scale-105 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                  {t('theme.preview') || "Preview"}
                </button>
              </div>
            </div>

            {selectedTheme === num && (
              <div className="absolute top-1 left-1 bg-green-500 text-white p-0.5 rounded-full shadow-lg z-20">
                <CheckCheck size={12} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Full Preview Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {previewTheme !== null && (
            <motion.div
              dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4"
              onClick={() => setPreviewTheme(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="relative w-full max-w-5xl bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col h-auto max-h-[96vh] border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-900 shrink-0">
                  <h3 className="text-white font-bold">{t('theme.themeLabel')} {previewTheme}</h3>
                  <button
                    onClick={() => setPreviewTheme(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 bg-gray-900 custom-scrollbar relative">
                  {/* Navigation Arrows - Visible on all screens now */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrevTheme(); }}
                    className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-[10000] p-2 sm:p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all backdrop-blur-md flex items-center justify-center border border-white/10"
                    title={t('theme.previous') || "Previous"}
                  >
                    <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleNextTheme(); }}
                    className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-[10000] p-2 sm:p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all backdrop-blur-md flex items-center justify-center border border-white/10"
                    title={t('theme.next') || "Next"}
                  >
                    <ArrowRight size={20} className="sm:w-6 sm:h-6" />
                  </button>

                  <div className="relative w-full">
                    <Image
                      src={`/themes/theme${previewTheme}.png`}
                      alt="Full Preview"
                      width={1200}
                      height={1800}
                      quality={100}
                      className="w-full h-auto object-contain"
                      priority
                    />
                  </div>
                </div>

                <div className="p-3 border-t border-gray-800 bg-gray-900 shrink-0 flex justify-end gap-3">
                  <button
                    onClick={() => setPreviewTheme(null)}
                    className="px-4 py-2 text-gray-300 hover:text-white text-sm font-medium"
                  >
                    {t('theme.close') || "Close"}
                  </button>
                  <button
                    onClick={async () => {
                      setLoading(true);
                      try {
                        await axios.put(`/api/proxy/users/update/theme`, { theme: previewTheme });
                        setSelectedTheme(previewTheme);
                        setPendingTheme(null);
                        setUserDetails({ ...userData, theme: previewTheme });
                        toast.success(t('theme.savedSuccessfully'));
                        setPreviewTheme(null);
                      } catch (error) {
                        toast.error(t('theme.errorMessage'));
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="px-5 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-bold rounded-lg text-sm shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader size={16} className="animate-spin" /> : "💾"}
                    {t('theme.save') || "Save Theme"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
