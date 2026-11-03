"use client"
import axios from 'axios';
import { handleApiError } from "../../utils/apiErrorHandler";
import { CheckCheck, Loader, User, Sparkles, Lightbulb, Trash2, X, AlertCircle } from '../../components/lucide-react'
import { useState, useEffect } from 'react'
import { createPortal } from "react-dom"
import { useToast } from '../../components/Toast'
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function About({ data, setData, content }) {
  const toast = useToast()
  const [about, setAbout] = useState(data?.user?.about || "")
  const [loading, setLoading] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.put(`${SERVER_URL}/api/users/update/about`, {
        about,
      }, { withCredentials: true })

      // Update global state to reflect changes immediately without refresh
      if (setData) {
        setData(prev => ({
          ...prev,
          user: {
            ...(prev?.user || {}),
            about: about
          }
        }));
      }
      localStorage.setItem(`data_${data?.user?.username}`, JSON.stringify({
        ...data,
        user: {
          ...(data?.user || {}),
          about: about
        }
      }));

      toast.success(content?.savedSuccessfully || "Saved successfully!")
    } catch (error) {
      await handleApiError({ error, defaultErrorMsg: content?.errorMessage || "Error saving", toast });
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setShowClearModal(true)
  }

  const confirmClear = () => {
    setAbout("")
    setShowClearModal(false)
  }

  const maxLength = 500
  const progress = (about.length / maxLength) * 100

  return (
    <div className="space-y-8" dir={data?.user?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100">
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="text-sm sm:text-xl font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
            <User className="text-teal-600 w-3 h-3 sm:w-6 sm:h-6" />
            {content?.summary || "Summary"}
          </h3>
          <p className="text-[10px] sm:text-sm text-gray-500 max-w-2xl">
            {content?.description}
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="
            hidden md:flex
            bg-gray-900 hover:bg-gray-800
            text-white font-bold px-8 py-3 rounded-xl
            shadow-lg hover:shadow-xl disabled:opacity-50 disabled:shadow-none
            transition-all duration-300 items-center gap-2.5 transform hover:-translate-y-0.5
          "
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" /> {content?.saving || "Saving..."}
            </>
          ) : (
            <>
              <CheckCheck size={20} /> {content?.save || "Save"}
            </>
          )}
        </button>
      </div>

      {/* Editor Section */}
      <div className="
        bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-200 
        overflow-hidden transition-all duration-300
        hover:shadow-md hover:border-gray-300
        focus-within:border-teal-500 focus-within:ring-2 sm:focus-within:ring-4 focus-within:ring-teal-500/10
      ">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-100 px-2 py-1.5 sm:px-4 sm:py-3 flex justify-between items-center text-[10px] sm:text-sm text-gray-500">
          <div className="flex items-center gap-1 sm:gap-2">
            <Sparkles className="text-teal-500 w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-medium text-gray-700">{content?.bio || "Bio"}</span>
          </div>
          {about.length > 0 && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-xs font-medium"
            >
              <Trash2 className="w-3 h-3 sm:w-[14px] sm:h-[14px]" />
              {content?.clear || "Clear All"}
            </button>
          )}
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={about}
            maxLength={maxLength}
            onChange={(e) => setAbout(e.target.value)}
            placeholder={content?.placeholder}
            className="
                w-full px-2 py-2 sm:px-5 sm:py-5 min-h-[150px] sm:min-h-[220px]
                border-0 focus:ring-0 outline-none
                text-gray-700 placeholder-gray-400 leading-relaxed
                resize-y bg-transparent
                text-[11px] sm:text-base
              "
          />

          {/* Dynamic Progress Bar */}
          <div className="absolute bottom-0 left-0 h-0.5 bg-gray-100 w-full">
            <div
              className={`h-full transition-all duration-300 ${progress > 90 ? 'bg-red-500' : 'bg-teal-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-50 px-2 py-1 sm:px-4 sm:py-2 flex justify-end items-center">
          <div className={`
                text-[9px] sm:text-xs font-mono font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full
                ${about.length >= maxLength ? 'text-red-500 bg-red-50' : 'text-gray-400'}
             `}>
            {about.length} / {maxLength}
          </div>
        </div>
      </div>

      {/* Mobile Save Button */}
      <div className="md:hidden">
        <button
          onClick={handleSave}
          disabled={loading}
          className="
            w-full justify-center
            bg-gray-900 hover:bg-gray-800
            text-white font-bold px-4 py-1.5 sm:px-6 sm:py-3.5 rounded-lg sm:rounded-xl
            shadow-lg hover:shadow-xl disabled:opacity-50 
            transition-all duration-300 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-base
          "
        >
          {loading ? (
            <>
              <Loader size={16} className="animate-spin w-3 h-3 sm:w-5 sm:h-5" /> {content?.saving || "Saving..."}
            </>
          ) : (
            <>
              <CheckCheck className="w-3 h-3 sm:w-5 sm:h-5" /> {content?.save || "Save"}
            </>
          )}
        </button>
      </div>

      {/* Tip Section */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-lg sm:rounded-xl p-2 sm:p-4 flex gap-2 sm:gap-4 items-start">
        <div className="p-1 sm:p-2 bg-blue-100/50 rounded-lg text-blue-600 shrink-0">
          <Lightbulb className="w-3 h-3 sm:w-5 sm:h-5" />
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <h4 className="text-[10px] sm:text-sm font-bold text-gray-800">
            {content?.proTip || "Pro Tip"}
          </h4>
          <p className="text-[9px] sm:text-sm text-gray-600 leading-relaxed">
            {content?.tip}
          </p>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {mounted && showClearModal && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative flex flex-col items-center text-center transform transition-all scale-100 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowClearModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
              title={content?.close || "Close"}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500 ring-4 ring-red-50">
              <AlertCircle size={32} />
            </div>

            <div className="w-full mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {content?.confirmTitle || "Are you sure?"}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {content?.confirmMessage}
              </p>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors duration-200"
              >
                {content?.cancel || "Cancel"}
              </button>
              <button
                onClick={confirmClear}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                <span>{content?.clear || "Clear All"}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}