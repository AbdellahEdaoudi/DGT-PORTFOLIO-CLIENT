"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { Search, AlertCircle, Loader, Plus, X } from "../../components/Icons"
import { useToast } from "../../components/Toast"
import axios from "axios"

export default function PaymentManagement({ data, setData }) {
  const toast = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [loadingDeleteId, setLoadingDeleteId] = useState(null)
  const [loadingUpdateId, setLoadingUpdateId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addEmail, setAddEmail] = useState("")
  const [loadingAdd, setLoadingAdd] = useState(false)

  const filteredPayments = data.payment?.filter((item) =>
    item.useremail?.toLowerCase().includes(searchQuery) ||
    item.status?.toLowerCase().includes(searchQuery)
  )

  const deletePayment = async (id) => {
    try {
      setLoadingDeleteId(id)
      const res = await axios.delete(`/api/proxy/admin/payment/${id}`)
      setData((prev) => ({
        ...prev,
        payment: prev.payment.filter((item) => item._id !== id),
      }))
      toast.info(res.data?.message || "Payment deleted")
    } catch (err) {
      console.error(err)
      toast.error("Error deleting payment")
    } finally {
      setLoadingDeleteId(null)
    }
  }

  const updatePaymentStatus = async (id) => {
    try {
      setLoadingUpdateId(id)
      const res = await axios.put(`/api/proxy/admin/payment/${id}`)
      setData((prev) => ({
        ...prev,
        payment: prev.payment.map((item) =>
          item._id === id ? res.data.payment : item
        ),
      }))
      toast.success(res.data?.message || "Payment status updated")
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Error updating status")
    } finally {
      setLoadingUpdateId(null)
    }
  }

  const addPayment = async () => {
    if (!addEmail.trim()) return toast.error("Please enter a user email")
    try {
      setLoadingAdd(true)
      const res = await axios.post(`/api/proxy/admin/payment`, { useremail: addEmail.trim() })
      const newPayment = res.data.payment
      setData((prev) => {
        const exists = prev.payment?.find((item) => item._id === newPayment._id)
        return {
          ...prev,
          payment: exists
            ? prev.payment.map((item) => item._id === newPayment._id ? newPayment : item)
            : [...(prev.payment || []), newPayment],
        }
      })
      toast.success(res.data.message || "Payment created")
      setShowAddModal(false)
      setAddEmail("")
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Error creating payment")
    } finally {
      setLoadingAdd(false)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-2 md:gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h1 className="text-sm md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            Payment Management {data.payment?.length > 0 ? `kaynin` : `nookaynin`}
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-[10px] md:text-xs text-gray-500 font-medium">
              Total: <span className="text-white">{filteredPayments?.length || 0}</span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition text-xs font-semibold"
            >
              <Plus size={13} />
              Add Payment
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl overflow-hidden p-2 md:p-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              type="text"
              placeholder="Search by email or status..."
              className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg pl-9 pr-3 py-2 md:py-1.5 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none transition text-xs md:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/30 border border-purple-500/10 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-950/30 border-b border-purple-500/20">
              <tr>
                <th className="px-4 py-2.5 text-left text-[10px] md:text-xs font-semibold text-gray-300">Email</th>
                <th className="px-4 py-2.5 text-left text-[10px] md:text-xs font-semibold text-gray-300">Status</th>
                <th className="hidden md:table-cell px-4 py-2.5 text-left text-[10px] md:text-xs font-semibold text-gray-300">Amount</th>
                <th className="hidden lg:table-cell px-4 py-2.5 text-left text-[10px] md:text-xs font-semibold text-gray-300">PayPal Order ID</th>
                <th className="hidden lg:table-cell px-4 py-2.5 text-left text-[10px] md:text-xs font-semibold text-gray-300">PayPal Payer ID</th>
                <th className="hidden sm:table-cell px-4 py-2.5 text-left text-[10px] md:text-xs font-semibold text-gray-300">Date</th>
                <th className="px-4 py-2.5 text-right text-[10px] md:text-xs font-semibold text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/5">
              {filteredPayments?.map((item) => {
                const isManualGrant = item.paypalOrderId?.startsWith("ADMIN-GRANT-")
                return (
                  <tr key={item._id} className="hover:bg-purple-500/5 transition">
                    <td className="px-4 py-2.5 text-white text-[11px] md:text-sm truncate max-w-[180px] sm:max-w-xs">
                      {item.useremail.split('@')[0]}
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => updatePaymentStatus(item._id)}
                        disabled={loadingUpdateId === item._id}
                        title="Click to toggle status"
                        className={`text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer transition hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed ${
                          item.status === "ACTIVE"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {loadingUpdateId === item._id ? <Loader size={10} className="animate-spin inline" /> : item.status}
                      </button>
                    </td>
                    <td className="hidden md:table-cell px-4 py-2.5 text-[10px] md:text-xs whitespace-nowrap">
                      {isManualGrant ? (
                        <span className="text-amber-400 font-medium">Manual grant</span>
                      ) : (
                        <span className="text-gray-300">${item.amount?.toFixed(2) ?? "0.00"}</span>
                      )}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-2.5 text-gray-500 text-[10px] md:text-xs truncate max-w-[160px]" title={item.paypalOrderId}>
                      {isManualGrant ? (
                        <span className="text-gray-600 italic">———————————</span>
                      ) : (
                        item.paypalOrderId || "—"
                      )}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-2.5 text-gray-500 text-[10px] md:text-xs truncate max-w-[160px]" title={item.paypalOrderId}>
                      {isManualGrant ? (
                        <span className="text-gray-600 italic">———————————</span>
                      ) : (
                        item.paypalPayerId || "—"
                      )}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-2.5 text-gray-500 text-[10px] md:text-xs whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString("en-GB").split("/").join("/")} - {new Date(item.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => setDeleteConfirm(item)}
                        disabled={loadingDeleteId === item._id}
                        className="inline-flex items-center justify-center px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition text-[9px] md:text-xs font-semibold disabled:opacity-50"
                      >
                        {loadingDeleteId === item._id ? <Loader size={12} className="animate-spin" /> : "Delete"}
                      </button>
                    </td>
                  </tr>
                )
              })}

              {filteredPayments?.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 text-xs py-8">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-slate-900 border border-cyan-500/20 rounded-xl max-w-sm w-full p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white">Add Payment</h3>
              <button onClick={() => { setShowAddModal(false); setAddEmail("") }} className="p-1 hover:bg-slate-800 rounded transition">
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Enter the user email to manually grant Lifetime access (as if they paid).
            </p>
            <input
              type="email"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPayment()}
              placeholder="user@example.com"
              className="w-full bg-slate-800 border border-purple-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none transition text-sm mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowAddModal(false); setAddEmail("") }}
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={addPayment}
                disabled={loadingAdd || !addEmail.trim()}
                className="flex-1 px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {loadingAdd ? <Loader size={12} className="animate-spin" /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {deleteConfirm && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-slate-900 border border-red-500/20 rounded-xl max-w-xs sm:max-w-sm w-full p-5 sm:p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight">Delete Payment</h3>
                  <p className="text-[10px] sm:text-xs text-gray-400">Confirm deletion</p>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              Are you sure you want to delete the payment for <span className="text-white font-semibold">{deleteConfirm.useremail}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition text-xs sm:text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => { deletePayment(deleteConfirm._id); setDeleteConfirm(null) }}
                className="flex-1 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition text-xs sm:text-sm font-bold"
              >
                {loadingDeleteId === deleteConfirm._id ? <Loader size={14} className="animate-spin mx-auto" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
