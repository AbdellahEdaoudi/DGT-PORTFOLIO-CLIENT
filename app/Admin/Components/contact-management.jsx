"use client"

import { useState } from "react"
import { Search, AlertCircle, Loader, Eye, X, Maximize2, Mail, Type, Calendar, User, Paperclip, Clock } from "../../Components/Icons"
import { toast } from "react-toastify"
import axios from "axios"
import Image from "next/image"

export default function ContactManagement({ data, setData }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactsData, setContactsData] = useState(data.contacts)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [loadingDelete, setLoadingDelete] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  const filteredContacts = data.contacts.filter(
    (c) =>
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const deleteContact = async (id) => {
    try {
      setLoadingDelete(id)
      setDeleteConfirm(null)
      await axios.delete(`/api/proxy/admin/contacte/${id}`)
      setData((ctc) => ({
        ...ctc,
        contacts: ctc.contacts.filter((c) => c._id !== id),
      }))
      setSelectedMessage(null) // Close the message modal if it was open
      toast.info("Message deleted successfully")
    } catch (err) {
      console.error(err)
      toast.error("Error deleting message")
    } finally {
      setLoadingDelete(null)
      setDeleteConfirm(null)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Messages & Contacts ({data.contacts.length})</h1>

      <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-purple-500/20 flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg pl-9 pr-3 py-1.5 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none transition text-sm"
            />
          </div>
          <div className="text-xs text-gray-400 flex items-center">
            {data.contacts.length} total messages
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-500/20">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr
                  key={contact._id}
                  className="border-b border-purple-500/10 hover:bg-purple-500/10 transition"
                >
                  <td className="px-4 py-2 text-gray-400 text-xs">{contact.email}</td>
                  <td className="px-4 py-2 text-gray-400 truncate max-w-[200px] text-xs">
                    {contact.subject}
                  </td>
                  <td className="px-4 py-2 text-gray-500 text-xs">
                    {new Date(contact.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => setSelectedMessage(contact)}
                      className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-400 hover:bg-cyan-500/30 transition text-xs font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> Show
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(contact._id)}
                      className="px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 hover:bg-red-500/30 transition text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      {loadingDelete === contact._id ? (
                        <Loader className="animate-spin w-3 h-3" />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal عرض الرسالة */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-900/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/20 text-white font-bold text-lg shrink-0">
                    {selectedMessage.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="sm:hidden flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate">
                      {selectedMessage.email}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="sm:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="w-full sm:w-auto">
                  <h3 className="hidden sm:flex text-white font-semibold text-base items-center gap-2 break-all">
                    {selectedMessage.email}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-xs mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(selectedMessage.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(selectedMessage.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="hidden sm:block p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar">
              <div className="mb-6 sm:mb-8">
                <span className="text-xs font-bold text-purple-400 tracking-wider uppercase mb-2 block">Subject</span>
                <h2 className="text-lg sm:text-2xl font-bold text-white leading-tight break-words">
                  {selectedMessage.subject || "No Subject"}
                </h2>
              </div>

              <div className="mb-6 sm:mb-8">
                <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-3 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Message Content
                </span>
                <div className="bg-slate-950/50 p-4 sm:p-6 rounded-xl border border-slate-800/50 text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap break-words break-all">
                  {selectedMessage.message}
                </div>
              </div>

              {selectedMessage.attachment && (
                <div className="mb-2">
                  <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-3 flex items-center gap-2">
                    <Paperclip className="w-3 h-3" /> Attachment
                  </span>

                  <div className="relative group max-w-md rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-md transition-all hover:shadow-purple-900/10 hover:border-purple-500/30">
                    <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
                      <Image
                        src={selectedMessage.attachment}
                        alt="Attachment"
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={() => setSelectedImage(selectedMessage.attachment)}
                          className="px-5 py-2.5 bg-white text-slate-900 rounded-full font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2"
                        >
                          <Maximize2 className="w-4 h-4" />
                          View Fullscreen
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium truncate max-w-[200px]">Attached Image</span>
                      <a
                        href={selectedMessage.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        Open Original <Eye className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions (Optional) */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={() => setSelectedMessage(null)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded-lg text-sm font-semibold transition-colors border border-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => setDeleteConfirm(selectedMessage._id)}
                disabled={loadingDelete === selectedMessage._id}
                className="w-full sm:w-auto px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingDelete === selectedMessage._id ? <Loader className="w-4 h-4 animate-spin" /> : "Delete Message"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] p-4 transition-all duration-300 animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-lg transition-all transform hover:scale-110 z-50 pointer-events-auto"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt="Full Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            />
          </div>
        </div>
      )}

      {/* Modal تأكيد الحذف */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-red-500/30 rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 border border-red-500/50 mx-auto mb-6">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Delete Message
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white hover:bg-slate-700 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteContact(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition font-semibold"
              >
                {loadingDelete === deleteConfirm ? (
                  <Loader className="animate-spin w-4 h-4 mx-auto" />
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
