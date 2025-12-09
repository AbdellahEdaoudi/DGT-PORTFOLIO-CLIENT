"use client"

import { useEffect, useState } from "react"
import { Users, MessageSquare, Settings, LogOut, DollarSign } from "lucide-react"
import AdminSidebar from "./Components/admin-sidebar"
import UserManagement from "./Components/user-management"
import ContactManagement from "./Components/contact-management"
import LinksManagement from "./Components/links-management"
import SubscriptionManagement from "./Components/SubscriptionManagement"
import PromoCodeManagement from "./Components/promo-management"
import ExpiredTrialsManagement from "./Components/expired-trials-management"
import { signOut } from "next-auth/react"
import axios from "axios"
import MagicalLoader from "../Components/MagicalLoader"
import Image from "next/image"


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users")
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await axios.get("/api/proxy/admin/appdata")
        setData(res.data)
      } catch (err) {
        if (err.response?.status === 401) {
          setUnauthorized(true)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  if (unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-slate-950 text-white">
        <Image
          src="/unauthorized.png"
          alt="Unauthorized "
          width={500}
          height={500}
          className="mb-6 opacity-80 rounded-lg"
        />
        <h1 className="text-3xl font-bold text-red-400 mb-2">
          Unauthorized Access
        </h1>
        <p className="text-gray-400 mb-6">
          You are not authorized to view this page.
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/", redirect: true, })}
          className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg transition"
        >
          Sign Out
        </button>
      </div>
    )
  }

  if (loading) {
    return <MagicalLoader />
  }

  return (
    <div>
      {data && (
        <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1 overflow-auto">
            {/* Header */}
            <div className="sticky top-0 z-40 border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-sm px-8 py-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  DGT Portfolio Admin
                </h1>
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-purple-500/20 rounded-lg transition">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button onClick={() => signOut()} className="p-2 hover:bg-purple-500/20 rounded-lg transition">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6 hover:border-purple-400/50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-400 text-sm mb-2">Total Users</p>
                          <p className="text-3xl font-bold">{data.users?.length}</p>
                        </div>
                        <Users className="w-8 h-8 text-cyan-400" />
                      </div>
                    </div>

                    <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6 hover:border-purple-400/50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-400 text-sm mb-2">Messages</p>
                          <p className="text-3xl font-bold">{data.contacts?.length}</p>
                        </div>
                        <MessageSquare className="w-8 h-8 text-pink-400" />
                      </div>
                    </div>

                    <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6 hover:border-purple-400/50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-400 text-sm mb-2">Subscriptions</p>
                          <p className="text-3xl font-bold">{data.subscription?.length || 0}</p>

                          {/* مثال لعدد الاشتراكات ACTIVE */}
                          <p className="text-sm text-green-400 mt-1">
                            Active: {data.subscription?.filter(sub => sub.status === "ACTIVE").length || 0}
                          </p>

                          {/* مثال لعدد كل خطة */}
                          <p className="text-sm text-cyan-400 mt-1">
                            Subscribe Monthly: {data.subscription?.filter(sub => sub.nameplan === "Monthly Plan").length || 0}
                          </p>
                          <p className="text-sm text-cyan-400 mt-1">
                            Subscribe 4 Months: {data.subscription?.filter(sub => sub.nameplan === "4-Month Plan").length || 0}
                          </p>
                          <p className="text-sm text-cyan-400 mt-1">
                            Subscribe Yearly: {data.subscription?.filter(sub => sub.nameplan === "Annual Plan").length || 0}
                          </p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "users" && <UserManagement data={data} setData={setData} />}
              {activeTab === "contacts" && <ContactManagement data={data} setData={setData} />}
              {activeTab === "links" && <LinksManagement links={data.links} />}
              {activeTab === "subscriptions" && <SubscriptionManagement data={data} setData={setData} />}
              {activeTab === "promo" && (<PromoCodeManagement data={data} setData={setData} />)}
              {activeTab === "expired" && <ExpiredTrialsManagement />}

            </div>
          </main>
        </div>
      )}
    </div>

  )
}
