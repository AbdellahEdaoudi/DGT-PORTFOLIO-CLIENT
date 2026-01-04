"use client"
import { LayoutDashboard, Users, MessageSquare, Settings, DollarSign, TagIcon, Clock, Mail, ImagePlus } from "../../Components/Icons"
import Link from "next/link"

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "expired", label: "Expired Trials", icon: Clock },
    { id: "contacts", label: "Messages", icon: MessageSquare },
    { id: "subscriptions", label: "Subscriptions", icon: DollarSign },
    { id: "promo", label: "Promo Codes", icon: TagIcon },
    { id: "bulk-email", label: "Bulk Email", icon: Mail },
    { id: "cloudinary", label: "Cloudinary", icon: ImagePlus },
  ]

  return (
    <div className="w-56 h-full bg-slate-900/80 border-r border-purple-500/20 backdrop-blur-sm flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-purple-500/20">
        <Link href={"/"} className="text-lg cursor-pointer font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          DGT-P Admin
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${activeTab === item.id
                ? "bg-purple-500/30 text-cyan-400 border border-purple-500/50"
                : "text-gray-400 hover:text-white hover:bg-purple-500/10"
                }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Settings */}
      <div className="p-2 border-t border-purple-500/20 space-y-1">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-purple-500/10 rounded-lg transition text-sm">
          <Settings className="w-4 h-4" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  )
}
