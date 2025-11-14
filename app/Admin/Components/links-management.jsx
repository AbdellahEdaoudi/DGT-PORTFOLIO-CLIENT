"use client"

import { useState } from "react"
import { Search, ExternalLink, X, AlertCircle, Loader } from "lucide-react"
import { toast } from "react-toastify"
import axios from "axios"

export default function LinksManagement({ links }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLink, setSelectedLink] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [linksData, setLinksData] = useState(links)
  const [loadingDelete, setLoadingDelete] = useState(null)

  const filteredLinks = linksData.filter(
    (link) =>
      link.useremail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.namelink.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const deleteLink = async (linkId) => {
    try {
      setLoadingDelete(linkId)
      setDeleteConfirm(null)
      await axios.delete(`/api/proxy/admin/link/${linkId}`)
      setLinksData(linksData.filter((l) => l._id !== linkId))
      toast.success("Link deleted successfully")
    } catch (err) {
      console.error(err)
      toast.error("Error deleting link")
    } finally {
      setLoadingDelete(null)
      setDeleteConfirm(null)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Links Management ({links.length})</h1>

      <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-purple-500/20 flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-500/20">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Titel</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Link</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map((link) => (
                <tr key={link._id} className="border-b border-purple-500/10 hover:bg-purple-500/10 transition">
                  <td className="px-6 py-4 text-white font-medium">{link.namelink}</td>
                  <td className="px-6 py-4 text-gray-400">{link.useremail}</td>
                  <td className="px-6 py-4 text-gray-400">
                    <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/50 p-2 rounded-lg bg-cyan-300  truncate break-all"
                      >
                        Open
                      </a>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setDeleteConfirm(link._id)}
                      className="px-3 py-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 hover:bg-red-500/30 transition text-sm font-semibold"
                    >
                      {loadingDelete === link._id ? <Loader size={16} className="animate-spin" /> : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal تأكيد الحذف */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-red-500/30 rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 mx-auto mb-6">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Delete Link</h2>
            <p className="text-gray-400 text-center mb-6">
              Are you sure you want to delete this link?
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
                onClick={() => deleteLink(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
