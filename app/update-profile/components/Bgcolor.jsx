"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCheck, Loader } from "lucide-react";
import Themeone from "../../Components/themes/themeone";
import ThemeTwo from "../../Components/themes/themetwo";

import { useTranslation } from "../../lib/translations";

export default function Bgcolor({ userData }) {
  const { t } = useTranslation(userData?.displayLanguage || 'en');
  const [bgcolorp, setBgcolorp] = useState(userData.bgcolorp || "#OA3C4D");
  const [loading, setLoading] = useState(false);

  const saveBackgroundColor = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/proxy/users/update/bgcolor`, { bgcolorp });
      toast(
        <p className="flex gap-3 items-center">
          <CheckCheck /> {t('savedSuccessfully')}
        </p>,
        { autoClose: 2000 }
      );
    } catch (error) {
      console.error("Error updating background color:", error);
      toast.error(t('errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="" dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div>
        <label className="block text-lg font-bold text-gray-800 mb-3">🎨 {t('backgroundColor')}</label>
        <input
          type="color"
          value={bgcolorp}
          onChange={(e) => setBgcolorp(e.target.value)}
          className="w-full h-12 rounded-lg cursor-pointer border-2 border-gray-300 transition hover:shadow-lg"
        />
      </div>
      <div className="flex justify-end py-2">
        <button
          onClick={saveBackgroundColor}
          disabled={loading}
          className="bg-cyan-950 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" /> {t('saving')}
            </>
          ) : (
            `💾 ${t('save')}`
          )}
        </button>
      </div>
      <Themeone userDetails={userData} bgcolor={bgcolorp} />
    </div>
  );
}
