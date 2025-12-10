"use client";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { CheckCheck, Loader, Plus, Trash2 } from "lucide-react";

import { useTranslation } from "../../lib/translations";

export default function Languages({ userData, setUserDetails }) {
  const { t } = useTranslation(userData?.displayLanguage || 'en');
  const [languages, setLanguages] = useState(userData.languages || []);
  const [loading, setLoading] = useState(false);

  const addArrayItem = (array, setArray, newItem) => {
    if (array.length >= 10) return;
    setArray([...array, newItem]);
  }
  const removeArrayItem = (array, setArray, index) =>
    setArray(array.filter((_, i) => i !== index));
  const updateArrayItem = (array, setArray, index, value) => {
    const updated = [...array];
    updated[index] = value;
    setArray(updated);
  };

  const saveLanguages = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/proxy/users/update/languages`, { languages });

      // Update global state to reflect changes immediately without refresh
      if (setUserDetails) {
        setUserDetails(prev => ({
          ...prev,
          languages: languages
        }));
      }

      toast(
        <p className="flex gap-3 items-center">
          <CheckCheck className="text-cyan-500" /> {t('savedSuccessfully')}
        </p>,
        { autoClose: 2000 }
      );
    } catch (error) {
      console.error("Error updating languages:", error);
      toast.error(t('errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4" dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className="text-lg font-bold text-gray-800">🌐 {t('languages')}</h3>

      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-2 md:p-4 rounded-xl border border-cyan-200 space-y-3">
        <div className="space-y-2">
          {languages.map((lang, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={lang}
                maxLength={50}
                onChange={(e) => updateArrayItem(languages, setLanguages, index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white transition"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(languages, setLanguages, index)}
                className="hover:bg-red-100 rounded-lg p-2 transition-colors"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={languages.length >= 10}
          onClick={() => {
            if (languages.length < 10) {
              addArrayItem(languages, setLanguages, "")
            }
          }}
          className={`w-full text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${languages.length >= 10 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'}`}
        >
          <Plus size={18} /> {languages.length >= 10 ? "10 Max" : t('addLanguage')}
        </button>
      </div>

      <div className="flex justify-end py-4 border-b-2 border-gray-200">
        <button
          onClick={saveLanguages}
          disabled={loading}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
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
    </div>
  );
}
