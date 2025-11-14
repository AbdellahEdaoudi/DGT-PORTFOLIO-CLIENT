import React from 'react'
import Image from "next/image"

import AuthButtons from "./LandingPage/AuthButtons"
import Link from 'next/link'

function Header() {
  return (
    <div>
        {/* Navigation */}
               <div className="w-full bg-slate-900/90  border-b border-purple-500/20  px-6 py-4 flex justify-between items-center">
                 <Link href={"/"} className="flex items-center  text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent cursor-pointer">
                   {/* <Sparkles className="w-6 h-6 text-white" /> */}
                   <Image src={"/LogoinQrcode.png"} width={50} height={50} alt="LOGO" />
                   DGTPortfolio
                 </Link>
                 <AuthButtons />
               </div>
    </div>
  )
}

export default Header