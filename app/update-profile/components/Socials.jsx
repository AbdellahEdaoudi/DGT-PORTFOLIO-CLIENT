"use client";
import React, { useState } from "react";
import { useToast } from "../../components/Toast";
import { CheckCheck, Loader } from "../../components/lucide-react";
import axios from "axios";
import { handleApiError } from "../../utils/apiErrorHandler";
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
import Image from "next/image";

export default function Socials({ data, setData, content }) {
  const toast = useToast();
  const user = data?.user || {};
  const [socials, setSocials] = useState(user.socials || {});
  const socialIcons = {
    github: "/icons/github.svg",
    linkedin: "/icons/linkedin.svg",
    youtube: "/icons/youtube.svg",
    whatsapp: "/icons/whatsapp.svg",
    telegram: "/icons/telegram.svg",
    twitter: "/icons/twitter.svg",
    facebook: "/icons/facebook.svg",
    instagram: "/icons/instagram.svg",
    tiktok: "/icons/tiktok.svg",
    reddit: "/icons/reddit.svg",
    twitch: "/icons/twitch.svg",
    snapchat: "/icons/snapchat.svg",
  };

  const [loading, setLoading] = useState(false);

  const saveSocials = async () => {
    setLoading(true);
    try {
      await axios.put(`${SERVER_URL}/api/users/update/socials`, { socials }, { withCredentials: true });

      // Update global state to reflect changes immediately without refresh
      if (setData) {
        setData(prev => ({
          ...prev,
          user: {
            ...(prev?.user || {}),
            socials: socials
          }
        }));
      }
      localStorage.setItem(`data_${data?.user?.username}`, JSON.stringify({
        ...data,
        user: {
          ...(data?.user || {}),
          socials: socials
        }
      }));

      toast.success(content?.savedSuccessfully || "Saved successfully!");
    } catch (error) {
      await handleApiError({ error, defaultErrorMsg: content?.errorMessage || "Error saving", toast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full" dir={user?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="p-2 space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            🔗 {content?.title || "Social Links"}
          </h3>
        </div>

        {/* Socials Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
          {Object.entries(socialIcons).map(([key, icon]) => (
            <div key={key} className="group relative bg-white border md:border-2 border-gray-200 rounded-lg md:rounded-xl p-1.5 md:p-3 hover:shadow-md transition-all duration-200 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
              <label className="text-[10px] md:text-sm font-bold text-gray-700 mb-1 md:mb-2 flex items-center gap-1.5 capitalize">
                <Image width={20} height={20} src={icon} alt={key} className="w-3.5 h-3.5 md:w-5 md:h-5" />
                {key}
              </label>
              <input
                type="url"
                value={socials[key] || ""}
                maxLength={500}
                onChange={(e) => setSocials({ ...socials, [key]: e.target.value })}
                placeholder={`${content?.enterUrl || "Enter URL"} (${key})`}
                className="w-full bg-gray-50 text-gray-800 font-medium text-[10px] md:text-sm rounded md:rounded-lg px-2 py-1 md:px-3 md:py-2 outline-none border border-gray-300 focus:bg-white focus:border-teal-500 transition-all placeholder-gray-400"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 md:pt-4">
          <button
            onClick={saveSocials}
            disabled={loading}
            className="
                  w-full md:w-auto justify-center
                  bg-gray-900 text-white font-bold px-4 py-2 md:px-6 md:py-2.5 rounded-lg text-xs md:text-base
                  shadow-lg hover:shadow-xl hover:bg-gray-800 disabled:opacity-50 
                  transition-all duration-200 flex items-center gap-2
              "
          >
            {loading ? (
              <>
                <Loader size={14} className="animate-spin md:w-[18px] md:h-[18px]" /> {content?.saving || "Saving..."}...
              </>
            ) : (
              <>
                💾 {content?.save || "Save"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
