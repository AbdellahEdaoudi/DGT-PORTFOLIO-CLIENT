
"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  useEffect(() => {
    signIn("google", { callbackUrl: "/update-profile" });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        {/* Animated spinner */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 bg-slate-800 rounded-full"></div>
        </div>

        {/* Loading text with animation */}
        <p className="text-white text-xl font-semibold">Redirecting to Google Sign-In...</p>
        <p className="text-slate-400 text-sm mt-2">
          <span className="inline-block">Please wait</span>
          <span className="inline-block ml-1">
            <span className="animate-bounce inline-block">.</span>
            <span className="animate-bounce inline-block" style={{ animationDelay: "0.1s" }}>
              .
            </span>
            <span className="animate-bounce inline-block" style={{ animationDelay: "0.2s" }}>
              .
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}
