"use client"
import axios from 'axios'
import { CheckCheck, Loader } from '../../Components/Icons'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from '../../lib/translations'

import 'flag-icons/css/flag-icons.min.css'

function DisplayLanguage({ userData, setUserDetails }) {
    const { t } = useTranslation(userData?.displayLanguage || 'en');
    const [displayLanguage, setDisplayLanguage] = useState(userData?.displayLanguage || "en")
    const [loading, setLoading] = useState(false)

    const handleSave = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await axios.put(`/api/proxy/users/update/display-language`, { displayLanguage })
            toast(<p className='flex gap-3 items-center'><CheckCheck className="text-teal-500" />
                {t('savedSuccessfully')}
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
            es: "🌍 Idioma de visualización",
            ar: "🌍 لغة العرض",
            de: "🌍 Anzeigesprache",
            ru: "🌍 Язык отображения",
            ja: "🌍 表示言語",
            zh: "🌍 显示语言",
            nl: "🌍 Weergavetaal",
            pt: "🌍 Idioma de Exibição",
            it: "🌍 Lingua di Visualizzazione",
            hi: "🌍 प्रदर्शन भाषा",
            tr: "🌍 Görüntüleme Dili",
            ko: "🌍 표시 언어",
            id: "🌍 Bahasa Tampilan",
            pl: "🌍 Język wyświetlania",
        },
        description: {
            en: "Choose the language in which your portfolio will be displayed to visitors.",
            fr: "Choisissez la langue dans laquelle votre portfolio sera affiché aux visiteurs.",
            es: "Elige el idioma en el que se mostrará tu portafolio a los visitantes.",
            ar: "اختر اللغة التي سيتم بها عرض محفظتك للزوار.",
            de: "Wählen Sie die Sprache, in der Ihr Portfolio Besuchern angezeigt werden soll.",
            ru: "Выберите язык, на котором ваше портфолио будет отображаться посетителям.",
            ja: "訪問者にポートフォリオが表示される言語を選択してください。",
            zh: "选择您的作品集向访问者显示的语言。",
            nl: "Kies de taal waarin uw portfolio aan bezoekers wordt getoond.",
            pt: "Escolha o idioma em que seu portfólio será exibido aos visitantes.",
            it: "Scegli la lingua in cui il tuo portfolio verrà mostrato ai visitatori.",
            hi: "वह भाषा चुनें जिसमें आपका पोर्टफोलियो आगंतुकों को दिखाया जाएगा।",
            tr: "Portföyünüzün ziyaretçilere gösterileceği dili seçin.",
            ko: "방문자에게 포트폴리오가 표시될 언어를 선택하세요.",
            id: "Pilih bahasa di mana portofolio Anda akan ditampilkan kepada pengunjung.",
            pl: "Wybierz język, w którym Twoje portfolio będzie wyświetlane odwiedzającym.",
        },
    }
    const currentLanguage = displayLanguage;
    const translatedTitle = translations.title[currentLanguage] || translations.title.en;
    const translatedDescription = translations.description[currentLanguage] || translations.description.en;

    const languages = [
        { value: "en", label: "English", description: "Display portfolio in English", flag: "gb" },
        { value: "fr", label: "Français", description: "Afficher le portfolio en français", flag: "fr" },
        { value: "es", label: "Español", description: "Mostrar portafolio en español", flag: "es" },
        { value: "pt", label: "Português", description: "Exibir portfólio em Português", flag: "pt" },
        { value: "it", label: "Italiano", description: "Visualizza portfolio in Italiano", flag: "it" },
        { value: "de", label: "Deutsch", description: "Portfolio auf Deutsch anzeigen", flag: "de" },
        { value: "ar", label: "Arabic", description: "عرض المحفظة باللغة العربية", flag: "sa" },
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

    return (
        <form onSubmit={handleSave} className="relative w-full">
            <div className="bg-white/80 space-y-6 p-2">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold text-gray-800">
                            {translatedTitle}
                        </h2>
                        <p className="text-gray-500 text-xs md:text-sm max-w-2xl">
                            {translatedDescription}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            hidden md:flex
                            bg-gray-900 text-white font-bold px-6 py-2.5 rounded-lg 
                            shadow-lg hover:shadow-xl hover:bg-gray-800 disabled:opacity-50 
                            transition-all duration-200 items-center gap-2
                        "
                    >
                        {loading ? (
                            <>
                                <Loader size={18} className="animate-spin" />
                                {t('saving')}
                            </>
                        ) : (
                            <>
                                💾 {t('save')}
                            </>
                        )}
                    </button>
                </div>

                {/* Languages Grid */}
                <div className="grid grid-cols-4 gap-2 md:gap-3">
                    {languages.map((lang) => {
                        const isSelected = displayLanguage === lang.value;
                        return (
                            <label
                                key={lang.value}
                                className={`
                                    relative flex flex-col p-1.5 md:p-3 rounded-lg md:rounded-xl cursor-pointer transition-all duration-200 group
                                    ${isSelected
                                        ? 'bg-teal-50 border md:border-2 border-teal-500 shadow-sm md:shadow-md'
                                        : 'bg-white border md:border-2 border-transparent hover:border-gray-200 hover:shadow-sm'
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

                                <div className="flex items-center justify-between mb-1 md:mb-2">
                                    <span className={`
                                        text-lg md:text-2xl rounded shadow-sm
                                        fi fi-${lang.flag}
                                    `}></span>

                                    <div className={`
                                        w-3 h-3 md:w-5 md:h-5 rounded-full border md:border-2 flex items-center justify-center
                                        ${isSelected ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}
                                    `}>
                                        {isSelected && <CheckCheck className="w-2 h-2 md:w-3 md:h-3 text-white" />}
                                    </div>
                                </div>

                                <div>
                                    <span className={`block font-bold text-[10px] md:text-base truncate ${isSelected ? 'text-teal-900' : 'text-gray-800'}`}>
                                        {lang.label}
                                    </span>
                                    <p className={`hidden md:block text-xs text-gray-500 line-clamp-1 ${isSelected ? 'text-teal-700/80' : ''}`}>
                                        {lang.description}
                                    </p>
                                </div>
                            </label>
                        );
                    })}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        md:hidden w-full justify-center
                        bg-gray-900 text-white font-bold px-6 py-2.5 rounded-lg 
                        shadow-lg hover:shadow-xl hover:bg-gray-800 disabled:opacity-50 
                        transition-all duration-200 flex items-center gap-2
                    "
                >
                    {loading ? (
                        <>
                            <Loader size={18} className="animate-spin" />
                            {t('saving')}
                        </>
                    ) : (
                        <>
                            💾 {t('save')}
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

export default DisplayLanguage
