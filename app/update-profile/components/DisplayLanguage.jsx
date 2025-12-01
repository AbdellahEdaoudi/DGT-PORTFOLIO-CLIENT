"use client"
import axios from 'axios'
import { CheckCheck, Loader } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

function DisplayLanguage({ userData, setUserDetails }) {
    const [displayLanguage, setDisplayLanguage] = useState(userData?.displayLanguage || "en")
    const [loading, setLoading] = useState(false)

    const handleSave = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await axios.put(`/api/proxy/users/update/display-language`, { displayLanguage })
            toast(<p className='flex gap-3 items-center'><CheckCheck className="text-teal-500" />
               updated successfully!
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
    const translations = {
        title: {
            en: "🌍 Display Language",
            fr: "🌍 Langue d'affichage",
            ar: "🌍 لغة العرض",
            de: "🌍 Anzeigesprache",
            ru: "🌍 Язык отображения",
            ja: "🌍 表示言語",
            zh: "🌍 显示语言",
        },
        description: {
            en: "Choose the language in which your portfolio will be displayed to visitors.",
            fr: "Choisissez la langue dans laquelle votre portfolio sera affiché aux visiteurs.",
            ar: "اختر اللغة التي سيتم بها عرض محفظتك للزوار.",
            de: "Wählen Sie die Sprache, in der Ihr Portfolio Besuchern angezeigt werden soll.",
            ru: "Выберите язык, на котором ваше портфолио будет отображаться посетителям.",
            ja: "訪問者にポートフォリオが表示される言語を選択してください。",
            zh: "选择您的作品集向访问者显示的语言。",
        },
    }
    const currentLanguage = displayLanguage;
    const translatedTitle = translations.title[currentLanguage] || translations.title.en;
    const translatedDescription = translations.description[currentLanguage] || translations.description.en;

    return (
        <form onSubmit={handleSave}>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl border-2 border-gray-200 rounded-2xl p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{translatedTitle}</h2>
                <p className="text-gray-600 mb-4">
                    {translatedDescription}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { value: "en", label: "English", description: "Display portfolio in English" },
                        { value: "fr", label: "Français", description: "Afficher le portfolio en français" },
                        { value: "ar", label: "Arabic", description: "عرض المحفظة باللغة العربية" },
                        { value: "de", label: "Deutsch", description: "Portfolio auf Deutsch anzeigen" },
                        { value: "ru", label: "Русский", description: "Показать портфолио на русском" },
                        { value: "ja", label: "日本語", description: "ポートフォリオを日本語で表示" },
                        { value: "zh", label: "中文", description: "以中文显示作品集" },
                    ].map((lang) => (
                        <label
                            key={lang.value}
                            className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition-all"
                        >
                            <input
                                type="radio"
                                name="displayLanguage"
                                value={lang.value}
                                checked={displayLanguage === lang.value}
                                onChange={(e) => setDisplayLanguage(e.target.value)}
                                className="w-5 h-5 text-teal-600"
                            />
                            <div className="flex-1">
                                <span className="font-semibold text-gray-800">{lang.label}</span>
                                <p className="text-sm text-gray-500">{lang.description}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex justify-end py-4 border-b-2 border-gray-200">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
                >
                    {loading ? (
                        <>
                            <Loader size={20} className="animate-spin" /> Saving...
                        </>
                    ) : (
                        "💾 Save"
                    )}
                </button>
            </div>
        </form>
    )
}

export default DisplayLanguage
