"use client"

import { useState } from "react"
import { Search, AlertCircle, Loader } from "lucide-react"
import { toast } from "react-toastify"
import axios from "axios"

export default function SubscriptionManagement({ data, setData }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [loadingDeleteId, setLoadingDeleteId] = useState(null)

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
    <div className="space-y-6">
      <h1 className="text-xl font-bold">
        Subscriptions ({filteredSubscriptions?.length || 0})
      </h1>

      <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-purple-500/20 flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
            <input
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              type="text"
              placeholder="Search by email..."
              className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg pl-9 pr-3 py-1.5 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none transition text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-500/20">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">
                  Plan Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">
                  Payment Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">
                  Expires At
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredSubscriptions?.map((sub) => (
                <tr
                  key={sub._id}
                  className="border-b border-purple-500/10 hover:bg-purple-500/10 transition"
                >
                  <td className="px-4 py-2 text-gray-300 text-xs">
                    {highlightText(sub.userEmail, searchQuery)}
                  </td>

                  <td className="px-4 py-2 text-cyan-400 font-medium text-xs">
                    {highlightText(sub.nameplan, searchQuery)}
                  </td>

                  <td className="px-4 py-2 text-gray-300 text-xs">
                    {sub.paymentType === "subscription" ? "Subscription" : "One-Time"}
                  </td>

                  <td
                    className={`px-4 py-2 font-semibold text-xs ${sub.status === "ACTIVE"
                        ? "text-green-400"
                        : sub.status === "CANCELLED"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                  >
                    {highlightText(sub.status, searchQuery)}
                  </td>

                  <td className="px-4 py-2 text-gray-300 text-xs">
                    {sub.expiresAt
                      ? new Date(sub.expiresAt).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-4 py-2 text-gray-400 text-xs">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-2">
                    <button
                      onClick={() => setDeleteConfirm(sub)}
                      className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 hover:bg-red-500/30 transition text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      {loadingDeleteId === sub._id ? (
                        <Loader size={12} className="animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </td>
                </tr>
              ))}

              {filteredSubscriptions?.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-6">
                    No subscriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-red-500/30 rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 mx-auto mb-6">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Delete Subscription
            </h2>

            <p className="text-gray-400 text-center mb-6">
              Are you sure you want to delete this subscription?
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
                  deleteSubscription(deleteConfirm._id)
                  setDeleteConfirm(null)
                }}
                className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition font-semibold"
              >
                {loadingDeleteId === deleteConfirm._id ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
