"use client";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { ArrowUp, ArrowDown, CheckCheck, Loader, Plus, Trash2 } from "../../Components/Icons";

import { useTranslation } from "../../lib/translations";

export default function Education({ userData, setUserDetails }) {
  const { t } = useTranslation(userData?.displayLanguage || 'en');
  const [education, setEducation] = useState(userData.education || []);
  const [loading, setLoading] = useState(false);

  const addArrayItem = (array, setArray, newItem) => {
    if (array.length >= 10) return;
    setArray([...array, newItem]);
  }
  const removeArrayItem = (array, setArray, index) =>
    setArray(array.filter((_, i) => i !== index));
  const updateObjectInArray = (array, setArray, index, key, value) => {
    const updated = [...array];
    updated[index] = { ...updated[index], [key]: value };
    setArray(updated);
  };

  const moveItemUp = (index) => {
    if (index === 0) return;
    const newEducation = [...education];
    [newEducation[index - 1], newEducation[index]] = [newEducation[index], newEducation[index - 1]];
    setEducation(newEducation);
  };

  const moveItemDown = (index) => {
    if (index === education.length - 1) return;
    const newEducation = [...education];
    [newEducation[index], newEducation[index + 1]] = [newEducation[index + 1], newEducation[index]];
    setEducation(newEducation);
  };

  const saveEducation = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/proxy/users/update/education`, { education });

      // Update global state to reflect changes immediately without refresh
      if (setUserDetails) {
        setUserDetails(prev => ({
          ...prev,
          education: education
        }));
      }

      toast(
        <p className="flex gap-3 items-center">
          <CheckCheck className="text-blue-500" /> {t('savedSuccessfully')}
        </p>,
        { autoClose: 2000 }
      );
    } catch (error) {
      console.error("Error updating education:", error);
      toast.error(t('errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4" dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className="text-lg font-bold text-gray-800">🎓 {t('education')}</h3>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-2 md:p-4 rounded-xl border border-blue-200 space-y-3">
        <div className="space-y-2">
          {education.map((edu, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-2 md:p-4 shadow-sm hover:shadow-md transition-all duration-300 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={t('school')}
                  maxLength={100}
                  value={edu.school}
                  onChange={(e) =>
                    updateObjectInArray(education, setEducation, index, "school", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                />
                <input
                  type="text"
                  placeholder={t('degree')}
                  value={edu.degree || ""}
                  maxLength={100}
                  onChange={(e) =>
                    updateObjectInArray(education, setEducation, index, "degree", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                />
                <input
                  type="text"
                  placeholder={t('field')}
                  value={edu.field || ""}
                  maxLength={100}
                  onChange={(e) =>
                    updateObjectInArray(education, setEducation, index, "field", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder={t('startYear')}
                    value={edu.startYear || ""}
                    maxLength={20}
                    onChange={(e) =>
                      updateObjectInArray(education, setEducation, index, "startYear", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                  />
                  <input
                    type="text"
                    placeholder={t('endYear')}
                    maxLength={20}
                    value={edu.endYear || ""}
                    onChange={(e) =>
                      updateObjectInArray(education, setEducation, index, "endYear", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                  />
                </div>
              </div>

              <div className="flex flex-row-reverse gap-2">
                <button
                  type="button"
                  onClick={() => moveItemUp(index)}
                  disabled={index === 0}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title={t('moveUp') || "Move Up"}
                >
                  <ArrowUp size={18} className="text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItemDown(index)}
                  disabled={index === education.length - 1}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title={t('moveDown') || "Move Down"}
                >
                  <ArrowDown size={18} className="text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => removeArrayItem(education, setEducation, index)}
                  className="flex-1 hover:bg-red-100 rounded-lg p-1 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} className="text-red-500" /> {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={education.length >= 10}
          onClick={() => {
            if (education.length < 10) {
              addArrayItem(education, setEducation, {
                school: "",
                degree: "",
                field: "",
                startYear: "",
                endYear: "",
              })
            }
          }}
          className={`w-full text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${education.length >= 10 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'}`}
        >
          <Plus size={18} /> {education.length >= 10 ? "10 Max" : t('addEducation')}
        </button>
      </div>

      <div className="flex justify-end py-4 border-b-2 border-gray-200">
        <button
          onClick={saveEducation}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
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
