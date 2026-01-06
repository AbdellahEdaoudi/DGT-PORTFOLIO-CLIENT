"use client"
import 'flag-icons/css/flag-icons.min.css'
import axios from 'axios'
import { CheckCheck, Loader, Globe } from '../../Components/Icons'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { getTranslation } from '../../translations/update-profile'


function DisplayLanguage({ userData, setUserDetails }) {
    const [displayLanguage, setDisplayLanguage] = useState(userData?.displayLanguage || "en")
    const t = getTranslation(displayLanguage || 'en');
    const [loading, setLoading] = useState(false)

    const handleSave = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await axios.put(`/api/proxy/users/update/display-language`, { displayLanguage })
            toast(<p className='flex gap-3 items-center'><CheckCheck className="text-teal-500" />
                {t('userInfo.savedSuccessfully')}
            </p>, {
                autoClose: 2000,
            })
            setUserDetails(prev => ({
                ...(prev || {}),
                displayLanguage
            }))
        } catch (error) {
            console.error("Error updating display language:", error)
            toast.error("Failed to update display language")
        } finally {
            setLoading(false)
        }
    }


    const languages = [
        { value: "en", label: "English", description: "Display portfolio in English", flag: "gb" },
        { value: "fr", label: "Français", description: "Afficher le portfolio en français", flag: "fr" },
        { value: "es", label: "Español", description: "Mostrar portafolio en español", flag: "es" },
        { value: "pt", label: "Português", description: "Exibir portfólio em Português", flag: "pt" },
        { value: "it", label: "Italiano", description: "Visualizza portfolio in Italiano", flag: "it" },
        { value: "de", label: "Deutsch", description: "Portfolio auf Deutsch anzeigen", flag: "de" },
        { value: "ar", label: "العربية", description: "عرض المحفظة باللغة العربية", flag: "sa" },
        { value: "nl", label: "Nederlands", description: "Portfolio in het Nederlands weergeven", flag: "nl" },
        { value: "tr", label: "Türkçe", description: "Portföyü Türkçe göster", flag: "tr" },
        { value: "ru", label: "Русский", description: "Показать портфолио на русском", flag: "ru" },
        { value: "ja", label: "日本語", description: "ポートフォリオを日本語で表示", flag: "jp" },
        { value: "zh", label: "中文", description: "以中文显示作品集", flag: "cn" },
        { value: "hi", label: "हिंदी", description: "पोर्टफोलियो हिंदी में दिखाएं", flag: "in" },
        { value: "ko", label: "한국어", description: "포트폴리오를 한국어로 표시", flag: "kr" },
        { value: "id", label: "Bahasa Indonesia", description: "Tampilkan portofolio dalam bahasa Indonesia", flag: "id" },
        { value: "pl", label: "Polski", description: "Wyświetl portfolio w języku polskim", flag: "pl" },
    ]

    const currentFlag = languages.find(l => l.value === displayLanguage)?.flag || 'gb';

    return (
        <form onSubmit={handleSave} className="relative w-full" dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <div className="bg-white/80 md:p-2 space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className="p-1.5 bg-white rounded-xl shadow-sm border border-gray-100">
                            <span className={`fi fi-${currentFlag} text-2xl rounded shadow-sm`}></span>
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-lg font-bold text-gray-800">
                                {t('displayLanguage.title')}
                            </h2>
                            <p className="text-gray-500 text-xs md:text-sm max-w-2xl">
                                {t('displayLanguage.description')}
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            hidden md:flex
                            bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700
                            text-white font-bold px-8 py-3 rounded-xl
                            shadow-lg hover:shadow-teal-500/30 disabled:opacity-50 disabled:shadow-none
                            transition-all duration-300 items-center gap-2.5 transform hover:-translate-y-0.5
                        "
                    >
                        {loading ? (
                            <>
                                <Loader size={20} className="animate-spin" />
                                <span>{t('displayLanguage.saving')}</span>
                            </>
                        ) : (
                            <>
                                <CheckCheck size={20} />
                                <span>{t('displayLanguage.save')}</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Languages Grid */}
                <div className="grid grid-cols-4 gap-2 md:gap-4">
                    {languages.map((lang) => {
                        const isSelected = displayLanguage === lang.value;
                        return (
                            <label
                                key={lang.value}
                                className={`
                                    relative group cursor-pointer rounded-lg md:rounded-xl border-2 transition-all duration-200 overflow-hidden
                                    ${isSelected
                                        ? 'border-teal-500 bg-teal-50/30 shadow-md ring-1 ring-teal-500/20'
                                        : 'border-gray-100 bg-white hover:border-teal-200 hover:shadow-lg hover:shadow-gray-100/50'
                                    }
                                `}
                            >
                                <input
                                    type="radio"
                                    name="displayLanguage"
                                    value={lang.value}
                                    checked={isSelected}
                                    onChange={(e) => setDisplayLanguage(e.target.value)}
                                    className="hidden"
                                />

                                <div className="p-1.5 md:p-4 flex flex-col md:flex-row md:items-start gap-1.5 md:gap-4 md:text-left">
                                    <div className={`
                                        w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center shadow-sm text-xl md:text-2xl
                                        ${isSelected ? 'bg-white shadow-teal-100' : 'bg-gray-50'}
                                    `}>
                                        <span className={`fi fi-${lang.flag} rounded-md`}></span>
                                    </div>

                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-1">
                                            <span className={`font-bold text-[10px] md:text-base truncate w-full ${isSelected ? 'text-teal-900' : 'text-gray-800'}`}>
                                                {lang.label}
                                            </span>
                                            {isSelected && (
                                                <div className="hidden md:flex w-5 h-5 rounded-full bg-teal-500 items-center justify-center animate-in zoom-in duration-200">
                                                    <CheckCheck className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <p className={`hidden md:block text-xs mt-1 transition-colors duration-200 ${isSelected ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                                            {lang.description || lang.label}
                                        </p>
                                    </div>
                                </div>

                                {/* Active Indicator Bar */}
                                <div className={`absolute bottom-0 left-0 w-full h-0.5 md:h-1 transition-all duration-300 ${isSelected ? 'bg-teal-500' : 'bg-transparent group-hover:bg-teal-100'}`} />
                            </label>
                        );
                    })}
                </div>

                {/* Mobile Save Button */}
                <div className="md:hidden pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full justify-center
                            bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700
                            text-white font-bold px-6 py-3.5 rounded-xl
                            shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 disabled:opacity-50 
                            transition-all duration-300 flex items-center gap-2
                        "
                    >
                        {loading ? (
                            <>
                                <Loader size={20} className="animate-spin" />
                                <span>{t('displayLanguage.saving')}</span>
                            </>
                        ) : (
                            <>
                                <CheckCheck size={20} />
                                <span>{t('displayLanguage.save')}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default DisplayLanguage
