"use client";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { ArrowUp, ArrowDown, CheckCheck, Loader, Plus, Trash2 } from "lucide-react";

import { useTranslation } from "../../lib/translations";

export default function Experience({ userData, setUserDetails }) {
  const { t } = useTranslation(userData?.displayLanguage || 'en');
  const [experience, setExperience] = useState(userData.experience || []);
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
    const newExperience = [...experience];
    [newExperience[index - 1], newExperience[index]] = [newExperience[index], newExperience[index - 1]];
    setExperience(newExperience);
  };

  const moveItemDown = (index) => {
    if (index === experience.length - 1) return;
    const newExperience = [...experience];
    [newExperience[index], newExperience[index + 1]] = [newExperience[index + 1], newExperience[index]];
    setExperience(newExperience);
  };

  const saveExperience = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/proxy/users/update/experience`, { experience });

      // Update global state to reflect changes immediately without refresh
      if (setUserDetails) {
        setUserDetails(prev => ({
          ...prev,
          experience: experience
        }));
      }

      toast(
        <p className="flex gap-3 items-center">
          <CheckCheck className="text-amber-500" /> {t('savedSuccessfully')}
        </p>,
        { autoClose: 2000 }
      );
    } catch (error) {
      console.error("Error updating experience:", error);
      toast.error(t('errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4" dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className="text-lg font-bold text-gray-800">⭐ {t('experience')}</h3>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-2 md:p-4 rounded-xl border border-amber-200 space-y-3">
        <div className="space-y-2">
          {experience.map((exp, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-2 md:p-4 shadow-sm hover:shadow-md transition-all duration-300 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={t('company')}
                  value={exp.company}
                  maxLength={100}
                  onChange={(e) =>
                    updateObjectInArray(experience, setExperience, index, "company", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white transition"
                />
                <input
                  type="text"
                  placeholder={t('role')}
                  value={exp.role}
                  maxLength={100}
                  onChange={(e) =>
                    updateObjectInArray(experience, setExperience, index, "role", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white transition"
                />
              </div>

              <textarea
                placeholder={t('description')}
                value={exp.description || ""}
                maxLength={2000}
                onChange={(e) =>
                  updateObjectInArray(experience, setExperience, index, "description", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white h-20 transition"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={t('startDate')}
                  value={exp.startDate || ""}
                  maxLength={20}
                  onChange={(e) =>
                    updateObjectInArray(experience, setExperience, index, "startDate", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white transition"
                />
                <input
                  type="text"
                  placeholder={t('endDate')}
                  value={exp.endDate || ""}
                  maxLength={20}
                  onChange={(e) =>
                    updateObjectInArray(experience, setExperience, index, "endDate", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white transition"
                />
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
                  disabled={index === experience.length - 1}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title={t('moveDown') || "Move Down"}
                >
                  <ArrowDown size={18} className="text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => removeArrayItem(experience, setExperience, index)}
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
          disabled={experience.length >= 10}
          onClick={() => {
            if (experience.length < 10) {
              addArrayItem(experience, setExperience, {
                company: "",
                role: "",
                description: "",
                startDate: "",
                endDate: "",
              })
            }
          }}
          className={`w-full text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${experience.length >= 10 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'}`}
        >
          <Plus size={18} /> {experience.length >= 10 ? "10 Max" : t('addExperience')}
        </button>
      </div>

      <div className="flex justify-end py-4 border-b-2 border-gray-200">
        <button
          onClick={saveExperience}
          disabled={loading}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
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
