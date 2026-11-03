"use client"
import { useContext, useState, useEffect } from "react"
import { MyContext } from "../context/context"
import MagicalLoader from "../components/MagicalLoader"
import Header from "../components/LandingPage/header"
import Userinfo from "./components/Userinfo"
import About from "./components/About"
import Services from "./components/Services"
import Skills from "./components/Skills"
import Education from "./components/Education"
import Languages from "./components/Languages"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Bgcolor from "./components/Bgcolor"
import Socials from "./components/Socials"
import Theme from "./components/Theme"
import DisplayLanguage from "./components/DisplayLanguage"
import Certificates from "./components/Certificates"
import SectionOrdering from "./components/SectionOrdering"
import { getTranslation } from "../translations/update-profile"

export default function UpdateProfilePage() {
  const { data, setData, loadingAll } = useContext(MyContext)
  const [activeTab, setActiveTab] = useState("displayLanguage")
  const [dictionary, setDictionary] = useState(null)
  const lang = data?.user?.displayLanguage || "en"

  useEffect(() => {
    const loadTranslation = async () => {
      const dict = await getTranslation(lang)
      setDictionary(dict)
    }
    loadTranslation()
  }, [lang])

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab")
    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  if (loadingAll || !data?.user || !dictionary) {
    return <MagicalLoader />
  }

  const tabs = [
    { id: "displayLanguage", label: dictionary?.sideTabs?.displayLanguage || "Display Language", component: DisplayLanguage, content: dictionary?.displayLanguage },
    { id: "about", label: dictionary?.sideTabs?.about || "About", component: About, content: dictionary?.about },
    { id: "skills", label: dictionary?.sideTabs?.skills || "Skills", component: Skills, content: dictionary?.skills },
    { id: "services", label: dictionary?.sideTabs?.services || "Services", component: Services, content: dictionary?.services },
    { id: "education", label: dictionary?.sideTabs?.education || "Education", component: Education, content: dictionary?.education },
    { id: "experience", label: dictionary?.sideTabs?.experience || "Experience", component: Experience, content: dictionary?.experience },
    { id: "projects", label: dictionary?.sideTabs?.projects || "Projects", component: Projects, content: dictionary?.projects },
    { id: "certificates", label: dictionary?.sideTabs?.certificates || "Certificates", component: Certificates, content: dictionary?.certificates },
    { id: "languages", label: dictionary?.sideTabs?.languages || "Languages", component: Languages, content: dictionary?.languages },
    { id: "socials", label: dictionary?.sideTabs?.socials || "Socials", component: Socials, content: dictionary?.socials },
    { id: "bgcolor", label: dictionary?.sideTabs?.bgcolor || "Background Color", component: Bgcolor, content: dictionary?.bgColor },
    { id: "theme", label: dictionary?.sideTabs?.theme || "Theme", component: Theme, content: dictionary?.theme },
    { id: "sectionOrdering", label: dictionary?.sideTabs?.sectionOrdering || "Section Ordering", component: SectionOrdering, content: { ...dictionary?.sectionOrdering, tabs: dictionary?.tabs } },
  ]

  const currentTab = tabs.find((tab) => tab.id === activeTab)
  const CurrentComponent = currentTab?.component

  return (
    <section>
      <Header lang={data?.user?.displayLanguage} />
      <div
        style={{ backgroundColor: data?.user?.bgcolor }}
        dir={data?.user?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
        className="flex items-center justify-center pt-4 pb-6 duration-300 min-h-screen"
      >
        <div className="w-full max-w-5xl">
          <div className="md:mx-4 px-2 md:px-8 pb-14 bg-white rounded-2xl shadow-2xl space-y-8 pt-8">
            <Userinfo data={data} setData={setData} content={dictionary?.userInfo} />
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    localStorage.setItem("activeTab", tab.id)
                  }}
                  className={`md:px-4 py-2 rounded-lg font-semibold transition-all text-xs md:text-base ${activeTab === tab.id
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } ${data?.user?.theme !== 1 && tab.id === "bgcolor" ? "hidden" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="text-xs md:text-base">
              {data?.user && CurrentComponent && <CurrentComponent data={data} setData={setData} content={currentTab?.content} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
