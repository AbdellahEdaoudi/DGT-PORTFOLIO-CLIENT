'use client';

import { CheckCircle } from '../components/Icons';
import Link from 'next/link';
import { useContext } from 'react';
import { MyContext } from '../context/context';
import { getTranslation } from '../translations/others';

export default function Success() {
  const { userDetails } = useContext(MyContext);
  const currentLang = userDetails?.displayLanguage || 'en';
  const t = getTranslation(currentLang);
  const isAr = currentLang === 'ar';

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex items-center justify-center px-4 py-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-lg">
        <div className="relative bg-slate-800/80 border border-green-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl text-center overflow-hidden">
          
          <div className="flex justify-center mb-4 relative">
            <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse"></div>
            <div className="relative w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border-2 border-green-400/50 shadow-[0_0_30px_rgba(74,222,128,0.3)]">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 drop-shadow-md tracking-tight">
            {t('success.paymentSuccessful') || (isAr ? "🎉 تم الدفع بنجاح! 🎉" : "🎉 Payment Successful! 🎉")}
          </h1>
          
          <h2 className="text-lg sm:text-xl font-semibold text-green-400 mb-4">
            {t('success.welcomeMessage') || (isAr ? "مرحباً بك في DGT Portfolio" : "Welcome to DGT Portfolio")}
          </h2>

          <p className="text-gray-300 mb-5 leading-snug text-sm sm:text-base">
            {t('success.activationMessage') || (isAr ? "تم تفعيل خطة مدى الحياة بنجاح. لديك الآن وصول غير محدود إلى جميع الميزات." : "Your Lifetime Plan has been activated successfully. You now have unlimited access to all portfolio features.")}
          </p>

          <div className="bg-slate-900/50 rounded-xl p-4 mb-6 text-left border border-slate-700/50">
            <ul className="space-y-2">
              {[
                t('success.features.lifetime') || (isAr ? "وصولك مدى الحياة مفعل الآن" : "Your lifetime access is now active"),
                t('success.features.cv') || (isAr ? "مولد السيرة الذاتية جاهز للاستخدام" : "CV generator is ready to use"),
                t('success.features.publishing') || (isAr ? "نشر البورتفوليو مفعل" : "Portfolio publishing is enabled"),
                t('success.features.updates') || (isAr ? "ستتلقى جميع التحديثات المستقبلية تلقائياً" : "You will receive all future updates automatically")
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-200 text-sm sm:text-base">
                  <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link href={`/dp/${userDetails?.username || ''}`}>
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02] transition-all duration-300">
              {t('success.goToPortfolio') || (isAr ? "عرض البورتفوليو الخاص بي" : "View My Portfolio")}
            </button>
          </Link>

          <p className="text-slate-400 text-xs sm:text-sm mt-5">
            {t('success.needHelp') || (isAr ? "هل تحتاج مساعدة للبدء؟ تواصل مع فريق الدعم في أي وقت." : "Need help getting started? Contact our support team anytime.")}
          </p>
        </div>
      </div>
    </main>
  );
}
