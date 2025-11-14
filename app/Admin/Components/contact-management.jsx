"use client"

import { useState } from "react"
import { Search, AlertCircle, Loader, Eye, X } from "lucide-react"
import { toast } from "react-toastify"
import axios from "axios"

export default function ContactManagement({ data ,setData }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactsData, setContactsData] = useState(data.contacts)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [loadingDelete, setLoadingDelete] = useState(null)

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
      toast.success("Message deleted successfully")
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
      <h1 className="text-2xl font-bold">Messages & Contacts ({data.contacts.length})</h1>

      <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-purple-500/20 flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none transition"
            />
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            {data.contacts.length} total messages
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-500/20">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Subject</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr
                  key={contact._id}
                  className="border-b border-purple-500/10 hover:bg-purple-500/10 transition"
                >
                  <td className="px-6 py-4 text-gray-400">{contact.email}</td>
                  <td className="px-6 py-4 text-gray-400 truncate max-w-[200px]">
                    {contact.subject}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(contact.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => setSelectedMessage(contact)}
                      className="px-3 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-400 hover:bg-cyan-500/30 transition text-sm font-semibold flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> Show
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(contact._id)}
                      className="px-3 py-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 hover:bg-red-500/30 transition text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      {loadingDelete === contact._id ? (
                        <Loader className="animate-spin w-4 h-4" />
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-400  mt-1">
                  From :  {selectedMessage.email}
                </p>
                <h2 className="text-2xl font-bold text-white">Subject : {selectedMessage.subject}</h2>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 hover:bg-purple-500/20 rounded transition"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="border-t border-purple-500/20 pt-4">
              <p className="text-gray-400  mb-3">Message:</p>
              <p className="text-white leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>
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
