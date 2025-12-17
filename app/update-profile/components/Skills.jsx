"use client"
import axios from "axios"
import React, { useState } from "react"
import { toast } from "react-toastify"
import { CheckCheck, Loader, Plus, Trash2 } from "../../Components/Icons"

import { useTranslation } from "../../lib/translations"

export default function Skills({ userData, setUserDetails }) {
  const { t } = useTranslation(userData?.displayLanguage || 'en')
  const [skills, setSkills] = useState(userData.skills || [])
  const [loading, setLoading] = useState(false)

  const addArrayItem = (array, setArray, newItem) => {
    if (array.length >= 10) return;
    setArray([...array, newItem])
  }

  const removeArrayItem = (array, setArray, index) => {
    setArray(array.filter((_, i) => i !== index))
  }

  const updateArrayItem = (array, setArray, index, value) => {
    const updated = [...array]
    updated[index] = value
    setArray(updated)
  }

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
          <CheckCheck className="text-purple-500" /> {t('savedSuccessfully')}
        </p>,
        { autoClose: 2000 }
      )
    } catch (error) {
      console.error("Error updating skills:", error)
      toast.error(t('errorMessage'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4" dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <h3 className="text-lg font-bold text-gray-800">💡 {t('skills')}</h3>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-2 md:p-4 rounded-xl border border-purple-200 space-y-3">
        <div className="space-y-2">
          {skills.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={skill}
                maxLength={130}
                onChange={(e) => updateArrayItem(skills, setSkills, index, e.target.value)}
                placeholder={t('skillName')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white transition"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(skills, setSkills, index)}
                className="hover:bg-red-100 rounded-lg p-2 transition-colors"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
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
          <Plus size={18} /> {skills.length >= 10 ? "10 Max" : t('addSkill')}
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
              <Loader size={20} className="animate-spin" /> {t('saving')}
            </>
          ) : (
            `💾 ${t('save')}`
          )}
        </button>
      </div>
    </div>
  )
}
