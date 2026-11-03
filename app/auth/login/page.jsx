"use client";
import React, { useContext, useState } from "react";
import axios from "axios";
import { handleApiError } from "../../utils/apiErrorHandler";
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MyContext } from "../../context/context";
import { Eye, EyeOff, Loader2 } from "../../components/lucide-react";
import Header from "../../components/LandingPage/header";

export default function LoginPage() {
  const router = useRouter();
  const { data, setData } = useContext(MyContext);
  const [form, setForm] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameKeyDown = (e) => {
    if (
      e.ctrlKey ||
      e.metaKey ||
      [
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
        "Enter",
      ].includes(e.key)
    ) {
      return;
    }
    if (!/^[a-zA-Z0-9._-]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "username") {
      value = value.replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase();
    }
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
    setErrorMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = form;

    if (!username || !password) {
      return setErrorMessage("All fields are required.");
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${SERVER_URL}/api/auth/login`,
        { username, password },
        { withCredentials: true }
      );

      const loginData = res.data?.data;
      if (loginData?.user) {
        const uName = loginData.user.username;
        localStorage.setItem("username", uName);
        localStorage.setItem(`data_${uName}`, JSON.stringify(loginData));
        if (setData) {
          setData(loginData);
        }
      }
      router.push("/update-profile");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Login failed. Please try again.");
      await handleApiError({ error: err, defaultErrorMsg: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      <Header lang={data?.user?.displayLanguage || "en"} />

      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full filter blur-3xl pointer-events-none" />

        <form
          onSubmit={handleLogin}
          className="relative z-10 w-full max-w-md p-6 sm:p-8 bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl shadow-2xl"
        >
          <div className="flex flex-col items-center mb-6">
            <Link href="/" className="flex items-center gap-2 mb-1.5">
              <Image
                src="/Logowbg.png"
                width={160}
                height={120}
                alt="Myportfolio Logo"
                className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                priority
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Myportfolio
              </span>
            </Link>
            <h2 className="text-xl font-semibold text-slate-200">Welcome Back</h2>
            <p className="text-sm text-slate-400 mt-0.5">Sign in to manage your portfolio</p>
          </div>

          <div className="space-y-4">
            {errorMessage && (
              <div
                className="bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-2 rounded-xl text-sm"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                maxLength={30}
                value={form.username}
                onKeyDown={handleUsernameKeyDown}
                onChange={handleChange}
                placeholder="username"
                required
                className="w-full p-2.5 sm:p-3 bg-slate-800/80 text-white border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm placeholder-slate-500 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  maxLength={60}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full p-2.5 sm:p-3 pr-11 bg-slate-800/80 text-white border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm placeholder-slate-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-2 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={19} />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            <p className="text-center text-slate-400 text-sm mt-3">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

