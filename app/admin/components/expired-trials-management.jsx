"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Search, Mail, CheckCircle, RefreshCcw, XCircle } from "../../components/Icons"
import axios from "axios"
import { toast } from "react-toastify"
import Image from "next/image"

export default function ExpiredTrialsManagement({ data }) {
    const [users, setUsers] = useState([])
    const [sending, setSending] = useState(false)
    const [filter, setFilter] = useState("")
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    useEffect(() => {
        if (data?.users && data?.subscription) {
            try {
                const twentyFourHoursAgo = new Date();
                twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

                const whitelist = [
                    "adam.carter.dev@gmail.com",
                    "soondiss8@gmail.com",
                    "dgt.portfolio.ma@gmail.com",
                    "edaoudicontact@gmail.com"
                ];

                const expiredUsers = data.users.filter(user => {
                    // 1. Whitelist check
                    if (whitelist.includes(user.email)) return false;

                    // 2. Created > 24 hours ago check
                    const createdAt = new Date(user.createdAt);
                    if (createdAt >= twentyFourHoursAgo) return false;

                    // 3. Active Subscription Check
                    // Check if user has an ACTIVE subscription in data.subscription
                    const hasActiveSub = data.subscription.some(sub =>
                        sub.userEmail === user.email && sub.status === 'ACTIVE'
                    );

                    return !hasActiveSub;
                });

                setUsers(expiredUsers)
            } catch (error) {
                console.error("Error processing expired users:", error)
                toast.error("Failed to process expired users.")
            }
        }
    }, [data])

    const handleSendBulkEmail = () => {
        if (!users.length) {
            toast.info("No users to send emails to.")
            return
        }
        setShowConfirmModal(true)
    }

    const confirmSendEmails = async () => {
        setShowConfirmModal(false)
        setSending(true)
        try {
            const validUsers = users.map(u => ({ email: u.email, username: u.username, fullname: u.fullname }));
            const res = await axios.post("/api/proxy/admin/send-expired-emails", { users: validUsers })

            toast.success(res.data.message || "Emails sent successfully!")
            fetchExpiredUsers(); // Refresh list
        } catch (error) {
            console.error("Error sending emails:", error)
            toast.error("Failed to send emails. Please try again.")
        } finally {
            setSending(false)
        }
    }

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(filter.toLowerCase()) ||
        u.fullname?.toLowerCase().includes(filter.toLowerCase()) ||
        u.username?.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <div className="space-y-3 md:space-y-6 animate-in fade-in duration-500">
            {/* Compact Header & Controls */}
            <div className="flex flex-col gap-2 md:gap-4_">
                <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-orange-500/10">
                    <div className="flex flex-col">
                        <h2 className="text-sm md:text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent leading-tight">
                            Expired Users
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">Total: <span className="text-white font-medium">{users.length}</span></span>
                            <span className="w-px h-3 bg-gray-700"></span>
                            <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">Shown: <span className="text-orange-400 font-medium">{filteredUsers.length}</span></span>
                        </div>
                    </div>

                    <button
                        onClick={handleSendBulkEmail}
                        disabled={sending || users.length === 0}
                        className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-orange-600/10 to-red-600/10 hover:from-orange-600/20 hover:to-red-600/20 border border-orange-500/20 text-orange-400 hover:text-orange-300 px-3 py-1.5 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium"
                    >
                        {sending ? <CheckCircle className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">Send Emails</span>
                        <span className="sm:hidden">Send</span>
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5 md:w-4 md:h-4" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full bg-slate-900/30 border border-gray-800 rounded-lg pl-8 pr-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-orange-500/50 transition placeholder-gray-600"
                    />
                </div>
            </div>

            {/* Compact Table */}
            <div className="bg-slate-900/40 border border-gray-800/50 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto scroller-smooth">
                    <table className="w-full">
                        <thead className="bg-slate-950/30 text-[9px] md:text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-3 py-2 text-left font-semibold text-gray-500 w-full sm:w-auto">User</th>
                                <th className="hidden sm:table-cell px-3 py-2 text-left font-semibold text-gray-500">Details</th>
                                <th className="px-3 py-2 text-right font-semibold text-gray-500 whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/40">
                            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <tr key={user._id || user.email} className="group hover:bg-slate-800/30 transition">
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-800 flex items-center justify-center text-orange-400 font-bold overflow-hidden border border-gray-700/50 text-[9px]">
                                                {user.urlimage ? (
                                                    <Image
                                                        src={user.urlimage}
                                                        alt="av"
                                                        width={32}
                                                        height={32}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    user.fullname?.[0]?.toUpperCase() || "?"
                                                )}
                                            </div>
                                            <div className="min-w-0 max-w-[140px] sm:max-w-xs">
                                                <div className="font-medium text-white text-[11px] md:text-sm truncate leading-tight group-hover:text-orange-200 transition-colors">
                                                    {user.fullname || "Unknown User"}
                                                </div>
                                                <div className="text-[10px] md:text-xs text-gray-500 truncate leading-tight">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden sm:table-cell px-3 py-2">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] text-gray-400">@{user.username || "-"}</span>
                                            <span className="text-[10px] text-gray-600">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                        <span className="inline-block text-[9px] md:text-[10px] font-medium text-red-400/90 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/10 whitespace-nowrap">
                                            Expired
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="px-4 py-8 text-center text-gray-500 text-xs">
                                        <div className="flex flex-col items-center gap-1 opacity-50">
                                            <Search className="w-5 h-5" />
                                            <p>No results found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && createPortal(
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-gray-700 rounded-xl shadow-2xl p-4 md:p-6 max-w-[320px] md:max-w-sm w-full animate-in zoom-in-95 fade-in-0 duration-300">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-base md:text-lg font-bold text-white leading-none">Confirm Send</h3>
                                <p className="text-[10px] text-gray-400 mt-1">Bulk email action</p>
                            </div>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="text-gray-500 hover:text-gray-300 p-1 bg-slate-800 rounded-md"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="bg-slate-950/50 rounded-lg p-3 border border-orange-500/10 mb-4">
                            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                                Send emails to <span className="font-bold text-orange-400">{users.length}</span> expired trial users?<br />
                                <span className="text-[10px] text-gray-500 block mt-1">This action cannot be undone.</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-3 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700 transition text-xs font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSendEmails}
                                className="px-3 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-500 hover:to-red-500 transition text-xs font-bold shadow-lg shadow-orange-900/20"
                                disabled={sending}
                            >
                                {sending ? "Sending..." : "Yes, Send"}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
