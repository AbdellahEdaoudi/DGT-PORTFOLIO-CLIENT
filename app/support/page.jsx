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
  const { EmailUser, userDetails, userContacts, setUserContacts, loadingAll} = useContext(MyContext)
  const t = getTranslation(userDetails?.displayLanguage || 'en')
  const isRtl = userDetails?.displayLanguage === 'ar'
  const toast = useToast()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

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
    if (userContacts.length >= 2) {
      toast.error(t('support.maxMessagesReached') || "Maximum 2 messages allowed");
      return;
    }
    setLoading(true)
    try {
      const res = await axios.post(`/api/proxy/contacts`, { email: EmailUser, subject, message, attachment });
      toast.success(t('support.successMessage'))
      setUserContacts(prev => [...prev, res.data])
      setSubject('')
      setMessage('')
      setAttachment(null)
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

  const DeleteContactById = async (id) => {
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
                  <div className="flex justify-between mb-1">
                    <label htmlFor="subject" className="block text-sm font-medium text-teal-600">{t('support.subject')} :</label>
                    <span className="text-xs text-teal-500">{subject.length}/100</span>
                  </div>
                  <div className="relative">
                    <input type="text" id="subject" value={subject} maxLength={100} required
                      onChange={(e) => setSubject(e.target.value)}
                      className="pl-10 border-teal-300 focus:border-teal-500 focus:ring-teal-500 w-full rounded-md border h-10 bg-background px-3 py-2 text-sm"
                      placeholder={t('support.enterSubject')} />
                    <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-800 h-5 w-5" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label htmlFor="message" className="block text-sm font-medium text-teal-600">{t('support.message')} :</label>
                    <span className="text-xs text-teal-500">{message.length}/500</span>
                  </div>
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
                {userContacts.length >= 2 && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-3 rounded-md text-center">
                    {t('support.maxMessagesInfo') || "You have reached the maximum limit (2 messages). Please delete an existing message to send a new one or wait for a reply."}
                  </div>
                )}
                <button type="submit" disabled={loading || userContacts.length >= 2}
                  className={`flex items-center justify-center gap-2 w-full text-white py-2 px-4 rounded-md transition-all duration-300 ${userContacts.length >= 2 ? 'bg-gray-500 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'}`}>
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

          {loadingAll ? (
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
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(contact._id); }}
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
                      
                      {(contact.adminReply || contact.adminReplyImage) && (
                        <div className="mt-4 p-3 bg-teal-50 border border-teal-100 rounded-lg max-h-48 overflow-y-auto teal-scrollbar">
                          <span className="text-[10px] sm:text-xs font-bold text-teal-700 tracking-wider uppercase mb-1 block">
                            {t('support.adminReply') || "Admin Reply"}
                          </span>
                          {contact.adminReply && (
                            <p className="text-teal-900 text-sm leading-relaxed whitespace-pre-wrap break-words mb-2">
                              {contact.adminReply}
                            </p>
                          )}
                          {contact.adminReplyImage && (
                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => setLightboxSrc(contact.adminReplyImage)}
                                className="group relative block overflow-hidden rounded-lg border border-teal-200 hover:border-teal-400 transition-all duration-200 shadow-sm hover:shadow-md"
                                style={{ width: 200, height: 120 }}
                              >
                                <Image src={contact.adminReplyImage} alt="Admin Reply Attachment" fill
                                  unoptimized className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all duration-200">
                                  <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-full transition-opacity duration-200">🔍</span>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

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

      {/* ─── Delete Confirm Modal ─────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setDeleteConfirm(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4 pr-6">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center border border-red-200 shrink-0">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">{t('support.deleteTitle') || "Delete Message"}</h3>
            </div>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">{t('support.deleteConfirmText') || "Are you sure you want to delete this message? This action cannot be undone."}</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-sm">
                {t('support.cancel') || "Cancel"}
              </button>
              <button 
                onClick={() => {
                  DeleteContactById(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2 text-sm shadow-sm hover:shadow">
                <Trash2 className="w-4 h-4" /> {t('support.delete') || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

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
            <Image
              src={lightboxSrc}
              alt="Full size attachment"
              width={900}
              height={700}
              className="block max-w-[90vw] max-h-[90vh] object-contain rounded-2xl"
              style={{ minWidth: 200, minHeight: 150 }}
              unoptimized
            />
          </div>
          {/* Hint to close */}
          <p className="absolute bottom-6 text-white/50 text-sm select-none">Click outside to close</p>
        </div>
      )}
    </div>
  )
}