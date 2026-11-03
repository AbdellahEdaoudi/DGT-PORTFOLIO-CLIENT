"use client"
import { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { handleApiError } from "../../utils/apiErrorHandler";
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
import { MyContext } from "../../context/context";
import { BookUser, LogOut, MessageSquare, Menu, CreditCard } from "../lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getTranslation } from "../../translations/landing-page";
import { useRouter } from "next/navigation";

export default function AuthButtons({ content, lang }) {
  const [dictionary, setDictionary] = useState(content || null);
  const router = useRouter();

  useEffect(() => {
    if (content) {
      setDictionary(content);
      return;
    }
    const loadTranslation = async () => {
      const dict = await getTranslation(lang || 'en');
      setDictionary(dict?.navbar?.auth || null);
    };
    loadTranslation();
  }, [lang, content]);
  
  const labels = {
    signIn: dictionary?.signIn || "Login",
    register: dictionary?.register || "Register",
    getStarted: dictionary?.getStarted || "Get Started",
    updateProfile: dictionary?.updateProfile || "Update Profile",
    customDomain: dictionary?.customDomain || "Custom Domain",
    payment: dictionary?.payment || "Payment",
    support: dictionary?.support || "Support",
    signOut: dictionary?.signOut || "Sign Out",
  };

  const [setting, setSetting] = useState(true);
  const navRef = useRef(null);
  const { data, setData, authInitialized } = useContext(MyContext) || {};
  const PORTFOLIO = `/dp/${data?.user?.username}`;

  const handleLogout = async () => {
    setSetting(true);
    try {
      await axios.post(`${SERVER_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch (e) {
      await handleApiError({ error: e, defaultErrorMsg: "Operation failed." });
    }
    if (typeof window !== "undefined") {
      const uName = localStorage.getItem("username");
      if (uName) {
        localStorage.removeItem(`data_${uName}`);
      }
      localStorage.removeItem("username");
    }
    if (setData) {
      setData({ user: null, contacts: [], payment: null });
      router.push('/auth/login')
    }
  };

  // Click Outside to close menus
  useEffect(() => {
    const ClickOutside = (event) => {
      if (!navRef.current?.contains(event.target)) {
        setSetting(true);
      }
    };
    document.addEventListener('mousedown', ClickOutside);
    return () => document.removeEventListener('mousedown', ClickOutside);
  }, []);

  if (!authInitialized) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-20 h-9 rounded-full bg-slate-800"></div>
        <div className="w-24 h-9 rounded-full bg-slate-800"></div>
      </div>
    );
  }

  if (data?.user) {
    return (
      <div ref={navRef} className="relative flex items-center gap-5 z-50">
        <Link
          href={PORTFOLIO}
          className="flex items-center gap-2 cursor-pointer hover:scale-105 duration-300"
        >
          <div className="relative p-[2px] rounded-full bg-gradient-to-b from-yellow-300 via-amber-500 to-yellow-600 shadow-md">
            <Image
              width={40}
              height={40}
              src={data.user.urlimage || "/Qrimage.jpg"}
              alt={data.user.fullname || data.user.username}
              className="w-9 h-9 rounded-full object-cover border-2 border-gray-900"
            />
          </div>
          <div className="hidden md:flex items-center gap-1">
            <span className="font-semibold text-white text-sm">{data.user.fullname || data.user.username}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="text-cyan-400 fill-current">
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
              <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        </Link>

        {/* Icon Settings */}
        <button
          onClick={() => setSetting(!setting)}
          className="hover:scale-105 border border-cyan-800/50 p-2 rounded-lg bg-slate-800 text-white duration-300 cursor-pointer"
        >
          <Menu />
        </button>

        {/* SETTINGS DROPDOWN */}
        <nav
          className={`overflow-hidden transition-all duration-300 text-white bg-slate-900 border border-slate-700/60
          rounded-xl w-60 right-0 top-14 absolute flex flex-col shadow-2xl z-50
          ${setting ? "max-h-0 opacity-0 pointer-events-none" : "max-h-96 opacity-100 p-3 pointer-events-auto"}`}
        >
          <Link
            href="/update-profile"
            onClick={() => setSetting(true)}
            className="bg-slate-800/80 py-2 px-3 border border-slate-700/50 flex items-center justify-start gap-2 hover:bg-slate-700 transition duration-200 rounded-lg text-sm mb-2"
          >
            <BookUser className="w-4 h-4 text-cyan-400" />
            <span>{labels.updateProfile}</span>
          </Link>
          <Link
            href="/payment"
            onClick={() => setSetting(true)}
            className="bg-slate-800/80 py-2 px-3 border border-slate-700/50 flex items-center justify-start gap-2 hover:bg-slate-700 transition duration-200 rounded-lg text-sm mb-2"
          >
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <span>{labels.payment}</span>
          </Link>
          <Link
            href="/support"
            onClick={() => setSetting(true)}
            className="bg-slate-800/80 py-2 px-3 border border-slate-700/50 flex items-center justify-start gap-2 hover:bg-slate-700 transition duration-200 rounded-lg text-sm mb-2"
          >
            <MessageSquare className={`w-4 h-4 text-cyan-400 ${data.user.displayLanguage === "ar" ? "scale-x-[-1]" : ""}`} />
            <span>{labels.support}</span>
          </Link>
          {(data.user.role === "admin" || data.user.email?.split("@")[0] === "abdellahedaoudi80") && (
            <Link
              href="/admin"
              onClick={() => setSetting(true)}
              className="bg-slate-800/80 py-2 px-3 border border-slate-700/50 flex items-center justify-start gap-2 hover:bg-slate-700 transition duration-200 rounded-lg text-sm mb-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>Admin</span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500/20 text-red-300 border border-red-500/30 py-2 px-3 hover:bg-red-500 hover:text-white transition duration-200 rounded-lg text-sm flex items-center justify-center gap-2 mt-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{labels.signOut}</span>
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/auth/login"
        className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-700"
      >
        {labels.signIn}
      </Link>
      <Link
        href="/auth/register"
        className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-xl shadow-md shadow-purple-600/20 hover:shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        {labels.register}
      </Link>
    </div>
  );
}
