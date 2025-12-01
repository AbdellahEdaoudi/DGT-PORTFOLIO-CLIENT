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

    return (
        <form onSubmit={handleSave}>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl border-2 border-gray-200 rounded-2xl p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🌍 Display Language</h2>
                <p className="text-gray-600 mb-4">
                    Choose the language in which your portfolio will be displayed to visitors.
                </p>

                <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition-all">
                        <input
                            type="radio"
                            name="displayLanguage"
                            value="en"
                            checked={displayLanguage === "en"}
                            onChange={(e) => setDisplayLanguage(e.target.value)}
                            className="w-5 h-5 text-teal-600"
                        />
                        <div className="flex-1">
                            <span className="font-semibold text-gray-800">English</span>
                            <p className="text-sm text-gray-500">Display portfolio in English</p>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition-all">
                        <input
                            type="radio"
                            name="displayLanguage"
                            value="fr"
                            checked={displayLanguage === "fr"}
                            onChange={(e) => setDisplayLanguage(e.target.value)}
                            className="w-5 h-5 text-teal-600"
                        />
                        <div className="flex-1">
                            <span className="font-semibold text-gray-800">Français</span>
                            <p className="text-sm text-gray-500">Afficher le portfolio en français</p>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition-all">
                        <input
                            type="radio"
                            name="displayLanguage"
                            value="ar"
                            checked={displayLanguage === "ar"}
                            onChange={(e) => setDisplayLanguage(e.target.value)}
                            className="w-5 h-5 text-teal-600"
                        />
                        <div className="flex-1">
                            <span className="font-semibold text-gray-800">العربية</span>
                            <p className="text-sm text-gray-500">عرض المحفظة باللغة العربية</p>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition-all">
                        <input
                            type="radio"
                            name="displayLanguage"
                            value="de"
                            checked={displayLanguage === "de"}
                            onChange={(e) => setDisplayLanguage(e.target.value)}
                            className="w-5 h-5 text-teal-600"
                        />
                        <div className="flex-1">
                            <span className="font-semibold text-gray-800">Deutsch</span>
                            <p className="text-sm text-gray-500">Portfolio auf Deutsch anzeigen</p>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition-all">
                        <input
                            type="radio"
                            name="displayLanguage"
                            value="ru"
                            checked={displayLanguage === "ru"}
                            onChange={(e) => setDisplayLanguage(e.target.value)}
                            className="w-5 h-5 text-teal-600"
                        />
                        <div className="flex-1">
                            <span className="font-semibold text-gray-800">Русский</span>
                            <p className="text-sm text-gray-500">Показать портфолио на русском</p>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition-all">
                        <input
                            type="radio"
                            name="displayLanguage"
                            value="ja"
                            checked={displayLanguage === "ja"}
                            onChange={(e) => setDisplayLanguage(e.target.value)}
                            className="w-5 h-5 text-teal-600"
                        />
                        <div className="flex-1">
                            <span className="font-semibold text-gray-800">日本語</span>
                            <p className="text-sm text-gray-500">ポートフォリオを日本語で表示</p>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition-all">
                        <input
                            type="radio"
                            name="displayLanguage"
                            value="zh"
                            checked={displayLanguage === "zh"}
                            onChange={(e) => setDisplayLanguage(e.target.value)}
                            className="w-5 h-5 text-teal-600"
                        />
                        <div className="flex-1">
                            <span className="font-semibold text-gray-800">中文</span>
                            <p className="text-sm text-gray-500">以中文显示作品集</p>
                        </div>
                    </label>
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
