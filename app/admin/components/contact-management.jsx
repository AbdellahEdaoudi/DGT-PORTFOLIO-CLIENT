"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { Search, AlertCircle, Loader, Eye, X, Maximize2, Mail, Type, Calendar, User, Paperclip, Clock } from "../../components/Icons"
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-2 md:gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h1 className="text-sm md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Messages & Contacts
          </h1>
          <div className="text-[10px] md:text-xs text-gray-500 font-medium">
            Total: <span className="text-white">{data.contacts.length}</span>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl overflow-hidden p-2 md:p-3">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
            <div className="w-full relative">
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
      </div>

      <div className="bg-slate-800/30 border border-purple-500/10 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto scroller-smooth">
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
                <tr
                  key={contact._id}
                  className="hover:bg-purple-500/5 transition group"
                >
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white font-medium text-[11px] md:text-sm truncate max-w-[180px] sm:max-w-xs">{contact.email}</span>
                      <span className="text-gray-500 text-[10px] md:text-xs truncate max-w-[180px] sm:max-w-xs">{contact.subject || "No Subject"}</span>
                      <span className="md:hidden text-[9px] text-gray-600 mt-0.5">{new Date(contact.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-3 py-2 text-gray-500 text-[10px] md:text-xs whitespace-nowrap">
                    {new Date(contact.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedMessage(contact)}
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

      {/* Modal عرض الرسالة */}
      {selectedMessage && createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg text-white font-bold text-sm sm:text-base shrink-0">
                  {selectedMessage.email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-semibold text-xs sm:text-sm truncate">
                    {selectedMessage.email}
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
              <div>
                <span className="text-[10px] sm:text-xs font-bold text-purple-400 tracking-wider uppercase mb-1 block">Subject</span>
                <p className="text-sm sm:text-base font-bold text-white leading-tight break-words">
                  {selectedMessage.subject || "No Subject"}
                </p>
              </div>

              <div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-wider uppercase mb-2 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Message
                </span>
                <div className="bg-slate-950/30 p-3 sm:p-5 rounded-xl border border-slate-800/50 text-slate-300 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap break-words">
                  {selectedMessage.message}
                </div>
              </div>

              {selectedMessage.attachment && (
                <div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-wider uppercase mb-2 flex items-center gap-2">
                    <Paperclip className="w-3 h-3" /> Attachment
                  </span>

                  <div className="relative group max-w-sm rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                    <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
                      <Image
                        src={selectedMessage.attachment}
                        alt="Attachment"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => setSelectedImage(selectedMessage.attachment)}
                          className="px-3 py-1.5 bg-white text-slate-900 rounded-full font-bold text-xs flex items-center gap-1"
                        >
                          <Maximize2 className="w-3 h-3" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/50 flex flex-row gap-2 sm:gap-3 sm:justify-end">
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded-lg text-xs sm:text-sm font-semibold transition-colors border border-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => setDeleteConfirm(selectedMessage._id)}
                disabled={loadingDelete === selectedMessage._id}
                className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
            className="absolute top-28 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-lg transition-all z-50"
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

      {/* Modal تأكيد الحذف */}
      {deleteConfirm && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-red-500/20 rounded-xl max-w-xs sm:max-w-sm w-full p-5 sm:p-6 shadow-2xl animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
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
              <button onClick={() => setDeleteConfirm(null)} className="text-gray-500 hover:text-white"><X className="w-4 h-4 cursor-pointer" /></button>
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
                className="flex-1 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition text-xs sm:text-sm font-bold shadow-lg shadow-red-900/10"
              >
                {loadingDelete === deleteConfirm ? (
                  <Loader className="animate-spin w-3.5 h-3.5 mx-auto" />
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
