"use client"
import React, { useEffect, useState } from 'react'
import Image from "next/image"
import AuthButtons from "./LandingPage/AuthButtons"
import Link from 'next/link'
import { getDictionary } from '../dictionaries/get-dictionary';

function Header({ lang = "en" }) {
  const [dict, setDict] = useState(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const d = await getDictionary(lang);
      setDict(d);
    }
    fetchDictionary();
  }, [lang])

  return (
    <div>
      {/* Navigation */}
      <div className="w-full bg-slate-900  border-b border-purple-500/20  px-6 py-4 flex justify-between items-center">
        <Link href={`/${lang}`} className="  text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent cursor-pointer">
          {/* <Sparkles className="w-6 h-6 text-white" /> */}
          <h1 className='flex items-center'>
            <Image src={"/LogoinQrcode.png"} width={500} height={500} className='w-12 h-10' alt="LOGO" />
            DGTPortfolio
          </h1>
        </Link>
        <AuthButtons labels={dict?.navbar?.auth} />
      </div>
    </div>
  )
}

export default Header