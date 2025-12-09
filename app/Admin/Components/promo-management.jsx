"use client";

import { useState } from "react";
import { Search, AlertCircle, Loader, Plus, X } from "lucide-react";
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
    <div>
      <h1 className="text-xl font-bold">
        Promo Code Management ({codes.length})
      </h1>

      {/* Search + Add */}
      <div className="flex gap-4 mt-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          <input
            className="w-full bg-slate-800/50 border border-purple-500/30 text-white rounded-lg pl-9 pr-3 py-1.5 placeholder-gray-500 focus:border-cyan-400/50 text-sm"
            placeholder="Search promo codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg flex items-center gap-2 font-semibold text-sm"
        >
          <Plus size={16} /> Add Code
        </button>
      </div>

      {/* Promo codes table */}
      <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-500/20">
              <th className="text-left px-4 py-3 text-xs text-gray-300">
                Promo Code
              </th>
              <th className="text-left px-4 py-3 text-xs text-gray-300">
                Created At
              </th>
              <th className="text-left px-4 py-3 text-xs text-gray-300">
                Updated At
              </th>
              <th className="px-4 py-3 text-xs text-gray-300 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredCodes.length > 0 ? (
              filteredCodes.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-purple-500/10 hover:bg-purple-500/10 transition"
                >
                  <td className="px-4 py-2 font-semibold text-white text-xs">
                    {highlight(item.code)}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-300">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-300">
                    {new Date(item.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setDeleteConfirm(item)}
                      className="px-3 py-1 bg-red-500/20 border border-red-500/40 rounded text-red-400 hover:bg-red-500/30 transition text-xs"
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
                <td colSpan={4} className="text-center text-gray-500 py-6">
                  No promo codes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-slate-800 border border-red-500/40 rounded-xl p-8 w-full max-w-md">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>

            <h2 className="text-xl font-bold text-center mb-2 text-white">
              Delete Promo Code
            </h2>

            <p className="text-gray-300 text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">{deleteConfirm.code}</span>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-slate-700 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deletePromo(deleteConfirm._id);
                  setDeleteConfirm(null);
                }}
                className="flex-1 px-4 py-2 bg-red-500/30 border border-red-500/50 rounded-lg text-red-300"
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-slate-800 border border-purple-500/40 rounded-xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

            <h2 className="text-xl font-bold text-white mb-4">
              Create Promo Code
            </h2>

            <input
              placeholder="PROMO2025"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-full bg-slate-900 border border-purple-500/30 text-white rounded-lg px-4 py-2 mb-4"
            />

            <button
              onClick={createPromo}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-semibold"
            >
              {loadingCreate ? (
                <Loader size={18} className="mx-auto animate-spin" />
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
