"use client"
import axios from 'axios'
import { CheckCheck, Loader } from '../../Components/Icons'
import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from '../../lib/translations'

export default function About({ userData }) {
  const { t } = useTranslation(userData?.displayLanguage || 'en')
  const [about, setabout] = useState(userData?.about || "")
  const [loading, setLoading] = useState(false)


  const UpAbout = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.put(`/api/proxy/users/update/about`, {
        about,
      })
      toast(<p className='flex gap-3 items-center'><CheckCheck className="text-teal-500" />
        {t('savedSuccessfully')}</p>, {
        autoClose: 2000,
      })
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Summary */}
      <div>
        <label className="block text-lg font-bold text-gray-800 mb-3">📝 {t('summary')}</label>
        <textarea
          value={about}
          maxLength={500}
          onChange={(e) => setabout(e.target.value)}
          placeholder={t('tellUsAboutYourself')}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-56 transition bg-white"
        />
      </div>
      {/* Submit Button */}
      <div className="flex justify-end py-4 border-b-2 border-gray-200">
        <button onClick={UpAbout}
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
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