"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader, CheckCheck } from "../../components/Icons";
import Image from "next/image";
import { getTranslation } from '../../translations/update-profile'

export default function Theme({ userData, setUserDetails }) {
  const t = getTranslation(userData?.displayLanguage || 'en');
  const [selectedTheme, setSelectedTheme] = useState(userData.theme || 1);
  const [loading, setLoading] = useState(false);
  const [pendingTheme, setPendingTheme] = useState(null);

  const handleSave = async () => {
    if (!pendingTheme) return;
    setLoading(true);
    try {
      await axios.put(`/api/proxy/users/update/theme`, { theme: pendingTheme });
      setSelectedTheme(pendingTheme);
      setPendingTheme(null);
      setUserDetails({ ...userData, theme: pendingTheme });
      toast(
        <p className="flex gap-2 items-center">
          <CheckCheck className="text-green-500" /> {t('theme.savedSuccessfully')}
        </p>,
        { autoClose: 1000 }
      );
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
            onClick={() => handleThemeClick(num)}
            className={`border-2 sm:border-4 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${pendingTheme === num
              ? "border-yellow-400 scale-[1.02] sm:scale-105"
              : selectedTheme === num
                ? "border-green-500"
                : "border-transparent hover:border-gray-300"
              }`}
          >
            <div className="w-full h-16 sm:h-28 relative overflow-hidden bg-gray-900 pointer-events-none">
              <Image
                src={`/themes/theme${num}.png`}
                alt={`Theme ${num}`}
                width={150}
                height={100}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Preview Section Removed as requested */}
    </div>
  );
}
