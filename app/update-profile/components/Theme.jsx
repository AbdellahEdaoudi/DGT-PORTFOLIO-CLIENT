"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader, CheckCheck } from "lucide-react";


export default function Theme({ userData, userLinks }) {
  const [selectedTheme, setSelectedTheme] = useState(userData.theme || 1);
  const [loading, setLoading] = useState(false);
  const [pendingTheme, setPendingTheme] = useState(null);

  const handleSave = async () => {
    if (!pendingTheme) return;
    setLoading(true);
    try {
      await axios.put(`/api/proxy/users/update/theme`, { theme: pendingTheme });
      setSelectedTheme(pendingTheme);
      setPendingTheme(null);
      toast(
        <p className="flex gap-2 items-center">
          <CheckCheck className="text-green-500" /> Saved successfully!
        </p>,
        { autoClose: 1000 }
      );
    } catch (error) {
      console.error("Error updating theme:", error);
      toast.error("Failed to update theme!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex  items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">🧩 Select Theme</h3>
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className={`px-6 py-2 font-semibold rounded-lg text-white transition-all shadow-lg ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
              }`}
          >
            {loading ? (
              <Loader size={20} className="animate-spin inline-block" />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3  md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
          <div
            key={num}
            onClick={() => setPendingTheme(num)}
            className={`border-4 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${pendingTheme === num
              ? "border-yellow-400 scale-105"
              : selectedTheme === num
                ? "border-green-500"
                : "border-transparent hover:border-gray-300"
              }`}
          >
            <div className="w-full h-28 md:h-28 relative overflow-hidden bg-gray-900 pointer-events-none">
              <img
                src={`/themes/theme${num}.png`}
                alt={`Theme ${num}`}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Preview Section Removed as requested */}
    </div>
  );
}
