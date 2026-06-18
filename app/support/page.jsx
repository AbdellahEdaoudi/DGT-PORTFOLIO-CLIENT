"use client";

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { MyContext } from '../context/context';
import { useToast } from '../components/Toast';
import { CheckCheck, Mail, Phone, Loader2, FolderOpen, MessageCircle, MapPin, ImagePlus, X, Loader, Trash2, Clock, ChevronDown, ChevronUp } from '../components/Icons';

import WarningModal from "./Pages/WarningModal"
import MagicalLoader from '../components/MagicalLoader';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/LandingPage/header';
import { getTranslation } from '../translations/others';

export default function ContactForm() {
  const toast = useToast()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userContacts, setUserContacts] = useState([])
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const { EmailUser, userDetails } = useContext(MyContext)
  const t = getTranslation(userDetails?.displayLanguage || 'en')
  const isRtl = userDetails?.displayLanguage === 'ar'

  const fetchUserContacts = async () => {
    if (!EmailUser) return;
    setLoadingContacts(true);
    try {
      const res = await axios.get('/api/proxy/contacts/user-contacts');
      setUserContacts(res.data || []);
    } catch (e) {
      console.error('Error fetching contacts:', e);
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    fetchUserContacts();
  }, [EmailUser]);

  const handleFileChange = (e) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new window.Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxSize = 1200;
            if (width > height && width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            let quality = 0.8;
            const targetSize = 200 * 1024;
            const compressImage = (qual) => {
              canvas.toBlob((blob) => {
                if (blob.size > targetSize && qual > 0.1) {
                  compressImage(qual - 0.1);
                } else {
                  const previewReader = new FileReader();
                  previewReader.onloadend = () => { setAttachment(previewReader.result); };
                  previewReader.readAsDataURL(blob);
                }
              }, 'image/jpeg', qual);
            };
            compressImage(quality);
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      }
    }
  };

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
      await axios.post(`/api/proxy/contacts`, { email: EmailUser, subject, message, attachment });
      toast.success(t('support.successMessage'))
      setSubject('')
      setMessage('')
      setAttachment(null)
      await fetchUserContacts();
    } catch (error) {
      console.error('Error adding contact:', error)
      if (error.response && error.response.status === 429) {
        toast.error(t('support.tooManyRequests'))
      } else {
        toast.error(t('support.errorMessage'))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`/api/proxy/contacts/user-contacts/${id}`);
      setUserContacts(prev => prev.filter(c => c._id !== id));
      toast.success(t('support.messageDeleted'));
    } catch (e) {
      toast.error(t('support.failedToDelete'));
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(isRtl ? 'ar-MA' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (!EmailUser) {
    return <MagicalLoader />
  }

  return (
    <div className="bg-cyan-950 min-h-screen flex flex-col">
      <div className="w-full"><Header lang={userDetails?.displayLanguage} /></div>
      <div dir={isRtl ? 'rtl' : 'ltr'} className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="lg:flex">
            <div className="lg:w-1/2 bg-teal-800 p-4 lg:p-12">
              <Link href={"/"}>
                <Image src={"/Logowbg.png"} alt='LOGO' width={130} height={130} className="bg-white p-2 rounded-lg mb-5" />
              </Link>
              <h2 className="text-3xl font-bold text-white mb-6">{t('support.getInTouch')}</h2>
              <p className="text-teal-100 mb-6">{t('support.weLoveToHear')}</p>
              <div className="space-y-4">
                <div className="fle items-center text-teal-100 hidden">
                  <Mail className="h-6 w-6 mr-3" />
                  <span>dgt.portfolio.ma@gmail.com</span>
                </div>
                <div className="fle items-center text-teal-100 hidden">
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
              <h2 className="text-3xl font-bold text-teal-800 mb-6">{t('support.contactSupport')}</h2>
              <form onSubmit={sendContact} className="space-y-6">
                <div className='hidden'>
                  <label htmlFor="email" className="block text-sm font-medium text-teal-600 mb-1">{t('support.email')} :</label>
                  <div className="relative">
                    <input type="email" id="email" value={EmailUser} readOnly
                      className="pl-10 border-teal-300 focus:border-teal-500 focus:ring-teal-500 w-full rounded-md border h-10 bg-background px-3 py-2 text-sm"
                      placeholder={t('support.enterEmail')} required />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-800 h-5 w-5" />
                  </div>
                </div>
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-teal-600 mb-1">{t('support.subject')} :</label>
                  <div className="relative">
                    <input type="text" id="subject" value={subject} maxLength={100} required
                      onChange={(e) => setSubject(e.target.value)}
                      className="pl-10 border-teal-300 focus:border-teal-500 focus:ring-teal-500 w-full rounded-md border h-10 bg-background px-3 py-2 text-sm"
                      placeholder={t('support.enterSubject')} />
                    <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-800 h-5 w-5" />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-teal-600 mb-1">{t('support.message')} :</label>
                  <div className="relative">
                    <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)}
                      className="pl-10 pt-2 border-teal-300 focus:border-teal-500 focus:ring-teal-500 w-full rounded-md border min-h-[80px] bg-background px-3 py-2 text-sm"
                      rows={4} maxLength={500} placeholder={t('support.enterMessage')} required />
                    <MessageCircle className="absolute left-3 top-2 text-teal-800 h-5 w-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-1">{t('support.attachment')} :</label>
                  <div className="flex items-center gap-4">
                    <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-teal-300 rounded-md text-teal-700 hover:bg-teal-50 transition-colors">
                      <ImagePlus size={20} />
                      <span>{t('support.uploadImage')}</span>
                      <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    {attachment && (
                      <div className="relative">
                        <Image src={attachment} alt="Preview" width={64} height={64} unoptimized className="object-cover rounded-md border border-teal-200" />
                        <button type="button" onClick={() => setAttachment(null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm transition-colors">
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-teal-700 to-teal-800 text-white py-2 px-4 rounded-md hover:from-teal-800 hover:to-teal-900 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300">
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      {t('support.sending')}
                    </>
                  ) : (
                    t('support.sendMessage')
                  )}
                </button>
              </form>
              <WarningModal />
            </div>
          </div>
        </div>

        {/* ─── My Messages ─────────────────────────────── */}
        <div className="mt-6 mb-4">
          <h3 className="text-white text-xl font-bold mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-teal-400" />
            {t('support.myMessages')}
            {userContacts.length > 0 && (
              <span className="bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{userContacts.length}</span>
            )}
          </h3>

          {loadingContacts ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
            </div>
          ) : userContacts.length === 0 ? (
            <div className="bg-white/10 rounded-xl p-8 text-center text-teal-200">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>{t('support.noMessages')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userContacts.map((contact) => (
                <div key={contact._id} className="bg-white rounded-xl shadow overflow-hidden">
                  {/* Header row */}
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-teal-50 transition-colors"
                    onClick={() => setExpandedId(expandedId === contact._id ? null : contact._id)}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-4 h-4 text-teal-700" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-teal-800 truncate">{contact.subject}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDate(contact.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(contact._id); }}
                        disabled={deletingId === contact._id}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                        title={t('support.deleteTitle')}>
                        {deletingId === contact._id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />}
                      </button>
                      {expandedId === contact._id
                        ? <ChevronUp className="w-4 h-4 text-gray-400" />
                        : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded body */}
                  {expandedId === contact._id && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <p className="text-gray-700 text-sm mt-3 leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">{contact.message}</p>
                      {contact.attachment && (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => setLightboxSrc(contact.attachment)}
                            className="group relative block overflow-hidden rounded-lg border border-teal-100 hover:border-teal-400 transition-all duration-200 shadow-sm hover:shadow-md"
                            style={{ width: 200, height: 120 }}
                          >
                            <Image src={contact.attachment} alt="Attachment" fill
                              unoptimized className="object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all duration-200">
                              <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-full transition-opacity duration-200">🔍</span>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Image Lightbox Modal ─────────────────────── */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
          onClick={() => setLightboxSrc(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxSrc(null)}
              className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors shadow-lg"
            >
              <X size={20} />
            </button>
            {/* Image */}
            <img
              src={lightboxSrc}
              alt="Full size attachment"
              className="block max-w-[90vw] max-h-[90vh] object-contain rounded-2xl"
              style={{ minWidth: 200, minHeight: 150 }}
            />
          </div>
          {/* Hint to close */}
          <p className="absolute bottom-6 text-white/50 text-sm select-none">Click outside to close</p>
        </div>
      )}
    </div>
  )
}