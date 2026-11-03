"use client";
import React, { useState } from "react";
import axios from "axios";
import { handleApiError } from "../../utils/apiErrorHandler";
import { useToast } from "../../components/Toast";
import { CheckCheck, Loader } from "../../components/lucide-react";
import Theme1 from "../../components/themes/theme1";

export default function Bgcolor({ data, setData, content }) {
  const toast = useToast();
  const user = data?.user || {};
  const [bgcolor, setBgcolor] = useState(user.bgcolor || "#1f2937");
  const [loading, setLoading] = useState(false);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const saveBackgroundColor = async () => {
    setLoading(true);
    try {
      await axios.put(`${SERVER_URL}/api/users/update/bgcolor`, { bgcolor }, { withCredentials: true });
      if (setData) {
        setData(prev => ({
          ...prev,
          user: {
            ...(prev?.user || {}),
            bgcolor: bgcolor
          }
        }))
      }
      localStorage.setItem(`data_${data?.user?.username}`, JSON.stringify({
        ...data,
        user: {
          ...(data?.user || {}),
          bgcolor: bgcolor
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
    <div className="" dir={user?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div>
        <label className="block text-lg font-bold text-gray-800 mb-3">🎨 {content?.title || "Background Color"}</label>
        <input
          type="color"
          value={bgcolor}
          onChange={(e) => setBgcolor(e.target.value)}
          className="w-full h-12 rounded-lg cursor-pointer border-2 border-gray-300 transition hover:shadow-lg"
        />
      </div>
      <div className="flex justify-end py-2">
        <button
          onClick={saveBackgroundColor}
          disabled={loading}
          className="bg-cyan-950 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" /> {content?.saving || "Saving..."}
            </>
          ) : (
            `💾 ${content?.save || "Save"}`
          )}
        </button>
      </div>
      <Theme1 userDetails={user} bgcolor={bgcolor} />
    </div>
  );
}
