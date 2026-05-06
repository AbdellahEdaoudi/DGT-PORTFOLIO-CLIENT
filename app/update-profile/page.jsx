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
  const { EmailUser, userLinks, userDetails, setUserDetails, loadingAll } = useContext(MyContext)
  const [activeTab, setActiveTab] = useState("displayLanguage")
  const t = getTranslation(userDetails?.displayLanguage || "en")

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab")
    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  if (loadingAll || !EmailUser || !userDetails) {
    return <MagicalLoader />
  }

  const tabs = [
    { id: "displayLanguage", label: t("sideTabs.displayLanguage"), component: DisplayLanguage },
    { id: "about", label: t("sideTabs.about"), component: About },
    { id: "skills", label: t("sideTabs.skills"), component: Skills },
    { id: "services", label: t("sideTabs.services"), component: Services },
    { id: "education", label: t("sideTabs.education"), component: Education },
    { id: "experience", label: t("sideTabs.experience"), component: Experience },
    { id: "projects", label: t("sideTabs.projects"), component: Projects },
    { id: "certificates", label: t("sideTabs.certificates"), component: Certificates },
    { id: "languages", label: t("sideTabs.languages"), component: Languages },
    { id: "socials", label: t("sideTabs.socials"), component: Socials },
    { id: "bgcolor", label: t("sideTabs.bgcolor"), component: Bgcolor },
    { id: "theme", label: t("sideTabs.theme"), component: Theme },
    { id: "sectionOrdering", label: t("sideTabs.sectionOrdering"), component: SectionOrdering },
  ]

  const currentTab = tabs.find((tab) => tab.id === activeTab)
  const CurrentComponent = currentTab?.component

  return (
    <section>
      <Header lang={userDetails?.displayLanguage} />
      <div
        style={{ backgroundColor: userDetails.bgcolorp }}
        dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}
        className="flex items-center justify-center pt-4 pb-6 duration-300 min-h-screen"
      >
        <div className="w-full max-w-5xl">
          <div className="md:mx-4 px-2 md:px-8 pb-14 bg-white rounded-2xl shadow-2xl space-y-8 pt-8">
            <Userinfo userData={userDetails} setUserDetails={setUserDetails} />
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
                    } ${userDetails.theme !== 1 && tab.id === "bgcolor" ? "hidden" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="text-xs md:text-base">
              {userDetails && CurrentComponent && <CurrentComponent setUserDetails={setUserDetails} userData={userDetails} userLinks={userLinks} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
