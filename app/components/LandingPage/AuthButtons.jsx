"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "../../context/context";
import { BookUser, LogOut, MessageSquare, NotebookText, Globe, Menu, CreditCard } from "../Icons";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getTranslation } from "../../translations/landing-page";

export default function AuthButtons({ lang }) {
  const t = getTranslation(lang || 'en');
  const labels = {
    signIn: t('navbar.auth.signIn') || "Sign In",
    getStarted: t('navbar.auth.getStarted') || "Get Started",
    updateProfile: t('navbar.auth.updateProfile') || "Update Profile",
    businessLinks: t('navbar.auth.businessLinks') || "Business Links",
    customDomain: t('navbar.auth.customDomain') || "Custom Domain",
    subscriptions: t('navbar.auth.subscriptions') || "Subscriptions",
    support: t('navbar.auth.support') || "Support",
    signOut: t('navbar.auth.signOut') || "Sign Out",
  }
  const [setting, setSetting] = useState(true);
  const { data, status } = useSession();
  const router = useRouter();
  const user = data?.user;
  const navRef = useRef(null);
  const { userDetails } = useContext(MyContext);
  // const PORTFOLIO = `http://${userDetails?.username}.localhost:3000`
  const PORTFOLIO = `https://${userDetails?.username}.dgtportfolio.com`
  // const PORTFOLIO = `https://${userDetails?.username}.dgtportfolio.vercel.app`


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


  if (status === "loading") {
    return (
      <div className="flex items-center gap-4 animate-pulse">
        <div className="md:block hidden w-32 h-10 rounded-full bg-gray-500"></div>
        <div className="w-32 h-10 rounded-full bg-gray-500"></div>
      </div>
    );
  }

  if (status === "authenticated" && user) {
    const displayName = userDetails?.fullname || user.name;
    const displayImage = userDetails?.urlimage || user.image;

    return (
      <div ref={navRef} className="relative flex items-center gap-5 z-50">
        <div
          onClick={() => {
            setSetting(true)
            if (userDetails?.username) {
              window.open(PORTFOLIO, "_blank");
              // router.push(`/dp/${userDetails?.username}`)
            } else (
              router.push(`/update-profile`)
            )
          }
          }
          className="flex items-center gap-2 cursor-pointer hover:scale-105 duration-500">
          <Image width={500} height={500}
            src={displayImage}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold text-white md:block hidden">{displayName}</span>
        </div>

        {/* Icon Settings */}
        <span
          onClick={() => {
            setSetting(!setting);
          }}
          className="hover:scale-105 border border-cyan-900 p-2 rounded-lg bg-cyan-700  text-white duration-300 cursor-pointer"
        >
          <Menu />
        </span>
        {/* SETTING [] */}
        <nav dir={userDetails?.displayLanguage === "ar" ? "rtl" : "ltr"}
          className={`overflow-hidden transition-all duration-500 text-white bg-gray-800 
          rounded-md w-60 right-3 top-14 container absolute flex flex-col  
          ${setting ? " max-h-0 pointer-events-none" : "ring-2 max-h-96 p-4 pointer-events-auto"}`}
        >
          <Link
            href={"/update-profile"}
            onClick={() => {
              setSetting(!setting);
            }}
            className="bg-gray-700 py-2 border-b flex items-center justify-center border-gray-600 hover:bg-gray-600 transition duration-300 rounded-sm hover:scale-105 text-center mb-2"
          >
            <div className="flex items-center gap-1">
              <BookUser /> {labels.updateProfile}
            </div>
          </Link>
          <Link
            href={"/business-links"}
            onClick={() => {
              setSetting(!setting);
            }}
            className="bg-gray-700 py-2 border-b flex items-center justify-center border-gray-600 hover:bg-gray-600 transition duration-300 rounded-sm hover:scale-105 text-center mb-2"
          >
            <div className="flex items-center gap-1">
              <NotebookText className={` ${userDetails?.displayLanguage === "ar" ? "rotate-180" : ""}`} /> {labels.businessLinks}
            </div>
          </Link>
          <Link
            href={"/custom-domain"}
            onClick={() => {
              setSetting(!setting);
            }}
            className="bg-gray-700 py-2 border-b flex items-center justify-center border-gray-600 hover:bg-gray-600 transition duration-300 rounded-sm hover:scale-105 text-center mb-2"
          >
            <div className="flex items-center gap-1">
              <Globe /> {labels.customDomain}
            </div>
          </Link>
          <Link
            href={"/subscription"}
            onClick={() => {
              setSetting(!setting);
            }}
            className="bg-gray-700 py-2 border-b flex items-center justify-center border-gray-600 hover:bg-gray-600 transition duration-300 rounded-sm hover:scale-105 text-center mb-2"
          >
            <div className="flex items-center gap-1">
              <CreditCard /> {labels.subscriptions}
            </div>
          </Link>
          <Link
            href={"/support"}
            onClick={() => {
              setSetting(!setting);
            }}
            className="bg-gray-700 flex items-center justify-center py-2 border-b border-gray-600 hover:bg-gray-600 transition duration-300 rounded-sm hover:scale-105 text-center mb-2"
          >
            <div className="flex items-center gap-1">
              <MessageSquare className={`${userDetails?.displayLanguage === "ar" ? "scale-x-[-1]" : ""}`} /> {labels.support}
            </div>
          </Link>
          {userDetails?.email && (
            <Link
              href={"/admin"}
              onClick={() => {
                setSetting(!setting);
              }}
              className={`${userDetails?.email?.split("@")[0] !== "abdellahedaoudi80" && "hidden"} bg-gray-700 flex items-center justify-center py-2 border-b border-gray-600 hover:bg-gray-600 transition duration-300 rounded-sm hover:scale-105 text-center mb-2 ${setting ? " max-h-0 pointer-events-none" : "ring-2 max-h-80 p-4 pointer-events-auto"}`}
            >
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-check-icon lucide-badge-check"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                Admin
              </div>
            </Link>
          )}

          <div
            onClick={() => {
              signOut({
                callbackUrl: "/",
                redirect: true,
              });
            }}
            className="bg-red-500 py-2 border-b cursor-pointer border-gray-600 hover:bg-red-600 transition duration-300 rounded-sm hover:scale-105 justify-center flex gap-2"
          >
            <LogOut />
            {labels.signOut}
          </div>
        </nav>
      </div>
    );
  }


  return (
    <div className="flex gap-4">
      <button
        onClick={() => signIn("google", { redirect: true, callbackUrl: "/" })}
        className="md:block hidden px-6 py-2 rounded-full border border-purple-500/50 hover:border-purple-400 transition"
      >
        {labels.signIn}
      </button>
      <button
        onClick={() => signIn("google", { redirect: true, callbackUrl: "/" })}
        className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 hover:shadow-lg hover:shadow-purple-500/50 transition"
      >
        {labels.getStarted}
      </button>
    </div>
  );
}
