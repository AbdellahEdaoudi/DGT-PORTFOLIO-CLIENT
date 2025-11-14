"use client"  
import { signIn, signOut, useSession } from "next-auth/react"
import { useContext,useState,useEffect,useRef } from "react";
import { MyContext } from "../../Context/MyContext";
import { BookUser, LogOut, MessageSquare, NotebookText, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MagicalLoader from "../MagicalLoader";

export default function AuthButtons() {
  const [setting, setSetting] = useState(true);
  const { data, status } = useSession();
  const router = useRouter();
  const user = data?.user;
  const navRef = useRef(null);
  const { userDetails, EmailUser, loadingAll } = useContext(MyContext);
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
      <div  ref={navRef} className="relative flex items-center gap-5 z-50">
        <div 
        onClick={()=>{
          setSetting(true)
          if (userDetails?.username) {
            router.push(`/${userDetails?.username}`)
          }else (
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
          <Settings />
        </span>
        {/* SETTING [] */}
      <nav 
        className={`overflow-hidden transition-all duration-500 text-white bg-gray-800 
          rounded-md w-60 right-3 top-14 container absolute flex flex-col  
          ${setting ? " max-h-0 pointer-events-none" : "ring-2 max-h-80 p-4 pointer-events-auto"}`}
      >
        <Link
          href={"/update-profile"}
          onClick={() => {
            setSetting(!setting);
          }}
          className="bg-gray-700 py-2 border-b flex items-center justify-center border-gray-600 hover:bg-gray-600 transition duration-300 rounded-sm hover:scale-105 text-center mb-2"
        >
          <div className="flex items-center gap-1">
            <BookUser /> Update Profile
          </div>
        </Link>
        <Link
          href={"/BusinessLinks"}
          onClick={() => {
            setSetting(!setting);
          }}
          className="bg-gray-700 py-2 border-b flex items-center justify-center border-gray-600 hover:bg-gray-600 transition duration-300 rounded-sm hover:scale-105 text-center mb-2"
        >
          <div className="flex items-center gap-1">
            <NotebookText /> Work Links
          </div>
        </Link>
        <Link
          href={"/Contact"}
          onClick={() => {
            setSetting(!setting);
          }}
          className="bg-gray-700 flex items-center justify-center py-2 border-b border-gray-600 hover:bg-gray-600 transition duration-300 rounded-sm hover:scale-105 text-center mb-2"
        >
          <div className="flex items-center gap-1">
            <MessageSquare /> Support
          </div>
        </Link>
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
          Sign Out
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
        Sign In
      </button>
      <button
        onClick={() => signIn("google", { redirect: true, callbackUrl: "/" })}
        className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 hover:shadow-lg hover:shadow-purple-500/50 transition"
      >
        Get Started
      </button>
    </div>
  );
}
