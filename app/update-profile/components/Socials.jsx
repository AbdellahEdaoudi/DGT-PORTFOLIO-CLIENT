"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { CheckCheck, Loader, Plus, Trash2 } from "lucide-react";
import axios from "axios";

export default function Socials({ userData }) {
  const user = userData || {};
  const [socials, setSocials] = useState(user.socials || {});
  const socialIcons = {
    github: "Icons/github.svg",
    linkedin: "Icons/link.svg",
    twitter: "Icons/twit.svg",
    youtube: "Icons/yt.svg",
    reddit: "Icons/reddit.svg",
    fb: "Icons/fb.svg",
    whatsapp: "Icons/wts.svg",
    telegram: "Icons/tele.svg",
    tiktok: "Icons/tik.svg",
    instagram: "Icons/ins.svg",
    twitch: "Icons/twitch.svg",
    snapchat: "Icons/snap.svg",
  };

  const [loading, setLoading] = useState(false);

  const saveSocials = async () => {
    setLoading(true);
    try {
      await axios.put("/api/proxy/users/update/socials", { socials });
      toast(
        <p className="flex gap-3 items-center">
          <CheckCheck className="text-teal-500" /> Saved successfully!
        </p>,
        { autoClose: 2000 }
      );
    } catch (error) {
      console.error("Error updating socials:", error);
      toast.error("Failed to update social links!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 ">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Social Media Links</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        {Object.entries(socialIcons).map(([key, icon]) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2 capitalize">
              <img src={icon} alt={key} className="w-5 h-5" /> {key}
            </label>
            <input
              type="url"
              value={socials[key] || ""}
              onChange={(e) => setSocials({ ...socials, [key]: e.target.value })}
              placeholder={`Enter ${key} URL`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition bg-white"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-4 ">
        <button
          onClick={saveSocials}
          disabled={loading}
          className="bg-gradient-to-r from-teal-500  to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" /> Saving...
            </>
          ) : (
            "💾 Save"
          )}
        </button>
      </div>
    </div>
  );
}
