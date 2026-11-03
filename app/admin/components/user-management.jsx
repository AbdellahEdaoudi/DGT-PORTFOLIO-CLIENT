"use client"
import { useState } from "react"
import { createPortal } from "react-dom"
import { Search, AlertCircle, Loader, X } from "../../components/lucide-react"
import { useToast } from "../../components/Toast"
import axios from "axios";
import { handleApiError } from "../../utils/apiErrorHandler";
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
import Image from "next/image"
import ThemeOne from "../../components/themes/theme1"
import Theme2 from "../../components/themes/theme2"
import Theme3 from "../../components/themes/theme3"
import Theme4 from "../../components/themes/theme4"
import Theme5 from "../../components/themes/theme5"
import Theme6 from "../../components/themes/theme6"
import Theme7 from "../../components/themes/theme7"
import Theme8 from "../../components/themes/theme8"
import Theme9 from "../../components/themes/theme9"
import Theme10 from "../../components/themes/theme10"
import Theme11 from "../../components/themes/theme11"

export default function UserManagement({ data, setData }) {
  const toast = useToast()
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [selectedPreviewUser, setSelectedPreviewUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loadingDeleteId, setLoadingDeleteId] = useState(null)

  // Helper: render theme preview
  const renderThemePreview = (user) => {
    const themeId = user.theme || 1;
    const userDetails = {
      ...user,
    };

    switch (Number(themeId)) {
      case 1: return <ThemeOne userDetails={userDetails} />;
      case 2: return <Theme2 userDetails={userDetails} />;
      case 3: return <Theme3 userDetails={userDetails} />;
      case 4: return <Theme4 userDetails={userDetails} />;
      case 5: return <Theme5 userDetails={userDetails} />;
      case 6: return <Theme6 userDetails={userDetails} />;
      case 7: return <Theme7 userDetails={userDetails} />;
      case 8: return <Theme8 userDetails={userDetails} />;
      case 9: return <Theme9 userDetails={userDetails} />;
      case 10: return <Theme10 userDetails={userDetails} />;
      case 11: return <Theme11 userDetails={userDetails} />;
      default: return <ThemeOne userDetails={userDetails} />;
    }
  }

  // Helper: highlight matched text
  const highlightText = (text, query) => {
    if (!text) return ""
    if (!query) return text
    const regex = new RegExp(`(${query})`, "gi")
    const parts = text.split(regex)
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-300 text-black font-semibold">{part}</span>
      ) : (
        part
      )
    )
  }

  // Delete user
  const deleteUser = async (id) => {
    try {
      setLoadingDeleteId(id)
      await axios.delete(`${SERVER_URL}/api/admin/user/${id}`, { withCredentials: true })
      setData((usr) => ({
        ...usr,
        users: usr.users.filter((u) => u._id !== id),
      }))
    } catch (err) {
      await handleApiError({ error: err, defaultErrorMsg: "Failed to delete user.", toast });
    } finally {
      setLoadingDeleteId(null)
    }
  }

  // Search users
  const SearchInput = (e) => {
    setSearchQuery(e.target.value.toLowerCase())
  }
  return (
    <div>
      {data.users && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">User Management ({data.users.length})</h1>

          <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl overflow-hidden">
            <div className="p-3 border-b border-purple-500/20 flex gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input
                  onChange={SearchInput}
                  type="text"
                  placeholder="Search users..."
                  className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg pl-9 pr-3 py-1.5 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none transition text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.filter(
                    (u) =>
                      u.fullname?.toLowerCase().includes(searchQuery) ||
                      u.email?.toLowerCase().includes(searchQuery) ||
                      u.category?.toLowerCase().includes(searchQuery) ||
                      u.location?.toLowerCase().includes(searchQuery) ||
                      u.username?.toLowerCase().includes(searchQuery)
                  ).map((user) => {
                    const PORTFOLIO = `https://${user?.username}.mylio.site`
                    return (
                      <tr key={user._id} className="border-b border-purple-500/10 hover:bg-purple-500/10 transition">
                        <td className="px-4 py-2 text-white font-medium">
                          <div className="flex items-center gap-2">
                            <div onClick={() => setSelectedPreviewUser(user)} className="cursor-pointer hover:opacity-80 transition shrink-0">
                              <Image src={user?.urlimage} width={32} height={32} className="rounded-lg object-cover" alt="Profile User" />
                            </div>
                            <span
                              onClick={() => window.open(PORTFOLIO, "_blank")}
                              className="text-sm cursor-pointer hover:text-cyan-400 transition"
                            >
                              {highlightText(user.fullname, searchQuery)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-gray-400 text-xs">
                          {highlightText(user.email, searchQuery)}<br />
                          <span className="text-[10px] text-gray-500">@{highlightText(user.username, searchQuery)}</span>

                        </td>
                        <td className="px-4 py-2 text-gray-400 text-xs">{user.location}</td>
                        <td className="px-4 py-2 text-cyan-400 text-xs">{highlightText(user.category, searchQuery)}</td>
                        <td className="px-4 py-2 text-gray-400 text-xs">
                          <div>{new Date(user.createdAt).toLocaleDateString('en-GB')}</div>
                          <div className="text-[10px] text-gray-500">{new Date(user.createdAt).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => setDeleteConfirm(user)}
                            className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 hover:bg-red-500/30 transition text-xs font-semibold flex items-center justify-center gap-2"
                          >
                            {loadingDeleteId === user._id ? <Loader size={12} className="animate-spin" /> : "Delete"}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {deleteConfirm && createPortal(
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-red-500/30 rounded-2xl max-w-md w-full p-8 shadow-2xl">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 mx-auto mb-6">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white text-center mb-2">Delete User</h2>
                <p className="text-gray-400 text-center mb-6">
                  Are you sure you want to delete <span className="font-semibold text-white">{deleteConfirm.fullname}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white hover:bg-slate-700 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      deleteUser(deleteConfirm._id)
                      setDeleteConfirm(null)
                    }}
                    className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition font-semibold flex items-center justify-center gap-2"
                  >
                    {loadingDeleteId === deleteConfirm._id ? <Loader size={18} className="animate-spin" /> : "Delete"}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
        </div>
      )}
      {/* Theme Preview Modal */}
      {selectedPreviewUser && createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedPreviewUser(null)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full z-[110] backdrop-blur transition-all hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full h-full max-w-[1400px] max-h-[90vh] bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 relative flex flex-col">
            <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center justify-center px-4 shrink-0">
              <span className="text-xs text-slate-400 font-mono">
                Previewing {
                  ["ThemeOne", "Theme2", "Theme3", "Theme4",
                    "Theme5", "Theme6", "Theme7", "Theme8",
                    "Theme9", "Theme10", "Theme11"][Number(selectedPreviewUser.theme || 1) - 1] || "ThemeOne"
                } for {selectedPreviewUser.fullname}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto bg-black relative">
              {renderThemePreview(selectedPreviewUser)}
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>

  )
}
