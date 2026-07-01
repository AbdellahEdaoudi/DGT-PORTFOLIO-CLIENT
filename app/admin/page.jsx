"use client"

import { useEffect, useState } from "react"
import { Users, MessageSquare, Settings, LogOut, DollarSign } from "../components/Icons"
import AdminSidebar from "./components/admin-sidebar"
import UserManagement from "./components/user-management"
import ContactManagement from "./components/contact-management"
import PaymentManagement from "./components/paymentManagement"
import BulkEmail from "./components/bulk-email"
import CloudinaryGallery from "./components/cloudinary-gallery"
import { signOut } from "next-auth/react"
import axios from "axios"
import MagicalLoader from "../components/MagicalLoader"
import Image from "next/image"
import Link from "next/link"


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users")
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

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
        <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">

          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar - mapped to hidden on mobile usually, but we control via classes */}
          <div className={`
            fixed md:relative z-50 h-full transition-transform duration-300 transform
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}>
            <AdminSidebar activeTab={activeTab} setActiveTab={(tab) => {
              setActiveTab(tab);
              setIsSidebarOpen(false); // Close on selection on mobile
            }} />
          </div>

          <main className="flex-1 overflow-auto w-full">
            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-sm px-4 md:px-6 py-4">
              <div className="flex justify-between items-center gap-4">

                <div className="flex items-center gap-3">
                  {/* Hamburger Menu */}
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden p-1.5 hover:bg-purple-500/20 rounded-lg transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                  </button>

                  <Link href={"/"} className="text-lg cursor-pointer md:text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
                    DGT PORTFOLIO
                  </Link>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <button className="p-1.5 hover:bg-purple-500/20 rounded-lg transition">
                    <Settings className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button onClick={() => signOut()} className="p-1.5 hover:bg-purple-500/20 rounded-lg transition">
                    <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-4 hover:border-purple-400/50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Total Users</p>
                          <p className="text-2xl font-bold">{data.users?.length}</p>
                        </div>
                        <Users className="w-6 h-6 text-cyan-400" />
                      </div>
                    </div>

                    <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-4 hover:border-purple-400/50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Messages</p>
                          <p className="text-2xl font-bold">{data.contacts?.length}</p>
                        </div>
                        <MessageSquare className="w-6 h-6 text-pink-400" />
                      </div>
                    </div>

                    <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-4 hover:border-purple-400/50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Payment</p>
                          <p className="text-2xl font-bold">{data.payment?.length || 0}</p>
                          <p className="text-xs text-green-400 mt-1">
                            Active: {data.payment?.filter(item => item.status === "ACTIVE").length || 0}
                          </p>
                        </div>
                        <DollarSign className="w-6 h-6 text-green-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "users" && <UserManagement data={data} setData={setData} />}
              {activeTab === "contacts" && <ContactManagement data={data} setData={setData} />}
              {activeTab === "payment" && <PaymentManagement data={data} setData={setData} />}
              {activeTab === "bulk-email" && <BulkEmail data={data} />}
              <div className={activeTab === "cloudinary" ? "block" : "hidden"}>
                <CloudinaryGallery />
              </div>

            </div>
          </main>
        </div>
      )}
    </div>

  )
}
