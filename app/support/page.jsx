"use client";

import React, { useContext, useState } from 'react';
import axios from 'axios';
import { MyContext } from '../Context/MyContext';
import { toast } from 'react-toastify';
import { CheckCheck, Mail, Phone, Loader2, FolderOpen, MessageCircle, MapPin } from 'lucide-react';
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import WarningModal from "./Pages/WarningModal"
import MagicalLoader from '../Components/MagicalLoader';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../Components/header';
import { useTranslation } from '../lib/translations';

export default function ContactForm() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { EmailUser, userDetails } = useContext(MyContext)
  const { t } = useTranslation(userDetails?.displayLanguage || 'en')


  const sendContact = async (e) => {
    e.preventDefault()
    setLoading(true)
    const regex = /<script.*?>.*?<\/script>|<iframe.*?>.*?<\/iframe>|javascript:|eval\(|alert\(|document\.cookie|window\.location|<a\s+href=["']?javascript:.*?["']?/i;

    if (regex.test(subject) || regex.test(message)) {
      setLoading(false)
      document.getElementById('my_modal_2').showModal();
      return;
    }
    try {
      await axios.post(`/api/proxy/contacts`, { email: EmailUser, subject, message });
      toast(<p className='flex gap-3 items-center'><CheckCheck className="text-teal-500" /> {t('successMessage')}</p>, {
        autoClose: 2000,
      })
      setMessage('')
    } catch (error) {
      console.error('Error adding contact:', error)
      if (error.response && error.response.status === 429) {
        toast.error(<p className='flex gap-3 items-center'>{t('tooManyRequests')}</p>, {
          autoClose: 2000,
        })
      } else {
        toast.error(<p className='flex gap-3 items-center'>{t('errorMessage')}</p>, {
          autoClose: 2000,
        })
      }
    } finally {
      setLoading(false)
    }
  }
  if (!EmailUser) {
    return <MagicalLoader />
  }

  return (
    <div className="bg-cyan-950 min-h-screen flex flex-col" dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full"><Header lang={userDetails?.displayLanguage} /></div>
      <div className="relative  w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="lg:flex ">
            <div className="lg:w-1/2 bg-teal-800 p-4 lg:p-12">
              <Link href={"/"}>
                <Image src={"/LogoinQrcode.png"} alt='LOGO' width={130} height={130} className="bg-white p-2 rounded-lg mb-5" />
              </Link>
              <h2 className="text-3xl font-bold text-white mb-6">{t('getInTouch')}</h2>
              <p className="text-teal-100 mb-6">{t('weLoveToHear')}</p>
              <div className="space-y-4">
                <div className="fle items-center text-teal-100 hidden">
                  <Mail className="h-6 w-6 mr-3" />
                  <span>dgt.portfolio.ma@gmail.com</span>
                </div>
                <div className="fle  items-center text-teal-100 hidden">
                  <Phone className="h-6 w-6 mr-3" />
                  <span>+000000000000</span>
                </div>
                <div className="fle items-center hidden text-teal-100">
                  <MapPin className="h-6 w-6 mr-3" />
                  <span>United States</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 p-8 lg:p-8">
              <h2 className="text-3xl font-bold text-teal-800 mb-6">{t('contactSupport')}</h2>
              <form onSubmit={sendContact} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-teal-600 mb-1">{t('email')} :</label>
                  <div className="relative">
                    <Input
                      type="email"
                      id="email"
                      value={EmailUser}
                      readOnly
                      className="pl-10 border-teal-300 focus:border-teal-500 focus:ring-teal-500 w-full"
                      placeholder={t('enterEmail')}
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-800 h-5 w-5" />
                  </div>
                </div>
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-teal-600 mb-1">{t('subject')} :</label>
                  <div className="relative">
                    <Input
                      type="tel"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="pl-10 border-teal-300 focus:border-teal-500 focus:ring-teal-500 w-full"
                      placeholder={t('enterSubject')}
                    />
                    <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-800 h-5 w-5" />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-teal-600 mb-1">{t('message')} :</label>
                  <div className="relative">
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="pl-10 pt-2 border-teal-300 focus:border-teal-500 focus:ring-teal-500 w-full"
                      rows={4}
                      maxLength={500}
                      placeholder={t('enterMessage')}
                      required
                    />
                    <MessageCircle className="absolute left-3 top-2 text-teal-800 h-5 w-5" />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-700 to-teal-800 text-white py-2 px-4 rounded-md hover:from-teal-800 hover:to-teal-900 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('sending')}
                    </>
                  ) : (
                    t('sendMessage')
                  )}
                </Button>
              </form>
              <WarningModal />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}