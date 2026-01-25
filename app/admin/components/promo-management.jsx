"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Search, AlertCircle, Loader, Plus, X } from "../../components/Icons";
import axios from "axios";
import { toast } from "react-toastify";

export default function PromoCodeManagement({ data, setData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);

  // Highlight text in search
  const highlight = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-300 text-black px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const codes = data?.promoCodes || [];
  const filteredCodes = codes.filter((p) =>
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create promo code
  const createPromo = async () => {
    if (!newCode.trim()) return toast.error("Enter a promo code");
    try {
      setLoadingCreate(true);

      const res = await axios.post("/api/promo/create", {
        code: newCode.toUpperCase(),
      });

      setData((prev) => ({
        ...prev,
        promoCodes: [...prev.promoCodes, res.data.promo],
      }));
      toast.info("Promo code created!");
      setNewCode("");
      setShowCreateModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating promo code");
      console.log(err);
      setNewCode("");
      setShowCreateModal(false);
    } finally {
      setLoadingCreate(false);
    }
  };

  // Delete promo code
  const deletePromo = async (id) => {
    try {
      setLoadingDeleteId(id);

      await axios.delete(`/api/proxy/admin/promo/${id}`);

      setData((prev) => ({
        ...prev,
        promoCodes: prev.promoCodes.filter((c) => c._id !== id),
      }));

      toast.info("Promo code deleted");
    } catch (err) {
      toast.error("Error deleting code");
    } finally {
      setLoadingDeleteId(null);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-2 md:gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-sm md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Promo Codes
            </h1>
            <div className="text-[10px] md:text-xs text-gray-500 font-medium">
              Total: <span className="text-white">{codes.length}</span>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 rounded-lg flex items-center gap-1.5 font-semibold text-[10px] md:text-sm transition shadow-lg shadow-cyan-900/10"
          >
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Add New Code</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl overflow-hidden p-2 md:p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
            <input
              className="w-full bg-slate-900/50 border border-purple-500/30 text-white rounded-lg pl-9 pr-3 py-2 md:py-1.5 placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none transition text-xs md:text-sm"
              placeholder="Search promo codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/30 border border-purple-500/10 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto scroller-smooth">
          <table className="w-full">
            <thead className="bg-slate-950/30 border-b border-purple-500/20">
              <tr>
                <th className="text-left px-3 py-2 text-[10px] md:text-xs font-semibold text-gray-300 w-full md:w-auto">
                  Promo Code
                </th>
                <th className="hidden sm:table-cell text-left px-3 py-2 text-[10px] md:text-xs font-semibold text-gray-300">
                  Created
                </th>
                <th className="hidden md:table-cell text-left px-3 py-2 text-[10px] md:text-xs font-semibold text-gray-300">
                  Updated
                </th>
                <th className="px-3 py-2 text-right text-[10px] md:text-xs font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-purple-500/5">
              {filteredCodes.length > 0 ? (
                filteredCodes.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-purple-500/5 transition group"
                  >
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-white text-[11px] md:text-sm tracking-wide font-mono">
                          {highlight(item.code)}
                        </span>
                        <span className="sm:hidden text-[9px] text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 py-2 text-[10px] md:text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="hidden md:table-cell px-3 py-2 text-[10px] md:text-xs text-gray-500">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => setDeleteConfirm(item)}
                        className="inline-flex items-center justify-center px-2 py-1 bg-red-500/10 border border-red-500/20 rounded md:rounded-lg text-red-400 hover:bg-red-500/20 transition text-[9px] md:text-xs font-semibold"
                      >
                        {loadingDeleteId === item._id ? (
                          <Loader size={12} className="animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 text-xs py-8">
                    No promo codes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteConfirm && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-slate-900 border border-red-500/20 rounded-xl max-w-xs sm:max-w-sm w-full p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight">Delete Promo Code</h3>
                  <p className="text-[10px] sm:text-xs text-gray-400">Confirm deletion</p>
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              Are you sure you want to delete <span className="text-white font-bold font-mono">{deleteConfirm.code}</span>?
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
                  deletePromo(deleteConfirm._id);
                  setDeleteConfirm(null);
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

      {/* Create Modal */}
      {showCreateModal && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-slate-900 border border-purple-500/20 rounded-xl max-w-xs sm:max-w-md w-full p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Create Promo Code
                </h2>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Add a new discount code for users</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-gray-500 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1.5 block">Code Name</label>
                <input
                  placeholder="e.g. PROMO2025"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-slate-950/50 border border-purple-500/30 text-white rounded-lg px-4 py-2.5 focus:border-cyan-500/50 focus:outline-none transition font-mono text-sm sm:text-base placeholder-gray-600"
                  autoFocus
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={createPromo}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 transition"
                >
                  {loadingCreate ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Plus size={16} className="mb-0.5" /> Create Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
