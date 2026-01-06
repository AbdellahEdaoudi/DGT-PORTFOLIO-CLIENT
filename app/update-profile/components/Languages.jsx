"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { CheckCheck, Loader, Plus, Trash2, ArrowUp, ArrowDown, X, AlertCircle } from "../../Components/Icons";
import { getTranslation } from '../../translations/update-profile'

export default function Languages({ userData, setUserDetails }) {
  const t = getTranslation(userData?.displayLanguage || 'en');
  const [languages, setLanguages] = useState(userData.languages || []);
  const [loading, setLoading] = useState(false);
  const [movedItemIndex, setMovedItemIndex] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addArrayItem = (array, setArray, newItem) => {
    if (array.length >= 10) return;
    setArray([...array, newItem]);
  }

  const confirmDelete = () => {
    if (itemToDelete === null) return;
    setLanguages(languages.filter((_, i) => i !== itemToDelete));
    setItemToDelete(null);
  }

  const updateArrayItem = (array, setArray, index, value) => {
    const updated = [...array];
    updated[index] = value;
    setArray(updated);
  };

  const moveItemUp = (index) => {
    if (index === 0) return;
    const updated = [...languages];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setLanguages(updated);
    setMovedItemIndex(index - 1);
    setTimeout(() => setMovedItemIndex(null), 1000);
  };

  const moveItemDown = (index) => {
    if (index === languages.length - 1) return;
    const updated = [...languages];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setLanguages(updated);
    setMovedItemIndex(index + 1);
    setTimeout(() => setMovedItemIndex(null), 1000);
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
          <CheckCheck className="text-cyan-500" /> {t('languages.savedSuccessfully')}
        </p>,
        { autoClose: 2000 }
      );
    } catch (error) {
      console.error("Error updating languages:", error);
      toast.error(t('languages.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4" dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className="text-lg font-bold text-gray-800">🌐 {t('languages.title')}</h3>

      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-2 md:p-4 rounded-xl border border-cyan-200 space-y-3">
        <div className="space-y-2">
          {languages.map((lang, index) => (
            <div key={index} className={`flex gap-2 items-center transition-all duration-500 rounded-lg p-1 ${movedItemIndex === index ? 'bg-cyan-100 ring-2 ring-cyan-300' : ''}`}>
              <input
                type="text"
                value={lang}
                maxLength={50}
                onChange={(e) => updateArrayItem(languages, setLanguages, index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white transition"
              />
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => moveItemUp(index)}
                  disabled={index === 0}
                  className="p-1.5 hover:bg-cyan-100 rounded-lg transition-colors text-cyan-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowUp size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => moveItemDown(index)}
                  disabled={index === languages.length - 1}
                  className="p-1.5 hover:bg-cyan-100 rounded-lg transition-colors text-cyan-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowDown size={18} />
                </button>
                <div className="w-px h-6 bg-cyan-200 mx-1"></div>
                <button
                  type="button"
                  onClick={() => setItemToDelete(index)}
                  className="hover:bg-red-100 rounded-lg p-2 transition-colors"
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
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
          <Plus size={18} /> {languages.length >= 10 ? "10 Max" : t('languages.addLanguage')}
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
              <Loader size={20} className="animate-spin" /> {t('languages.saving')}
            </>
          ) : (
            `💾 ${t('languages.save')}`
          )}
        </button>
      </div>

      {/* Delete Modal */}
      {mounted && itemToDelete !== null && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative flex flex-col items-center text-center transform transition-all scale-100 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setItemToDelete(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500 ring-4 ring-red-50">
              <AlertCircle size={32} />
            </div>

            <div className="w-full">
              <div className="text-gray-600 mb-6 text-base leading-relaxed">
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-gray-800">Are you sure you want to delete this language?</span>
                  <span className="font-bold text-black border-t pt-2 mt-1 break-all">"{languages[itemToDelete] || t('languages.thisLanguage') || "this language"}"</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-all duration-200"
              >
                {t('languages.cancel') || "Cancel"}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                <span>{t('languages.delete') || "Delete"}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
