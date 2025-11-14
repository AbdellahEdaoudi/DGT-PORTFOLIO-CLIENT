"use client"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { MyContext } from "../Context/MyContext"
import MagicalLoader from "../Components/MagicalLoader"
import { signIn, useSession } from "next-auth/react"
import Header from "../Components/header"
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

export default function UpdateProfilePage() {
  const { data, status } = useSession()
  const { EmailUser,userDetails,setUserDetails,loadingAll} = useContext(MyContext)
  const [activeTab, setActiveTab] = useState("about")

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios.get("/api/proxy/users/getUser")
  //       setUserData(response.data)
  //     } catch (error) {
  //       setUserData("error")
  //       console.error("Error fetching user data:", error)
  //     }
  //   }
  //   if (EmailUser) {
  //    setUserData(userDetails)
  //   fetchUserData()
  //   }
  // }, [EmailUser])
   if (loadingAll || !EmailUser || !userDetails ) {
    return <MagicalLoader />
  }

  const tabs = [
    { id: "about", label: "📝 About", component: About },
    { id: "skills", label: "💡 Skills", component: Skills },
    { id: "services", label: "💼 Services", component: Services },
    { id: "education", label: "🎓 Education", component: Education },
    { id: "experience", label: "⭐ Experience", component: Experience },
    { id: "projects", label: "🚀 Projects", component: Projects },
    { id: "languages", label: "🌐 Languages", component: Languages },
    { id: "socials", label: "🔗 Socials", component: Socials },
    { id: "bgcolor", label: "🎨 Bgcolor", component: Bgcolor },
    { id: "theme", label: "🧩 theme", component: Theme },
  ]

  const currentTab = tabs.find((tab) => tab.id === activeTab)
  const CurrentComponent = currentTab?.component

  return (
    <section>
      <Header />
      <div
        style={{ backgroundColor: userDetails.bgcolorp }}
        className="flex items-center justify-center pt-4 pb-6 duration-300 min-h-screen"
      >
        <div className="w-full max-w-5xl">
          <div className="mx-4 px-6 md:px-8 pb-14 bg-white rounded-2xl shadow-2xl space-y-8 pt-8">
            <Userinfo userData={userDetails} setUserDetails={setUserDetails} />
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`md:px-4 py-2 rounded-lg font-semibold transition-all text-sm md:text-base ${
                    activeTab === tab.id
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
              <div className="text-xs md:text-base">
                {userDetails && CurrentComponent && <CurrentComponent setUserDetails={setUserDetails} userData={userDetails} />}
              </div>
          </div>
        </div>
      </div>
    </section>
  )
}
