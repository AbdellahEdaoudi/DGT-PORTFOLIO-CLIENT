"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { Search, AlertCircle, Loader, RefreshCw } from "../../components/Icons"
import { useToast } from "../../components/Toast"
import axios from "axios"

export default function SubscriptionManagement({ data, setData }) {
  const toast = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [loadingDeleteId, setLoadingDeleteId] = useState(null)
  const [loadingSyncId, setLoadingSyncId] = useState(null)
  console.log(data.subscription)
  const highlightText = (text, query) => {
    if (!text) return ""
    if (!query) return text
    const regex = new RegExp(`(${query})`, "gi")
    const parts = text.split(regex)
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-300 text-black font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  const syncSubscription = async (id) => {
    try {
      setLoadingSyncId(id)
      const res = await axios.post(`/api/proxy/admin/subscription/${id}`)
      
      if (res.data.success) {
        setData((prev) => ({
          ...prev,
          subscription: prev.subscription.map((sub) => 
            sub._id === id ? res.data.data : sub
          ),
        }))
        toast.success(res.data.message || "Subscription synced with PayPal")
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Error syncing subscription")
    } finally {
      setLoadingSyncId(null)
    }
  }

  const deleteSubscription = async (id) => {
    try {
      setLoadingDeleteId(id)
      const res = await axios.delete(`/api/proxy/admin/subscription/${id}`)

      setData((prev) => ({
        ...prev,
        subscription: prev.subscription.filter((sub) => sub._id !== id),
      }))

      toast.info(res.data?.message || "Subscription deleted")
    } catch (err) {
      console.error(err)
      toast.error("Error deleting subscription")
    } finally {
      setLoadingDeleteId(null)
    }
  }

  const filteredSubscriptions = data.subscription?.filter((s) =>
    s.userEmail?.toLowerCase().includes(searchQuery) ||
    s.nameplan?.toLowerCase().includes(searchQuery) ||
    s.status?.toLowerCase().includes(searchQuery)
  )

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-2 md:gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h1 className="text-sm md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            Subscriptions Management
          </h1>
          <div className="text-[10px] md:text-xs text-gray-500 font-medium">
            Total: <span className="text-white">{filteredSubscriptions?.length || 0}</span>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl overflow-hidden p-2 md:p-3">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
            <div className="w-full relative">
              <Search className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                type="text"
                placeholder="Search by email..."
                className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg pl-9 pr-3 py-2 md:py-1.5 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none transition text-xs md:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/30 border border-purple-500/10 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto scroller-smooth">
          <table className="w-full">
            <thead className="bg-slate-950/30 border-b border-purple-500/20">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] md:text-xs font-semibold text-gray-300 w-full md:w-auto">User / Plan</th>
                <th className="hidden md:table-cell px-3 py-2 text-left text-[10px] md:text-xs font-semibold text-gray-300">Status</th>
                <th className="hidden lg:table-cell px-3 py-2 text-left text-[10px] md:text-xs font-semibold text-gray-300">Expires</th>
                <th className="hidden sm:table-cell px-3 py-2 text-left text-[10px] md:text-xs font-semibold text-gray-300">Date</th>
                <th className="px-3 py-2 text-right text-[10px] md:text-xs font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-purple-500/5">
              {filteredSubscriptions?.map((sub) => (
                <tr
                  key={sub._id}
                  className="hover:bg-purple-500/5 transition group"
                >
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white font-medium text-[11px] md:text-sm truncate max-w-[180px] sm:max-w-xs">
                        {highlightText(sub.userEmail, searchQuery)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 text-[10px] md:text-xs font-medium">
                          {highlightText(sub.nameplan, searchQuery)}
                        </span>
                        <span className="md:hidden text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-gray-400 border border-slate-700">
                          {sub.status}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="hidden md:table-cell px-3 py-2">
                    <span
                      className={`text-[10px] md:text-xs font-semibold ${sub.status === "ACTIVE"
                        ? "text-green-400"
                        : sub.status === "CANCELLED"
                          ? "text-red-400"
                          : "text-yellow-400"
                        }`}
                    >
                      {highlightText(sub.status, searchQuery)}
                    </span>
                  </td>

                  <td className="hidden lg:table-cell px-3 py-2 text-gray-400 text-[10px] md:text-xs">
                    {sub.expiresAt
                      ? new Date(sub.expiresAt).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="hidden sm:table-cell px-3 py-2 text-gray-500 text-[10px] md:text-xs whitespace-nowrap">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => syncSubscription(sub._id)}
                        disabled={loadingSyncId === sub._id}
                        title="Sync with PayPal"
                        className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-all disabled:opacity-50"
                      >
                        <RefreshCw size={14} className={loadingSyncId === sub._id ? "animate-spin" : ""} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(sub)}
                        disabled={loadingDeleteId === sub._id}
                        className="inline-flex items-center justify-center px-2 py-1 bg-red-500/10 border border-red-500/20 rounded md:rounded-lg text-red-400 hover:bg-red-500/20 transition text-[9px] md:text-xs font-semibold"
                      >
                        {loadingDeleteId === sub._id ? (
                          <Loader size={12} className="animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSubscriptions?.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 text-xs py-8">
                    No subscriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirm && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-slate-900 border border-red-500/20 rounded-xl max-w-xs sm:max-w-sm w-full p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight">Delete Subscription</h3>
                  <p className="text-[10px] sm:text-xs text-gray-400">Confirm deletion</p>
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              Are you sure you want to delete this subscription? This action cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition text-xs sm:text-sm font-medium"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteSubscription(deleteConfirm._id)
                  setDeleteConfirm(null)
                }}
                className="flex-1 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition text-xs sm:text-sm font-bold shadow-lg shadow-red-900/10"
              >
                {loadingDeleteId === deleteConfirm._id ? (
                  <Loader size={14} className="animate-spin mx-auto" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
