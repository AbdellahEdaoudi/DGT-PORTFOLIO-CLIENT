'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useContext } from 'react';
import { MyContext } from '../Context/MyContext';
import { useTranslation } from '../lib/translations';

export default function Success() {
  const { userDetails } = useContext(MyContext);
  const { t } = useTranslation(userDetails?.displayLanguage || 'en');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex items-center justify-center px-6" dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        <div className="relative bg-slate-800/80 border border-green-500/40 rounded-2xl p-10 backdrop-blur-md shadow-xl text-center">

          {/* دائرة أيقونة جميلة */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/40">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>

          {/* عنوان النجاح */}
          <h1 className="text-3xl font-bold text-white mb-3 drop-shadow">
            {t('paymentSuccessful')}
          </h1>

          {/* نص بسيط */}
          <p className="text-gray-300 mb-8">
            {t('subscriptionActive')}
          </p>

          {/* زر العودة */}
          <Link href="/">
            <button className="w-full bg-gradient-to-r from-green-400 to-green-500 text-black font-semibold py-3 rounded-full shadow-md hover:shadow-green-500/40 transition-all duration-300">
              {t('goToHome')}
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
