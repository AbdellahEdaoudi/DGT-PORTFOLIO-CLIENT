"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Search, Mail, CheckCircle, RefreshCcw, XCircle } from "../../Components/Icons"
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
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const whitelist = [
                "adam.carter.dev@gmail.com",
                "soondiss8@gmail.com",
                "dgt.portfolio.ma@gmail.com",
                "edaoudicontact@gmail.com"
            ];

            const expiredUsers = data.users.filter(user => {
                // 1. Whitelist check
                if (whitelist.includes(user.email)) return false;

                // 2. Created > 7 days ago check
                const createdAt = new Date(user.createdAt);
                if (createdAt >= sevenDaysAgo) return false;

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
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                        Expired Trial Users
                    </h2>
                    <p className="text-gray-400 text-xs mt-0.5">Users registered &gt; 7 days ago without active subscriptions.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSendBulkEmail}
                        disabled={sending || users.length === 0}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 text-sm"
                    >
                        {sending ? <CheckCircle className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                        {sending ? "Sending..." : "Send Bulk Email"}
                    </button>
                </div>
            </div>

            {/* Filter Stats */}
            <div className="bg-slate-800/30 border border-orange-500/20 rounded-xl p-4 flex gap-4">
                <div>
                    <span className="text-gray-400 text-xs uppercase tracking-wider">Total Expired</span>
                    <p className="text-2xl font-bold text-white">{users.length}</p>
                </div>
                <div className="border-l border-gray-700 mx-2"></div>
                <div>
                    <span className="text-gray-400 text-xs uppercase tracking-wider">Filtered</span>
                    <p className="text-2xl font-bold text-orange-400">{filteredUsers.length}</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-orange-500 transition" />
                <input
                    type="text"
                    placeholder="Search by name, username or email..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full bg-slate-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
                />
            </div>

            {/* Table */}
            <div className="bg-slate-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-950/50 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold text-gray-500">User</th>
                                <th className="px-6 py-4 text-left font-semibold text-gray-500">Username</th>
                                <th className="px-6 py-4 text-left font-semibold text-gray-500">Joined</th>
                                <th className="px-6 py-4 text-left font-semibold text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <tr key={user._id || user.email} className="hover:bg-slate-800/50 transition duration-150">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-orange-400 font-bold overflow-hidden border border-gray-700 text-xs">
                                                {user.urlimage ? (
                                                    <Image
                                                        src={user.urlimage}
                                                        alt={user.fullname || "User avatar"}
                                                        width={32} // Corresponds to w-8 (8 * 4px = 32px)
                                                        height={32} // Corresponds to h-8 (8 * 4px = 32px)
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    user.fullname?.[0]?.toUpperCase() || "?"
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white text-sm">{user.fullname || "N/A"}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400 text-sm">@{user.username || "-"}</td>
                                    <td className="px-4 py-3 text-gray-400 text-sm">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/20 text-red-400 border border-red-900/40">
                                            Trial Expired
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <CheckCircle className="w-8 h-8 text-gray-600" />
                                            <p>No expired trial users found.</p>
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
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[9999] p-4 ">
                    <div className="bg-slate-900 border border-gray-700 rounded-lg shadow-xl p-6 max-w-sm w-full animate-in zoom-in-95 fade-in-0 duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Confirm Email Send</h3>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="text-gray-400 hover:text-gray-200"
                                aria-label="Close"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to send emails to <span className="font-bold text-orange-400">{users.length}</span> expired trial users? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSendEmails}
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-md hover:from-orange-600 hover:to-red-700 transition"
                                disabled={sending}
                            >
                                {sending ? "Sending..." : "Confirm Send"}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
