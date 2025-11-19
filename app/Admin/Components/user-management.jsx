"use client"

import { useState } from "react"
import { Search, AlertCircle, Loader, X, ExternalLink } from "lucide-react"
import { toast } from "react-toastify"
import axios from "axios"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function UserManagement({data,setData}) {
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleteConfirm2, setDeleteConfirm2] = useState(null)
  const [selectedUserLinks, setSelectedUserLinks] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loadingDeleteId, setLoadingDeleteId] = useState(null)
  const [loadingDeleteId2, setLoadingDeleteId2] = useState(null)
  const router = useRouter()

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
      <h1 className="text-2xl font-bold">User Management ({data.users.length})</h1>

      <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-purple-500/20 flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
            <input
              onChange={SearchInput}
              type="text"
              placeholder="Search users..."
              className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-500/20">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Full Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Country</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Links</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
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
                const linksCount = data.links.filter((lnk)=>lnk.useremail === user.email).length
                const linksuser = data.links.filter((lnk)=>lnk.useremail === user.email)
                const PORTFOLIO = `https://${user?.username}.dgtportfolio.com`
                return (
                  <tr key={user._id} className="border-b border-purple-500/10 hover:bg-purple-500/10 transition">
                  <td onClick={() => window.open(PORTFOLIO, "_blank")} className="flex items-center gap-2 cursor-pointer px-6 py-4 text-white font-medium">
                    <Image src={user?.urlimage} width={40} height={40} className="rounded-lg" alt="Profile User" />
                    {highlightText(user.fullname, searchQuery)}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {highlightText(user.email, searchQuery)}<br />
                    <span className="text-xs text-gray-300">@{highlightText(user.username, searchQuery)}</span>

                  </td>
                  <td className="px-6 py-4 text-gray-400">{user.country}</td>
                  <td className="px-6 py-4 text-cyan-400 text-sm">{highlightText(user.category, searchQuery)}</td>
                  <td onClick={() => setSelectedUserLinks(linksuser)} className="px-6 py-4 text-gray-400 cursor-pointer">
                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm text-cyan-400 font-semibold">
                      {linksCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setDeleteConfirm(user)}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 hover:bg-red-500/30 transition text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      {loadingDeleteId === user._id ? <Loader size={18} className="animate-spin" /> : "Delete"}
                    </button>
                  </td>
                </tr>
                )
                 })}
            </tbody>
          </table>
        </div>
      </div>

    
      {selectedUserLinks && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className=" mt-1">{data.users.filter((user)=>user.email === selectedUserLinks[0]?.useremail)[0]?.fullname}</p>
                <p className=" mt-1">{selectedUserLinks[0]?.useremail}</p>
              </div>
              <button onClick={() => setSelectedUserLinks(null)} className="p-2 hover:bg-purple-500/20 rounded transition">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              {selectedUserLinks.length > 0 ? (
                selectedUserLinks.map((link) => (
                  <div
                    key={link._id}
                    className="p-4 bg-slate-700/50 border border-purple-500/20 rounded-lg flex justify-between items-center hover:bg-slate-700/70 transition"
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{link.namelink}</h3>
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 text-sm truncate break-all"
                      >
                        {link.link}
                      </a>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(link.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => window.open(link.link, "_blank")}
                        className="p-2 hover:bg-purple-500/20 rounded transition"
                      >
                        <ExternalLink className="w-4 h-4 text-cyan-400" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm2(link._id)}
                        className="px-3 py-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 hover:bg-red-500/30 transition text-sm font-semibold"
                      >
                        {loadingDeleteId2 === link._id ? <Loader size={18} className="animate-spin" /> : "Delete"}
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
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
        </div>
      )}

      {deleteConfirm2 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
        </div>
      )}
    </div>
      )}
    </div>
    
  )
}
