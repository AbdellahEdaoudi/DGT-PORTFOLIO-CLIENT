"use client"
import { LayoutDashboard, Users, MessageSquare, Settings, Link2, DollarSign, TagIcon, Clock } from "lucide-react"

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "expired", label: "Expired Trials", icon: Clock },
    { id: "contacts", label: "Messages", icon: MessageSquare },
    { id: "links", label: "Links", icon: Link2 },
    { id: "subscriptions", label: "Subscriptions", icon: DollarSign },
    { id: "promo", label: "Promo Codes", icon: TagIcon },
  ]

  return (
    <div className="w-64 bg-slate-900/80 border-r border-purple-500/20 backdrop-blur-sm flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-purple-500/20">
        <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          DGT-P Admin
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === item.id
                  ? "bg-purple-500/30 text-cyan-400 border border-purple-500/50"
                  : "text-gray-400 hover:text-white hover:bg-purple-500/10"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-purple-500/20 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-purple-500/10 rounded-lg transition">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  )
}
