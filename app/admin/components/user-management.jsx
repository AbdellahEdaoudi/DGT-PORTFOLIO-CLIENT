"use client"
import { useState } from "react"
import { createPortal } from "react-dom"
import { Search, AlertCircle, Loader, X, ExternalLink } from "../../components/Icons"
import { useToast } from "../../components/Toast"
import axios from "axios"
import Image from "next/image"
import ThemeOne from "../../components/themes/themeone"
import ThemeTwo from "../../components/themes/themetwo"
import ThemeThree from "../../components/themes/themethree"
import ThemeFour from "../../components/themes/themefour"
import ThemeFive from "../../components/themes/themefive"
import ThemeSix from "../../components/themes/themesix"
import ThemeSeven from "../../components/themes/themeseven"
import ThemeEight from "../../components/themes/themeeight"
import ThemeNine from "../../components/themes/themenine"
import ThemeTen from "../../components/themes/themeten"
import ThemeEleven from "../../components/themes/themeeleven"

export default function UserManagement({ data, setData }) {
  const toast = useToast()
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleteConfirm2, setDeleteConfirm2] = useState(null)
  const [selectedUserLinks, setSelectedUserLinks] = useState(null)
  const [selectedPreviewUser, setSelectedPreviewUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loadingDeleteId, setLoadingDeleteId] = useState(null)
  const [loadingDeleteId2, setLoadingDeleteId2] = useState(null)

  // Helper: render theme preview
  const renderThemePreview = (user) => {
    const themeId = user.theme || 1;
    // Prepare mock data from user object to pass to themes if needed, 
    // assuming themes take 'userDetails' or similar prop.
    // If themes fetch their own data, you might need to wrap them in a context or pass data explicitly.
    // Based on previous contexts, themes likely use 'userDetails' from a context or prop.
    // Here we will pass 'data' prop to the theme if it accepts it.

    // Construct a userDetails object similar to what the themes expect
    const userDetails = {
      ...user,
      // Add other necessary fields if missing from 'user' object but required by themes
    };

    switch (Number(themeId)) {
      case 1: return <ThemeOne userDetails={userDetails} />;
      case 2: return <ThemeTwo userDetails={userDetails} />;
      case 3: return <ThemeThree userDetails={userDetails} />;
      case 4: return <ThemeFour userDetails={userDetails} />;
      case 5: return <ThemeFive userDetails={userDetails} />;
      case 6: return <ThemeSix userDetails={userDetails} />;
      case 7: return <ThemeSeven userDetails={userDetails} />;
      case 8: return <ThemeEight userDetails={userDetails} />;
      case 9: return <ThemeNine userDetails={userDetails} />;
      case 10: return <ThemeTen userDetails={userDetails} />;
      case 11: return <ThemeEleven userDetails={userDetails} />;
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
      await axios.delete(`/api/proxy/admin/user/${id}`)
      setData((usr) => ({
        ...usr,
        users: usr.users.filter((u) => u._id !== id),
      }))
    } catch (err) {
      toast.error("Error deleting user")
      console.error(err)
    } finally {
      setLoadingDeleteId(null)
    }
  }
  // Delete link
  const deleteLink = async (id) => {
    try {
      setLoadingDeleteId2(id)
      const res = await axios.delete(`/api/proxy/admin/link/${id}`)
      setSelectedUserLinks((prev) => prev.filter((l) => l._id !== id))
      setData((prev) => ({
        ...prev,
        links: prev.links.filter((l) => l._id !== id),
      }))
      toast.info(res.data?.message || "No link deleted")
    } catch (err) {
      toast.error("Error deleting link")
      console.error(err)
    } finally {
      setLoadingDeleteId2(null)
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Country</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Links</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.filter(
                    (u) =>
                      u.fullname?.toLowerCase().includes(searchQuery) ||
                      u.email?.toLowerCase().includes(searchQuery) ||
                      u.category?.toLowerCase().includes(searchQuery) ||
                      u.country?.toLowerCase().includes(searchQuery) ||
                      u.username?.toLowerCase().includes(searchQuery)
                  ).map((user) => {
                    const linksCount = data.links.filter((lnk) => lnk.useremail === user.email).length
                    const linksuser = data.links.filter((lnk) => lnk.useremail === user.email)
                    const PORTFOLIO = `https://${user?.username}.dgtportfolio.com`
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
                        <td className="px-4 py-2 text-gray-400 text-xs">{user.country}</td>
                        <td className="px-4 py-2 text-cyan-400 text-xs">{highlightText(user.category, searchQuery)}</td>
                        <td className="px-4 py-2 text-gray-400 text-xs">
                          <div>{new Date(user.createdAt).toLocaleDateString('en-GB')}</div>
                          <div className="text-[10px] text-gray-500">{new Date(user.createdAt).toLocaleTimeString()}</div>
                        </td>
                        <td onClick={() => setSelectedUserLinks(linksuser)} className="px-4 py-2 text-gray-400 cursor-pointer text-xs">
                          <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/50 rounded-full text-xs text-cyan-400 font-semibold">
                            {linksCount}
                          </span>
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


          {selectedUserLinks && createPortal(
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-2xl max-w-2xl w-full p-4 md:p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-full pr-8">
                    <p className="text-lg font-bold text-white mb-1 truncate">
                      {data.users.find((user) => user.email === selectedUserLinks[0]?.useremail)?.fullname || "User Links"}
                    </p>
                    <p className="text-sm text-gray-400 break-all">{selectedUserLinks[0]?.useremail}</p>
                  </div>
                  <button onClick={() => setSelectedUserLinks(null)} className="p-2 hover:bg-purple-500/20 rounded transition -mr-2 -mt-2">
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedUserLinks.length > 0 ? (
                    selectedUserLinks.map((link) => (
                      <div
                        key={link._id}
                        className="p-3 sm:p-4 bg-slate-700/50 border border-purple-500/20 rounded-lg flex items-center justify-between gap-3 hover:bg-slate-700/70 transition"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm sm:text-base truncate">{link.namelink}</h3>
                          <a
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm truncate block"
                          >
                            {link.link}
                          </a>
                          <p className="text-gray-500 text-[10px] sm:text-xs mt-1">
                            {new Date(link.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => window.open(link.link, "_blank")}
                            className="p-1.5 sm:p-2 hover:bg-purple-500/20 rounded transition bg-slate-800/50"
                          >
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm2(link._id)}
                            className="px-2 py-1 sm:px-3 sm:py-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 hover:bg-red-500/30 transition text-xs sm:text-sm font-semibold flex items-center justify-center min-w-[60px] sm:min-w-[80px]"
                          >
                            {loadingDeleteId2 === link._id ? <Loader size={14} className="animate-spin" /> : "Delete"}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No links found for this user</p>
                    </div>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}

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

          {deleteConfirm2 && createPortal(
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-red-500/30 rounded-2xl max-w-md w-full p-8 shadow-2xl">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 mx-auto mb-6">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white text-center mb-2">Delete Link</h2>
                <p className="text-gray-400 text-center mb-6">
                  Are you sure you want to delete this link
                  ? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm2(null)}
                    className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white hover:bg-slate-700 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      deleteLink(deleteConfirm2)
                      setDeleteConfirm2(null)
                    }}
                    className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition font-semibold"
                  >
                    {loadingDeleteId2 === deleteConfirm2 ? <Loader size={18} className="animate-spin" /> : "Delete"}
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
          {/* Close Button Fixed outside or absolute top-right */}
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
                  ["ThemeOne", "ThemeTwo", "ThemeThree", "ThemeFour",
                    "ThemeFive", "ThemeSix", "ThemeSeven", "ThemeEight",
                    "ThemeNine", "ThemeTen", "ThemeEleven"][Number(selectedPreviewUser.theme || 1) - 1] || "ThemeOne"
                } for {selectedPreviewUser.fullname}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto bg-black relative">
              {/* 
                   We need to ensure the theme components can render correctly with just the data prop.
                   If they rely on specific contexts (MyContext), this might crash or display empty.
                   Ideally, we wrap this in a Context Provider if needed, but for now passing 'data' prop.
                 */}
              {renderThemePreview(selectedPreviewUser)}
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>

  )
}
