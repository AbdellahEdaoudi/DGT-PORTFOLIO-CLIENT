"use client"
import axios from "axios"
import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { toast } from "react-toastify"
import { CheckCheck, Loader, Plus, Trash2, ArrowUp, ArrowDown, X, AlertCircle } from "../../components/Icons"
import { getTranslation } from '../../translations/update-profile'

export default function Skills({ userData, setUserDetails }) {
  const t = getTranslation(userData?.displayLanguage || 'en')
  const [skills, setSkills] = useState(userData.skills || [])
  const [loading, setLoading] = useState(false)
  const [movedItemIndex, setMovedItemIndex] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addArrayItem = (array, setArray, newItem) => {
    if (array.length >= 10) return;
    setArray([...array, newItem])
  }

  const confirmDelete = () => {
    if (itemToDelete === null) return
    setSkills(skills.filter((_, i) => i !== itemToDelete))
    setItemToDelete(null)
  }

  const updateArrayItem = (array, setArray, index, value) => {
    const updated = [...array]
    updated[index] = value
    setArray(updated)
  }

  const moveItemUp = (index) => {
    if (index === 0) return;
    const updated = [...skills];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setSkills(updated);
    setMovedItemIndex(index - 1);
    setTimeout(() => setMovedItemIndex(null), 1000);
  };

  const moveItemDown = (index) => {
    if (index === skills.length - 1) return;
    const updated = [...skills];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setSkills(updated);
    setMovedItemIndex(index + 1);
    setTimeout(() => setMovedItemIndex(null), 1000);
  };

  const UpSkills = async () => {
    setLoading(true)
    try {
      await axios.put(`/api/proxy/users/update/skills`, { skills })

      // Update global state to reflect changes immediately without refresh
      if (setUserDetails) {
        setUserDetails(prev => ({
          ...prev,
          skills: skills
        }));
      }

      toast(
        <p className="flex gap-3 items-center">
          <CheckCheck className="text-purple-500" /> {t('skills.savedSuccessfully')}
        </p>,
        { autoClose: 2000 }
      )
    } catch (error) {
      console.error("Error updating skills:", error)
      toast.error(t('skills.errorMessage'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4" dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className="text-lg font-bold text-gray-800">💡 {t('skills.title')}</h3>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-2 md:p-4 rounded-xl border border-purple-200 space-y-3">
        <div className="space-y-2">
          {skills.map((skill, index) => (
            <div key={index} className={`flex gap-0.5 sm:gap-2 items-center transition-all duration-500 rounded-lg p-0.5 sm:p-1 ${movedItemIndex === index ? 'bg-purple-100 ring-2 ring-purple-300' : 'hover:bg-purple-50/50'}`}>
              <div className="flex-shrink-0 w-4 h-4 sm:w-8 sm:h-8 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full font-bold text-[8px] sm:text-sm border border-purple-200 shadow-sm">
                {index + 1}
              </div>
              <input
                type="text"
                value={skill}
                maxLength={130}
                onChange={(e) => updateArrayItem(skills, setSkills, index, e.target.value)}
                className="flex-1 min-w-0 px-1 py-0.5 sm:px-3 sm:py-2 text-[9px] sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white transition"
                placeholder={`Skill ${index + 1}`}
              />
              <div className="flex items-center gap-0 sm:gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => moveItemUp(index)}
                  disabled={index === 0}
                  className="p-0.5 sm:p-1.5 hover:bg-purple-100 rounded-lg transition-colors text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="w-2.5 h-2.5 sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItemDown(index)}
                  disabled={index === skills.length - 1}
                  className="p-0.5 sm:p-1.5 hover:bg-purple-100 rounded-lg transition-colors text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="w-2.5 h-2.5 sm:w-[18px] sm:h-[18px]" />
                </button>
                <div className="w-px h-3 sm:h-6 bg-purple-200 mx-0.5 sm:mx-1"></div>
                <button
                  type="button"
                  onClick={() => setItemToDelete(index)}
                  className="p-0.5 sm:p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-500"
                >
                  <Trash2 className="w-2.5 h-2.5 sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          disabled={skills.length >= 10}
          onClick={() => {
            if (skills.length < 10) {
              addArrayItem(skills, setSkills, "")
            }
          }}
          className={`w-full text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${skills.length >= 10 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'}`}
        >
          <Plus size={18} /> {skills.length >= 10 ? "10 Max" : t('skills.addSkill')}
        </button>
      </div>
      <div className="flex justify-end py-4 border-b-2 border-gray-200">
        <button
          onClick={UpSkills}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" /> {t('skills.saving')}
            </>
          ) : (
            `💾 ${t('skills.save')}`
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
                  <span className="font-semibold text-gray-800">Are you sure you want to delete this skill?</span>
                  <span className="font-bold text-black border-t pt-2 mt-1 break-all">"{skills[itemToDelete] || "this skill"}"</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-all duration-200"
              >
                {t('skills.cancel') || "Cancel"}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                <span>{t('skills.delete') || "Delete"}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
