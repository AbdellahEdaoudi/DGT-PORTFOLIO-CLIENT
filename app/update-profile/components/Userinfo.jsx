"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { Loader2, Camera, Upload, X, Trash2 } from "../../components/lucide-react";
import DownloadResume from "../../components/downloadcv/DownloadResume";
import { useToast } from "../../components/Toast";
import { handleApiError } from "../../utils/apiErrorHandler";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const DEFAULT_AVATAR = "https://res.cloudinary.com/dssrnghtr/image/upload/v1761258566/dgmlr4uuim5swutkp6a8.png";

function Userinfo({ data, setData, content }) {
  const toast = useToast();
  const user = data?.user || {};

  // ── Image State (Completely Isolated) ──
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.urlimage || DEFAULT_AVATAR);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const avatarInputRef = useRef(null);

  // ── Text Info State ──
  const [fullname, setFullname] = useState(user.fullname || "");
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [location, setLocation] = useState(user.location || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [category, setCategory] = useState(user.category || "");
  const [loading, setLoading] = useState(false);
  const [errormsg, setErrormsg] = useState("");

  // Sync state if initial data changes or loads
  useEffect(() => {
    if (data?.user) {
      setFullname(data.user.fullname || "");
      setUsername(data.user.username || "");
      setEmail(data.user.email || "");
      setLocation(data.user.location || "");
      setPhoneNumber(data.user.phoneNumber || "");
      setCategory(data.user.category || "");
      if (!selectedAvatarFile) {
        setAvatarPreview(data.user.urlimage || DEFAULT_AVATAR);
      }
    }
  }, [data?.user]);

  // ── 1. Avatar Handlers (Isolated) ──
  const handleAvatarChange = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast?.error?.("Please select a valid image file (PNG, JPG, or WEBP).");
      return;
    }

    let finalFile = file;
    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: 0.2, // ~200KB
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };
      const compressedBlob = await imageCompression(file, options);
      finalFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type || file.type,
        lastModified: Date.now(),
      });
      const dataUrl = await imageCompression.getDataUrlFromFile(finalFile);
      setAvatarPreview(dataUrl);
      setSelectedAvatarFile(finalFile);
    } catch (err) {
      console.warn("Compression skipped or failed, using original file:", err);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
      setSelectedAvatarFile(file);
    } finally {
      setIsCompressing(false);
    }
  };

  const cancelAvatarSelection = () => {
    setSelectedAvatarFile(null);
    setAvatarPreview(user?.urlimage || DEFAULT_AVATAR);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const handleUploadAvatar = async () => {
    if (!selectedAvatarFile) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("urlimage", selectedAvatarFile);

    try {
      const res = await axios.put(`${SERVER_URL}/api/users/update/user-image`, formData, {
        withCredentials: true,
      });

      const updatedUser = res.data;
      const newUrl = updatedUser?.urlimage || avatarPreview;

      if (setData) {
        setData((prev) => ({
          ...prev,
          user: {
            ...(prev?.user || {}),
            urlimage: newUrl,
          },
        }));
      }

      const currentUsername = user?.username || username;
      if (currentUsername) {
        try {
          const cached = localStorage.getItem(`data_${currentUsername}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            parsed.user = { ...(parsed.user || {}), urlimage: newUrl };
            localStorage.setItem(`data_${currentUsername}`, JSON.stringify(parsed));
          }
        } catch (e) {
          console.error(e);
        }
      }

      setSelectedAvatarFile(null);
      setAvatarPreview(newUrl);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
      toast?.success?.(content?.savedSuccessfully || "Profile photo updated successfully!");
    } catch (err) {
      await handleApiError({ error: err, defaultErrorMsg: content?.errorMessage || "Failed to upload photo", toast });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsRemovingAvatar(true);
    try {
      const emptyFormData = new FormData();
      const res = await axios.put(`${SERVER_URL}/api/users/update/user-image`, emptyFormData, {
        withCredentials: true,
      });

      const updatedUser = res.data;
      const newUrl = updatedUser?.urlimage || DEFAULT_AVATAR;

      if (setData) {
        setData((prev) => ({
          ...prev,
          user: {
            ...(prev?.user || {}),
            urlimage: newUrl,
          },
        }));
      }

      const currentUsername = user?.username || username;
      if (currentUsername) {
        try {
          const cached = localStorage.getItem(`data_${currentUsername}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            parsed.user = { ...(parsed.user || {}), urlimage: newUrl };
            localStorage.setItem(`data_${currentUsername}`, JSON.stringify(parsed));
          }
        } catch (e) {
          console.error(e);
        }
      }

      setSelectedAvatarFile(null);
      setAvatarPreview(DEFAULT_AVATAR);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
      toast?.success?.(content?.savedSuccessfully || "Profile photo removed successfully!");
    } catch (err) {
      await handleApiError({ error: err, defaultErrorMsg: content?.errorMessage || "Failed to remove photo", toast });
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  // ── 2. Text Info Submission (Isolated) ──
  const UpUserInfo = async (e) => {
    e.preventDefault();

    const cleanUsername = username
      .trim()
      .toLowerCase()
      .replace(/[_.\s]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!cleanUsername || cleanUsername.length < 3) {
      return setErrormsg("Username must be at least 3 characters (letters, numbers, hyphens only)");
    }

    setLoading(true);
    setErrormsg("");

    try {
      const userInfoData = {
        fullname,
        username: cleanUsername,
        email,
        location,
        phoneNumber,
        category,
      };

      const res = await axios.put(`${SERVER_URL}/api/users/update/user-info`, userInfoData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const updatedUser = res.data;
      toast?.success?.(content?.savedSuccessfully || "Saved successfully!");

      if (setData) {
        setData((prev) => ({
          ...prev,
          user: {
            ...(prev?.user || {}),
            ...updatedUser,
          },
        }));
      }

      const oldUsername = data?.user?.username;
      if (oldUsername && oldUsername !== cleanUsername) {
        localStorage.removeItem(`data_${oldUsername}`);
      }
      localStorage.setItem("username", cleanUsername);
      localStorage.setItem(
        `data_${cleanUsername}`,
        JSON.stringify({
          ...data,
          user: {
            ...(data?.user || {}),
            ...updatedUser,
          },
        })
      );
    } catch (error) {
      let msg = content?.errorMessage || "Error updating profile";
      if (error.response?.data?.error) {
        const errorData = error.response.data.error;
        if (typeof errorData === "object" && errorData.error) {
          msg = String(errorData.error);
        } else {
          msg = typeof errorData === "object" ? JSON.stringify(errorData) : String(errorData);
        }
      } else if (error.response?.status === 400) {
        msg = content?.usernameExists || "Username already exists";
      }
      setErrormsg(msg);
      await handleApiError({ error, defaultErrorMsg: msg, toast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={UpUserInfo} dir={user?.displayLanguage === "ar" ? "rtl" : "ltr"} className="space-y-4">
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 md:gap-8">
        {/* ── Profile Image Card (Isolated) ── */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full md:w-1/3">
          <div
            className="relative group cursor-pointer"
            onClick={() => avatarInputRef.current?.click()}
            title="Click to change photo"
          >
            <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-teal-500 shadow-lg relative bg-gray-200">
              <Image
                src={avatarPreview || DEFAULT_AVATAR}
                alt={fullname || "Profile avatar"}
                fill
                sizes="(max-width: 640px) 112px, 160px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-200">
              <Camera size={24} />
              <span className="text-[10px] font-semibold mt-1">Change</span>
            </div>
          </div>

          <input
            ref={avatarInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleAvatarChange}
            className="hidden"
          />

          {/* Status badge & info */}
          <div className="mt-4 text-center space-y-1.5 w-full flex flex-col items-center">
            {isCompressing ? (
              <span className="bg-amber-500 text-white text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                <Loader2 size={12} className="animate-spin" />
                Compressing...
              </span>
            ) : selectedAvatarFile ? (
              <span className="bg-teal-600 text-white text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full">
                New Photo Ready
              </span>
            ) : null}

            <p className="text-[11px] text-gray-500 max-w-[220px] truncate">
              {selectedAvatarFile
                ? `${selectedAvatarFile.name} (${(selectedAvatarFile.size / 1024).toFixed(0)} KB)`
                : "JPG, PNG or WEBP"}
            </p>

            {/* Dedicated Avatar Action Buttons */}
            <div className="pt-1 flex items-center justify-center gap-2 flex-wrap">
              {selectedAvatarFile ? (
                <>
                  <button
                    type="button"
                    onClick={handleUploadAvatar}
                    disabled={isUploadingAvatar}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow transition duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    {isUploadingAvatar ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={13} />
                        <span>Save Photo</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={cancelAvatarSelection}
                    disabled={isUploadingAvatar}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold transition duration-200 cursor-pointer"
                  >
                    <X size={13} />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-xs transition duration-200 cursor-pointer"
                  >
                    <Camera size={13} className="text-teal-600" />
                    <span>{content?.uploadImage || "Change Photo"}</span>
                  </button>
                  {avatarPreview && avatarPreview !== DEFAULT_AVATAR && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={isRemovingAvatar}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 text-xs font-semibold transition duration-200 disabled:opacity-50 cursor-pointer"
                      title="Remove Photo"
                    >
                      {isRemovingAvatar ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── User Information Form ── */}
        <div className="text-xs md:text-base bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full md:w-2/3 space-y-3 sm:space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4 md:mb-6 truncate">
            {fullname || content?.fullName || "Full Name"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Full Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs sm:text-sm font-bold text-gray-700">
                  {content?.fullName || "Full Name"}
                </label>
                <span className="text-[10px] text-gray-400">{fullname.length}/50</span>
              </div>
              <input
                type="text"
                value={fullname}
                maxLength={50}
                onChange={(e) => setFullname(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>

            {/* Username */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs sm:text-sm font-bold text-gray-700">
                  {content?.username || "Username"}
                </label>
                <span className="text-[10px] text-gray-400">{username.length}/30</span>
              </div>
              <input
                type="text"
                value={username}
                maxLength={30}
                onChange={(e) => {
                  setUsername(
                    e.target.value
                      .toLowerCase()
                      .replace(/[_.\s]+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")
                      .replace(/-+/g, "-")
                  );
                  if (errormsg) setErrormsg("");
                }}
                required
                className={`w-full px-3 py-2 text-xs sm:text-sm border bg-white rounded-lg focus:outline-none focus:ring-2 transition ${
                  errormsg ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                }`}
              />
              {errormsg && (
                <p className="mt-1 text-red-500 text-[10px] sm:text-xs font-medium">{errormsg}</p>
              )}
              {username && (
                <div className="flex flex-col gap-0.5 mt-1.5 p-1.5 bg-blue-50/70 border border-blue-100 rounded-md">
                  <p className="text-blue-600 text-[10px] sm:text-xs font-mono font-medium break-all leading-tight">
                    {`l1: ${username}.mylio.site`}
                  </p>
                  <p className="text-blue-600 text-[10px] sm:text-xs font-mono font-medium break-all leading-tight">
                    {`l2: mylio.site/dp/${username}`}
                  </p>
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                {content?.location || "Location"}
              </label>
              <input
                type="text"
                value={location}
                maxLength={50}
                placeholder={content?.exampleLocation || "e.g. Marrakech, Morocco"}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                {content?.phone || "Phone"}
              </label>
              <input
                type="tel"
                maxLength={50}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>

            {/* Specialization */}
            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                {content?.specialization || "Specialization"}
              </label>
              <input
                type="text"
                maxLength={100}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={content?.exampleSpecialization || "e.g. Developer, Designer"}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>

            {/* Display Email */}
            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">
                {content?.displayEmail || "Display Email"}
              </label>
              <input
                type="email"
                maxLength={100}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@example.com"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
              <p className="mt-1 text-[10px] sm:text-xs text-gray-500">
                {content?.displayEmailHint || "This email will be shown on your portfolio (not your login email)."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Submit Action Bar ── */}
      <div className="flex justify-end py-3 sm:py-4 border-b-2 border-gray-200 gap-3 sm:gap-4">
        <DownloadResume
          userDetails={user}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-4 py-2 sm:px-8 sm:py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg text-xs sm:text-base cursor-pointer"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 disabled:opacity-50 text-white font-bold px-4 py-2 sm:px-8 sm:py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg text-xs sm:text-base cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> {content?.saving || "Saving..."}
            </>
          ) : (
            `💾 ${content?.save || "Save"}`
          )}
        </button>
      </div>
    </form>
  );
}

export default Userinfo;
