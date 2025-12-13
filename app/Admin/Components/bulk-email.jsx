"use client"
import { useState } from "react"
import { Mail, Send, CheckCircle, AlertCircle, Copy, Users } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function BulkEmail({ data }) {
    const [recipients, setRecipients] = useState("")
    const [subject, setSubject] = useState("")
    const [content, setContent] = useState("")
    const [sending, setSending] = useState(false)
    const [previewMode, setPreviewMode] = useState(false)

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [progress, setProgress] = useState({ sent: 0, total: 0 })

    // Parse emails from textarea
    const getEmailList = () => {
        return recipients
            .split(/[\n,]+/) // Split by newline or comma
            .map(email => email.trim())
            .filter(email => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) // Basic validation
    }

    const handleSendClick = () => {
        const emailList = getEmailList()

        if (emailList.length === 0) {
            toast.error("Please enter at least one valid recipient email.")
            return
        }

        if (!content.trim()) {
            toast.error("Please enter email content.")
            return
        }
        setShowConfirmModal(true)
    }

    const processSend = async () => {
        setShowConfirmModal(false)
        const emailList = getEmailList()
        const total = emailList.length

        setSending(true)
        setProgress({ sent: 0, total: total })

        const CHUNK_SIZE = 50
        let successfulCount = 0

        try {
            // Split emails into chunks
            for (let i = 0; i < emailList.length; i += CHUNK_SIZE) {
                const chunk = emailList.slice(i, i + CHUNK_SIZE)

                try {
                    // Check connection
                    if (!navigator.onLine) {
                        throw new Error("No internet connection detected.")
                    }

                    // Send chunk (batch of 50)
                    const response = await axios.post("/api/proxy/admin/send-bulk-emails", {
                        emails: chunk,
                        subject,
                        content
                    })

                    // Update count based on backend response or chunk size
                    const batchSent = response.data.sentCount || chunk.length
                    successfulCount += batchSent
                    setProgress({ sent: successfulCount, total: total })

                    // Delay between batches (e.g., 2 seconds) to respect server limits
                    if (i + CHUNK_SIZE < emailList.length) {
                        await new Promise(resolve => setTimeout(resolve, 2000))
                    }

                } catch (innerError) {
                    console.error(`Failed to send batch starting at ${i}:`, innerError)
                    // We continue to next batch or stop? 
                    // Usually safer to stop if it's a major error, but let's notify user
                    toast.error(`Batch failed: ${innerError.message}`)
                    // Ideally we might want to break, but let's try next batch?
                    // Let's throw to stop everything if it's critical
                    throw innerError
                }
            }

            toast.success(`Broadcasting complete! Sent approximately ${successfulCount} emails.`)
            setRecipients("")
            setSubject("")
            setContent("")
            setProgress({ sent: 0, total: 0 })

        } catch (error) {
            console.error(error)
            toast.error(`Process stopped. Sent ${successfulCount} out of ${total}. Error: ${error.message}`)
        } finally {
            setSending(false)
        }
    }

    const addAllUsers = () => {
        if (!data?.users) return;
        const allEmails = data.users.map(u => u.email).join(", \n");
        setRecipients(allEmails);
        toast.info("Added all users to recipient list");
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

            {/* Modal Overlay */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-purple-500/20 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-3 bg-amber-500/10 rounded-full">
                                <AlertCircle className="w-8 h-8 text-amber-500" />
                            </div>

                            <h3 className="text-xl font-bold text-white">Confirm Action</h3>

                            <p className="text-gray-400">
                                You are about to send this email to <span className="text-white font-bold">{getEmailList().length}</span> recipients.
                                <br />
                                This action cannot be undone. Are you sure?
                            </p>

                            <div className="flex gap-3 w-full mt-4">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={processSend}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg transition"
                                >
                                    Yes, Send It
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-lg">
                        <Mail className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Bulk User Messaging</h2>
                        <p className="text-gray-400">Send updates, announcements, or specialized offers to multiple users at once.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Input Forms */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recipients Section */}
                    <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Users className="w-4 h-4 text-purple-400" />
                                Recipients (Emails)
                            </label>
                            <button
                                onClick={addAllUsers}
                                className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-1.5 rounded-lg transition border border-purple-500/30"
                            >
                                + Add All Users
                            </button>
                        </div>
                        <textarea
                            value={recipients}
                            onChange={(e) => setRecipients(e.target.value)}
                            placeholder="Enter emails here, separated by commas or new lines...&#10;user1@example.com&#10;user2@example.com"
                            className="w-full h-32 bg-slate-950/50 border border-purple-500/20 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none font-mono text-sm"
                        />
                        <div className="mt-2 text-xs text-gray-500 flex justify-between">
                            <span>Separate emails with new lines or commas.</span>
                            <span className={getEmailList().length > 0 ? "text-green-400" : ""}>
                                Valid Recipients: {getEmailList().length}
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-300 mb-2 block">Subject Line</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g., Important Update Regarding Your Portfolio"
                                className="w-full bg-slate-950/50 border border-purple-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-300">Email Content (HTML supported)</label>
                                <button
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                                >
                                    {previewMode ? "Edit Raw HTML" : "Preview"}
                                </button>
                            </div>

                            {previewMode ? (
                                <div className="w-full min-h-[300px] bg-white text-black p-6 rounded-lg overflow-auto border border-gray-700">
                                    <div dangerouslySetInnerHTML={{ __html: content || "<p style='color: gray; text-align: center'>No content to preview</p>" }} />
                                </div>
                            ) : (
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="<p>Hello,</p><br/><p>Write your message here. Basic HTML tags like <b>bold</b>, <i>italic</i>, and <a href='#'>links</a> are supported.</p>"
                                    className="w-full h-[300px] bg-slate-950/50 border border-purple-500/20 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-y font-mono text-sm"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions & Tips */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 sticky top-24">
                        <h3 className="text-lg font-bold text-white mb-4">Actions</h3>

                        <div className="space-y-3">
                            <button
                                onClick={handleSendClick}
                                disabled={sending || getEmailList().length === 0}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending... {progress.sent}/{progress.total}
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Send Broadcast
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-8 border-t border-purple-500/20 pt-6">
                            <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-400" />
                                Tips
                            </h4>
                            <ul className="text-xs text-gray-400 space-y-2 list-disc list-inside">
                                <li>All emails are sent via the standard generic template with Header and Footer.</li>
                                <li>Double-check your HTML syntax to ensure the email looks good.</li>
                                <li>Use the "Preview" button to see how your HTML renders (partially).</li>
                                <li>Sending to many users might take a few moments.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
