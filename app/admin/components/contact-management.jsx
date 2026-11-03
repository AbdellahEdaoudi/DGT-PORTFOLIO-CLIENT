"use client"

import { useState, useRef } from "react"
import { createPortal } from "react-dom"
import { Search, AlertCircle, Loader, Eye, X, Maximize2, Mail, Paperclip, ImageIcon, Edit2, Send, Trash2 } from "../../components/lucide-react"
import { useToast } from "../../components/Toast"
import axios from "axios";
import imageCompression from "browser-image-compression";
import { handleApiError } from "../../utils/apiErrorHandler";
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
import Image from "next/image"

export default function ContactManagement({ data, setData }) {
  const toast = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [loadingDelete, setLoadingDelete] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  // New Reply state
  const [replyText, setReplyText] = useState("")
  const [replyImageFile, setReplyImageFile] = useState(null)
  const [replyImagePreview, setReplyImagePreview] = useState(null)
  const [loadingReply, setLoadingReply] = useState(false)

  // Edit Reply state
  const [editingMsgId, setEditingMsgId] = useState(null)
  const [editMsgText, setEditMsgText] = useState("")
  const [editMsgImageFile, setEditMsgImageFile] = useState(null)
  const [editMsgImagePreview, setEditMsgImagePreview] = useState(null)
  const [editRemoveImage, setEditRemoveImage] = useState(false)
  const [loadingEditId, setLoadingEditId] = useState(null)
  const [loadingDeleteMsgId, setLoadingDeleteMsgId] = useState(null)

  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)

  const filteredContacts = (data?.contacts || []).filter(
    (c) =>
      (c.user?.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.user?.fullname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.subject || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const hasAdminReply = (contact) =>
    Array.isArray(contact.messages)
      ? contact.messages.some((m) => m.senderRole === "admin" && !m.isDeleted)
      : Boolean(contact.adminReply)

  const openMessage = (contact) => {
    setSelectedMessage(contact)
    setReplyText("")
    setReplyImagePreview(null)
    setReplyImageFile(null)
    setEditingMsgId(null)
  }

  const compressFileToDataUrl = async (file, onDone) => {
    try {
      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 0.19,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      })
      const dataUrl = await imageCompression.getDataUrlFromFile(compressedBlob)
      onDone(dataUrl)
    } catch (err) {
      console.error("Image compression error:", err)
    }
  }

  const ReplyImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    compressFileToDataUrl(file, (dataUrl) => {
      setReplyImagePreview(dataUrl)
      setReplyImageFile(dataUrl)
    })
  }

  const EditImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    compressFileToDataUrl(file, (dataUrl) => {
      setEditMsgImagePreview(dataUrl)
      setEditMsgImageFile(dataUrl)
      setEditRemoveImage(false)
    })
  }

  const clearReplyImage = () => {
    setReplyImageFile(null)
    setReplyImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const syncContactInState = (updatedContact) => {
    setData((ctc) => ({
      ...ctc,
      contacts: (ctc.contacts || []).map((c) => (c._id === updatedContact._id ? updatedContact : c)),
    }))
    setSelectedMessage(updatedContact)
  }

  const sendReply = async (id) => {
    if (!replyText.trim() && !replyImageFile) return toast.error("Reply text or image is required")
    try {
      setLoadingReply(true)
      const payload = {
        message: replyText,
        ...(replyImageFile ? { replyImageBase64: replyImageFile } : {}),
      }
      const res = await axios.post(`${SERVER_URL}/api/admin/contacts/${id}/replies`, payload, { withCredentials: true })
      const updatedContact = res.data.contact
      syncContactInState(updatedContact)
      setReplyText("")
      clearReplyImage()
      toast.success("Reply sent successfully")
    } catch (err) {
      await handleApiError({ error: err, defaultErrorMsg: "Error sending reply", toast })
    } finally {
      setLoadingReply(false)
    }
  }

  const startEditingMsg = (msg) => {
    setEditingMsgId(msg._id)
    setEditMsgText(msg.message || "")
    setEditMsgImagePreview(msg.imageUrl || null)
    setEditMsgImageFile(null)
    setEditRemoveImage(false)
  }

  const saveEditedReply = async (contactId, messageId) => {
    if (!editMsgText.trim()) return toast.error("Reply text is required")
    try {
      setLoadingEditId(messageId)
      const payload = {
        message: editMsgText,
        ...(editMsgImageFile ? { replyImageBase64: editMsgImageFile } : {}),
        ...(editRemoveImage ? { removeImage: true } : {}),
      }
      const res = await axios.put(
        `${SERVER_URL}/api/admin/contacts/${contactId}/replies/${messageId}`,
        payload,
        { withCredentials: true }
      )
      syncContactInState(res.data.contact)
      setEditingMsgId(null)
      toast.success("Reply updated successfully")
    } catch (err) {
      await handleApiError({ error: err, defaultErrorMsg: "Error updating reply", toast })
    } finally {
      setLoadingEditId(null)
    }
  }

  const deleteReplyMessage = async (contactId, messageId) => {
    try {
      setLoadingDeleteMsgId(messageId)
      const res = await axios.delete(
        `${SERVER_URL}/api/admin/contacts/${contactId}/replies/${messageId}`,
        { withCredentials: true }
      )
      syncContactInState(res.data.contact)
      toast.success("Reply deleted successfully")
    } catch (err) {
      await handleApiError({ error: err, defaultErrorMsg: "Error deleting reply", toast })
    } finally {
      setLoadingDeleteMsgId(null)
    }
  }

  const deleteContact = async (id) => {
    try {
      setLoadingDelete(id)
      setDeleteConfirm(null)
      await axios.delete(`${SERVER_URL}/api/admin/contacts/${id}`, { withCredentials: true })
      setData((ctc) => ({
        ...ctc,
        contacts: ctc.contacts.filter((c) => c._id !== id),
      }))
      setSelectedMessage(null)
      toast.info("Message deleted successfully")
    } catch (err) {
      await handleApiError({ error: err, defaultErrorMsg: "Error deleting message", toast });
    } finally {
      setLoadingDelete(null)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h1 className="text-sm md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Messages & Contacts
          </h1>
          <div className="text-[10px] md:text-xs text-gray-500 font-medium">
            Total: <span className="text-white">{(data?.contacts || []).length}</span>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl overflow-hidden p-2 md:p-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg pl-9 pr-3 py-2 md:py-1.5 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none transition text-xs md:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/30 border border-purple-500/10 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-950/30 border-b border-purple-500/20">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] md:text-xs font-semibold text-gray-300 w-full md:w-auto">Sender / Subject</th>
                <th className="hidden md:table-cell px-3 py-2 text-left text-[10px] md:text-xs font-semibold text-gray-300">Date</th>
                <th className="px-3 py-2 text-right text-[10px] md:text-xs font-semibold text-gray-300 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/5">
              {filteredContacts.map((contact) => (
                <tr key={contact._id} className="hover:bg-purple-500/5 transition group">
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-[11px] md:text-sm truncate max-w-[180px] sm:max-w-xs">
                          {contact.user?.fullname || contact.user?.username || "Unknown User"}
                          {contact.user?.username && (
                            <span className="text-gray-500 text-[10px] ml-1.5">@{contact.user.username}</span>
                          )}
                        </span>
                        {hasAdminReply(contact) && (
                          <span className="shrink-0 text-[8px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                            Replied
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 text-[10px] md:text-xs truncate max-w-[180px] sm:max-w-xs">
                        {contact.subject || "No Subject"}
                      </span>
                      <span className="md:hidden text-[9px] text-gray-600 mt-0.5">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-3 py-2 text-gray-500 text-[10px] md:text-xs whitespace-nowrap">
                    {new Date(contact.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openMessage(contact)}
                        className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded md:rounded-md text-cyan-400 hover:bg-cyan-500/20 transition text-[9px] md:text-xs font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> <span className="hidden sm:inline">Show</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(contact._id)}
                        className="px-2 py-1 bg-red-500/10 border border-red-500/30 rounded md:rounded-md text-red-400 hover:bg-red-500/20 transition text-[9px] md:text-xs font-semibold flex items-center justify-center gap-1"
                      >
                        {loadingDelete === contact._id ? (
                          <Loader className="animate-spin w-3 h-3" />
                        ) : (
                          <>
                            <X className="w-3 h-3 sm:hidden" />
                            <span className="hidden sm:inline">Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-gray-500 text-xs">
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && createPortal(
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedMessage(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg text-white font-bold text-sm sm:text-base shrink-0">
                  {(selectedMessage.user?.fullname || selectedMessage.user?.username || "U").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-semibold text-xs sm:text-sm truncate">
                    {selectedMessage.user?.fullname || selectedMessage.user?.username || "Unknown User"}
                    {selectedMessage.user?.username && (
                      <span className="text-slate-400 text-[10px] ml-1.5">@{selectedMessage.user.username}</span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400">
                    <span>{new Date(selectedMessage.createdAt).toLocaleDateString()}</span>
                    <span className="w-0.5 h-0.5 bg-slate-500 rounded-full"></span>
                    <span>{new Date(selectedMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-4 sm:space-y-6">
              {/* Subject */}
              <div>
                <span className="text-[10px] sm:text-xs font-bold text-purple-400 tracking-wider uppercase mb-1 block">Subject</span>
                <p className="text-sm sm:text-base font-bold text-white leading-tight break-words">
                  {selectedMessage.subject || "No Subject"}
                </p>
              </div>

              {/* Messages Conversation */}
              <div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-wider uppercase mb-2 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Conversation ({(selectedMessage.messages || []).length || 1})
                </span>
                <div className="space-y-3">
                  {Array.isArray(selectedMessage.messages) && selectedMessage.messages.length > 0 ? (
                    selectedMessage.messages.map((msg) => {
                      const isAdmin = msg.senderRole === "admin"
                      const isEditingThis = editingMsgId === msg._id

                      return (
                        <div
                          key={msg._id}
                          className={`p-3 sm:p-4 rounded-xl border ${
                            isAdmin
                              ? "bg-cyan-950/30 border-cyan-800/30 text-cyan-200"
                              : "bg-slate-950/40 border-slate-800/60 text-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  isAdmin
                                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                    : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                }`}
                              >
                                {isAdmin
                                  ? "Admin"
                                  : selectedMessage.user?.fullname || selectedMessage.user?.username || "User"}
                              </span>
                              {msg.isEdited && !msg.isDeleted && (
                                <span className="text-[10px] text-slate-500 italic">(edited)</span>
                              )}
                              <span className="text-[10px] text-slate-500">
                                {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                              </span>
                            </div>
                            {!msg.isDeleted && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => startEditingMsg(msg)}
                                  className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition"
                                  title="Edit Message"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteReplyMessage(selectedMessage._id, msg._id)}
                                  disabled={loadingDeleteMsgId === msg._id}
                                  className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition disabled:opacity-50"
                                  title="Delete Message"
                                >
                                  {loadingDeleteMsgId === msg._id ? (
                                    <Loader className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>

                          {isEditingThis ? (
                            <div className="space-y-3 mt-2">
                              <textarea
                                value={editMsgText}
                                onChange={(e) => setEditMsgText(e.target.value)}
                                maxLength={5000}
                                className="w-full bg-slate-950/70 border border-slate-700 rounded-lg p-2.5 text-white text-xs sm:text-sm focus:border-cyan-500 focus:outline-none min-h-[80px]"
                              />
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2">
                                  {editMsgImagePreview ? (
                                    <div className="relative inline-block">
                                      <div className="relative w-24 h-16 rounded overflow-hidden border border-slate-700">
                                        <Image src={editMsgImagePreview} alt="Edit preview" fill unoptimized className="object-cover" />
                                      </div>
                                      <button
                                        onClick={() => {
                                          setEditMsgImagePreview(null)
                                          setEditMsgImageFile(null)
                                          setEditRemoveImage(true)
                                        }}
                                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white"
                                      >
                                        <X className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => editFileInputRef.current?.click()}
                                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 border border-dashed border-slate-600 rounded text-gray-400 hover:text-cyan-400 text-xs"
                                    >
                                      <ImageIcon className="w-3.5 h-3.5" /> Image
                                    </button>
                                  )}
                                  <input
                                    ref={editFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={EditImageChange}
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setEditingMsgId(null)}
                                    className="px-3 py-1.5 bg-slate-800 text-gray-300 rounded text-xs"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => saveEditedReply(selectedMessage._id, msg._id)}
                                    disabled={loadingEditId === msg._id || !editMsgText.trim()}
                                    className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                                  >
                                    {loadingEditId === msg._id && <Loader className="w-3 h-3 animate-spin" />}
                                    Save
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p
                                className={`leading-relaxed text-xs sm:text-sm whitespace-pre-wrap break-words ${
                                  msg.isDeleted ? "italic text-slate-500" : ""
                                }`}
                              >
                                {msg.message}
                              </p>
                              {!msg.isDeleted && msg.imageUrl && (
                                <div className="mt-3 relative group max-w-xs rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                                  <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
                                    <Image src={msg.imageUrl} alt="Attachment" fill unoptimized className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <button
                                        onClick={() => setSelectedImage(msg.imageUrl)}
                                        className="px-3 py-1.5 bg-white text-slate-900 rounded-full font-bold text-xs flex items-center gap-1"
                                      >
                                        <Maximize2 className="w-3 h-3" /> View
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="bg-slate-950/30 p-3 sm:p-5 rounded-xl border border-slate-800/50 text-slate-300 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap break-words">
                      {selectedMessage.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Send New Reply Section */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-[10px] sm:text-xs font-bold text-cyan-400 tracking-wider uppercase block mb-3">
                  Send Admin Reply
                </span>
                <div className="space-y-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    maxLength={5000}
                    placeholder="Type your reply here... (Max 5000 characters)"
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-white text-xs sm:text-sm focus:border-cyan-500 focus:outline-none min-h-[100px] max-h-48 overflow-y-auto custom-scrollbar resize-y transition"
                  />
                  <div className="text-[10px] text-gray-500 text-right mt-1">
                    {replyText.length} / 5000
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="text-[10px] text-gray-400 mb-1.5 flex items-center gap-1.5 font-semibold uppercase tracking-wide">
                      <ImageIcon className="w-3 h-3" /> Reply Image (optional)
                    </label>
                    {replyImagePreview ? (
                      <div className="relative inline-block">
                        <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                          <Image src={replyImagePreview} alt="Preview" fill unoptimized className="object-cover" />
                        </div>
                        <button
                          onClick={clearReplyImage}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-400 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-dashed border-slate-600 rounded-lg text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400 transition text-xs"
                      >
                        <ImageIcon className="w-4 h-4" /> Upload Image
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={ReplyImageChange}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => sendReply(selectedMessage._id)}
                      disabled={loadingReply || (!replyText.trim() && !replyImageFile)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-lg text-xs sm:text-sm font-bold transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loadingReply ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" /> Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/50 flex flex-row gap-2 sm:gap-3 sm:justify-end">
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded-lg text-xs sm:text-sm font-semibold transition border border-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => setDeleteConfirm(selectedMessage._id)}
                disabled={loadingDelete === selectedMessage._id}
                className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loadingDelete === selectedMessage._id ? <Loader className="w-3.5 h-3.5 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Image Viewer Modal */}
      {selectedImage && createPortal(
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[9999] p-2 sm:p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-lg transition-all z-50"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div
            className="relative w-full h-full max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Full Preview"
              width={1200}
              height={1200}
              unoptimized
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && createPortal(
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300"
          onClick={() => setDeleteConfirm(null)}
        >
          <div 
            className="bg-slate-900 border border-red-500/20 rounded-xl max-w-xs sm:max-w-sm w-full p-5 sm:p-6 shadow-2xl animate-in slide-in-from-bottom-4 zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Delete Message</h3>
                  <p className="text-[10px] sm:text-xs text-gray-400">Confirm deletion</p>
                </div>
              </div>
              <button onClick={() => setDeleteConfirm(null)} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4 cursor-pointer" />
              </button>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition text-xs sm:text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteContact(deleteConfirm)}
                className="flex-1 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition text-xs sm:text-sm font-bold"
              >
                {loadingDelete === deleteConfirm ? <Loader className="animate-spin w-3.5 h-3.5 mx-auto" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
