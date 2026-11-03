"use client"
import Image from "next/image"
import AuthButtons from "./AuthButtons"
import Link from 'next/link'
import { useContext } from 'react'
import { MyContext } from '../../context/context'

function Header({ lang = "en" }) {
  const { data } = useContext(MyContext)

  return (
    <header className="relative z-50 w-full">
      {/* Navigation */}
      <div className="w-full bg-slate-900 border-b border-purple-500/20 px-6 py-4 flex justify-between items-center relative z-50">
        <Link href={`/${lang}`} className="  text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent cursor-pointer">
          {/* <Sparkles className="w-6 h-6 text-white" /> */}
          <h1 className='flex items-center gap-2.5'>
            <Image src={"/Logowbg.png"} width={160} height={120} className='h-11 md:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]' alt="LOGO" priority />
            Myportfolio
          </h1>
        </Link>
        <AuthButtons lang={data?.user?.displayLanguage || lang} />
      </div>
    </header>
  )
}

export default Header