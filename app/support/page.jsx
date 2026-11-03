"use client";

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { handleApiError } from "../utils/apiErrorHandler";
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
import { MyContext } from '../context/context';
import { useToast } from '../components/Toast';
import { CheckCheck, Mail, Phone, Loader2, FolderOpen, MessageCircle, MapPin, ImagePlus, X, Loader, Trash2, Clock, ChevronDown, ChevronUp, Send, Edit2 } from '../components/lucide-react';

import WarningModal from "./Pages/WarningModal"
import MagicalLoader from '../components/MagicalLoader';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/LandingPage/header';
import { getTranslation } from '../translations/others';

export default function ContactForm() {
  const { data, setData, loadingAll } = useContext(MyContext)
  const userDetails = data?.user
  const userContacts = data?.contacts || []
  const setUserContacts = (updater) => {
    const nextContacts = typeof updater === 'function' ? updater(data?.contacts || []) : updater
    setData((prev) => ({
      ...prev,
      contacts: nextContacts,
    }))
    if (data?.user?.username) {
      localStorage.setItem(`data_${data.user.username}`, JSON.stringify({
        ...data,
        contacts: nextContacts,
      }))
    }
  }
  const currentLang = userDetails?.displayLanguage || 'en'
  const [dictionary, setDictionary] = useState({})
  const isRtl = currentLang === 'ar'

  useEffect(() => {
    getTranslation(currentLang).then((dict) => setDictionary(dict || {}))
  }, [currentLang])

  const content = dictionary?.support || {}
  const toast = useToast()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Reply / edit state
  const [replyText, setReplyText] = useState('')
  const [replyAttachment, setReplyAttachment] = useState(null)
  const [sendingReplyId, setSendingReplyId] = useState(null)
  const [editingMsg, setEditingMsg] = useState(null) // { contactId, messageId, text }
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingMsgId, setDeletingMsgId] = useState(null)

  const compressFileToDataUrl = async (file, callback) => {
    try {
      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 0.19,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });
      const dataUrl = await imageCompression.getDataUrlFromFile(compressedBlob);
      callback(dataUrl);
    } catch (err) {
      console.error("Image compression error:", err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files?.[0];
      if (file) {
        compressFileToDataUrl(file, setAttachment);
      }
    }
  };

  const handleReplyFileChange = (e) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files?.[0];
      if (file) {
        compressFileToDataUrl(file, setReplyAttachment);
      }
    }
  };

  const sendContact = async (e) => {
    e.preventDefault()
    if (userContacts.length >= 2) {
      toast.error(content.maxMessagesReached || "Maximum 2 messages allowed");
      return;
    }
    setLoading(true)
    try {
      const res = await axios.post(`${SERVER_URL}/api/contacts`, { subject, message, attachment }, { withCredentials: true });
      const created = res.data?.contact || res.data;
      toast.success(content.successMessage)
      setUserContacts(prev => [created, ...prev])
      setSubject('')
      setMessage('')
      setAttachment(null)
    } catch (error) {
      await handleApiError({
        error,
        defaultErrorMsg: error.response?.status === 429 ? content.tooManyRequests : content.errorMessage,
        toast
      });
    } finally {
      setLoading(false)
    }
  }

  const sendReply = async (contactId) => {
    if (!replyText.trim() && !replyAttachment) return;
    setSendingReplyId(contactId);
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/contacts/${contactId}/replies`,
        { message: replyText, attachment: replyAttachment },
        { withCredentials: true }
      );
      const updated = res.data?.contact || res.data;
      setUserContacts(prev => prev.map(c => c._id === contactId ? updated : c));
      setReplyText('');
      setReplyAttachment(null);
      toast.success(content.successMessage);
    } catch (error) {
      await handleApiError({ error, defaultErrorMsg: content.errorMessage, toast });
    } finally {
      setSendingReplyId(null);
    }
  };

  const saveEditMessage = async () => {
    if (!editingMsg || !editingMsg.text.trim()) return;
    setSavingEdit(true);
    try {
      const res = await axios.put(
        `${SERVER_URL}/api/contacts/${editingMsg.contactId}/replies/${editingMsg.messageId}`,
        { message: editingMsg.text },
        { withCredentials: true }
      );
      const updated = res.data?.contact || res.data;
      setUserContacts(prev => prev.map(c => c._id === editingMsg.contactId ? updated : c));
      setEditingMsg(null);
      toast.success(content.successMessage);
    } catch (error) {
      await handleApiError({ error, defaultErrorMsg: content.errorMessage, toast });
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteMessage = async (contactId, messageId) => {
    setDeletingMsgId(messageId);
    try {
      const res = await axios.delete(
        `${SERVER_URL}/api/contacts/${contactId}/replies/${messageId}`,
        { withCredentials: true }
      );
      const updated = res.data?.contact || res.data;
      setUserContacts(prev => prev.map(c => c._id === contactId ? updated : c));
      toast.success(content.messageDeleted);
    } catch (error) {
      await handleApiError({ error, defaultErrorMsg: content.errorMessage, toast });
    } finally {
      setDeletingMsgId(null);
    }
  };

  const DeleteContactById = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${SERVER_URL}/api/contacts/user-contact/${id}`, { withCredentials: true });
      setUserContacts(prev => prev.filter(c => c._id !== id));
      toast.success(content.messageDeleted);
    } catch (e) {
      await handleApiError({ error: e, defaultErrorMsg: content.errorMessage, toast });
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

  if (!userDetails) {
    return <MagicalLoader />
  }

  return (
    <div className="bg-[#0b1220] min-h-screen flex flex-col relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full relative z-50"><Header lang={userDetails?.displayLanguage} /></div>

      <div dir={isRtl ? 'rtl' : 'ltr'} className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        
        {/* Main Support Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-purple-500/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="lg:flex">
            
            {/* Left Brand / Info Column */}
            <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-900/95 to-purple-950/50 p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
              <div>
                <Link href={"/"} className="inline-block">
                  <Image src={"/Logowbg.png"} alt='LOGO' width={120} height={100} className="h-14 w-auto object-contain mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]" priority />
                </Link>
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent mb-4">
                  {content.getInTouch}
                </h2>
                <p className="text-slate-300 mb-6 leading-relaxed text-sm sm:text-base">
                  {content.weLoveToHear}
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-800/80">
                <div className="flex items-center text-slate-300 text-sm gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span>{content.prioritySupport || "24/7 Priority Support"}</span>
                </div>
                <div className="flex items-center text-slate-300 text-sm gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <span>{content.directMessaging || "Direct In-App Messaging"}</span>
                </div>
              </div>
            </div>

            {/* Right Contact Form Column */}
            <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10 bg-slate-900/40">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                {content.contactSupport}
              </h2>
              <form onSubmit={sendContact} className="space-y-5">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-300">{content.subject} :</label>
                    <span className="text-xs text-slate-500">{subject.length}/100</span>
                  </div>
                  <div className="relative">
                    <input type="text" id="subject" value={subject} maxLength={100} required
                      onChange={(e) => setSubject(e.target.value)}
                      className="pl-10 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none transition-all"
                      placeholder={content.enterSubject} />
                    <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300">{content.message} :</label>
                    <span className="text-xs text-slate-500">{message.length}/500</span>
                  </div>
                  <div className="relative">
                    <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)}
                      className="pl-10 pt-2.5 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none transition-all min-h-[90px]"
                      rows={4} maxLength={500} placeholder={content.enterMessage} required />
                    <MessageCircle className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">{content.attachment} :</label>
                  <div className="flex items-center gap-4">
                    <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-xl text-slate-300 bg-slate-800/60 hover:bg-slate-800 hover:border-cyan-500/40 text-sm transition-all">
                      <ImagePlus size={18} className="text-cyan-400" />
                      <span>{content.uploadImage}</span>
                      <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    {attachment && (
                      <div className="relative">
                        <Image src={attachment} alt="Preview" width={64} height={64} unoptimized className="object-cover rounded-xl border border-purple-500/40 shadow-md" />
                        <button type="button" onClick={() => setAttachment(null)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors">
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {userContacts.length >= 2 && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl text-center">
                    {content.maxMessagesInfo || "You have reached the maximum limit (2 messages). Please delete an existing message to send a new one or wait for a reply."}
                  </div>
                )}

                <button type="submit" disabled={loading || userContacts.length >= 2}
                  className={`flex items-center justify-center gap-2 w-full text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 ${userContacts.length >= 2 ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60' : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-[0.99]'}`}>
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      {content.sending}
                    </>
                  ) : (
                    content.sendMessage
                  )}
                </button>
              </form>
              <WarningModal />
            </div>
          </div>
        </div>

        {/* ─── My Messages ─────────────────────────────── */}
        <div className="mt-8 mb-6">
          <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2.5">
            <MessageCircle className="w-5 h-5 text-cyan-400" />
            {content.myMessages}
            {userContacts.length > 0 && (
              <span className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">{userContacts.length}</span>
            )}
          </h3>

          {loadingAll ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
          ) : userContacts.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30 text-cyan-400" />
              <p>{content.noMessages}</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {userContacts.map((contact) => (
                <div key={contact._id} className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all hover:border-purple-500/30">
                  {/* Header row */}
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                    onClick={() => setExpandedId(expandedId === contact._id ? null : contact._id)}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-100 truncate">{contact.subject}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {formatDate(contact.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(contact._id); }}
                        disabled={deletingId === contact._id}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors disabled:opacity-50"
                        title={content.deleteTitle}>
                        {deletingId === contact._id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />}
                      </button>
                      {expandedId === contact._id
                        ? <ChevronUp className="w-4 h-4 text-slate-400" />
                        : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded body */}
                  {expandedId === contact._id && (
                    <div className="px-4 pb-4 border-t border-slate-800/80 bg-slate-950/40">
                      <div className="space-y-3 mt-3 max-h-96 overflow-y-auto pr-1">
                        {Array.isArray(contact.messages) && contact.messages.length > 0 ? (
                          contact.messages.map((msg) => {
                            const isAdmin = msg.senderRole === 'admin';
                            const isEditingThis =
                              editingMsg &&
                              editingMsg.contactId === contact._id &&
                              editingMsg.messageId === msg._id;

                            return (
                              <div
                                key={msg._id}
                                className={`p-3.5 rounded-xl border ${
                                  isAdmin
                                    ? 'bg-purple-950/40 border-purple-500/30'
                                    : 'bg-slate-800/70 border-slate-700/70'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <span
                                    className={`text-[11px] font-bold uppercase tracking-wider ${
                                      isAdmin ? 'text-purple-300' : 'text-cyan-300'
                                    }`}
                                  >
                                    {isAdmin
                                      ? content.adminReply || 'Admin Support'
                                      : userDetails?.fullname || userDetails?.username || 'You'}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {msg.isEdited && !msg.isDeleted && (
                                      <span className="text-[10px] text-slate-500 italic">(edited)</span>
                                    )}
                                    <span className="text-[10px] text-slate-400">
                                      {formatDate(msg.createdAt)}
                                    </span>
                                    {!isAdmin && !msg.isDeleted && (
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setEditingMsg({
                                              contactId: contact._id,
                                              messageId: msg._id,
                                              text: msg.message,
                                            })
                                          }
                                          className="p-1 text-slate-400 hover:text-cyan-400 rounded transition-colors"
                                          title="Edit"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => deleteMessage(contact._id, msg._id)}
                                          disabled={deletingMsgId === msg._id}
                                          className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors disabled:opacity-50"
                                          title={content.delete || 'Delete'}
                                        >
                                          {deletingMsgId === msg._id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                          ) : (
                                            <Trash2 className="w-3.5 h-3.5" />
                                          )}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {isEditingThis ? (
                                  <div className="mt-2 space-y-2">
                                    <textarea
                                      value={editingMsg.text}
                                      onChange={(e) =>
                                        setEditingMsg((prev) => ({ ...prev, text: e.target.value }))
                                      }
                                      rows={3}
                                      maxLength={5000}
                                      className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                                    />
                                    <div className="flex justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setEditingMsg(null)}
                                        className="px-3 py-1 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                                      >
                                        {content.cancel || 'Cancel'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={saveEditMessage}
                                        disabled={savingEdit || !editingMsg.text.trim()}
                                        className="px-3 py-1 text-xs rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-50 flex items-center gap-1"
                                      >
                                        {savingEdit && <Loader2 className="w-3 h-3 animate-spin" />}
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p
                                    className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
                                      msg.isDeleted
                                        ? 'italic text-slate-500'
                                        : isAdmin
                                        ? 'text-purple-100'
                                        : 'text-slate-200'
                                    }`}
                                  >
                                    {msg.message}
                                  </p>
                                )}

                                {!msg.isDeleted && msg.imageUrl && (
                                  <div className="mt-2.5">
                                    <button
                                      type="button"
                                      onClick={() => setLightboxSrc(msg.imageUrl)}
                                      className="group relative block overflow-hidden rounded-xl border border-slate-700 hover:border-cyan-400 transition-all duration-200 shadow-md"
                                      style={{ width: 200, height: 120 }}
                                    >
                                      <Image
                                        src={msg.imageUrl}
                                        alt="Attachment"
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-200">
                                        <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm transition-opacity duration-200">
                                          🔍
                                        </span>
                                      </div>
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-slate-300 text-sm mt-3 leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                            {contact.message}
                          </p>
                        )}
                      </div>

                      {/* Reply input or Waiting for Admin Notice */}
                      {(() => {
                        const msgs = Array.isArray(contact.messages) ? contact.messages : [];
                        const hasAdminReplied = msgs.some((m) => m.senderRole === 'admin' && !m.isDeleted);
                        const lastMsg = msgs[msgs.length - 1];
                        const isWaitingForAdmin = !hasAdminReplied || (lastMsg && lastMsg.senderRole === 'user');

                        if (isWaitingForAdmin) {
                          return (
                            <div className="mt-4 p-3.5 rounded-xl bg-purple-950/25 border border-purple-500/20 flex items-center gap-3 text-slate-300 text-sm">
                              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                                <Clock className="w-4 h-4 animate-pulse" />
                              </div>
                              <div>
                                <p className="font-semibold text-white text-xs sm:text-sm">
                                  {content.waitingForAdminTitle || (isRtl ? "بانتظار رد فريق الدعم" : "Waiting for Support Reply")}
                                </p>
                                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                                  {content.waitingForAdminDesc || (isRtl
                                    ? "لا يمكنك إرسال رد جديد حتى يقوم مسؤول الدعم بالرد على رسالتك."
                                    : "You can only reply once a support admin has responded to your message.")}
                                </p>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div className="mt-4 pt-3.5 border-t border-slate-800">
                            <div className="flex flex-col gap-2.5">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={2}
                                maxLength={5000}
                                placeholder={content.enterMessage}
                                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition-all"
                              />
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 border border-slate-700 rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 hover:border-cyan-500/40 text-xs transition-all">
                                    <ImagePlus size={15} className="text-cyan-400" />
                                    <span>{content.uploadImage}</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={handleReplyFileChange}
                                    />
                                  </label>
                                  {replyAttachment && (
                                    <div className="relative">
                                      <Image
                                        src={replyAttachment}
                                        alt="Reply Preview"
                                        width={40}
                                        height={40}
                                        unoptimized
                                        className="object-cover rounded-lg border border-purple-500/40"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setReplyAttachment(null)}
                                        className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow transition-colors"
                                      >
                                        <X size={10} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => sendReply(contact._id)}
                                  disabled={sendingReplyId === contact._id || (!replyText.trim() && !replyAttachment)}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all"
                                >
                                  {sendingReplyId === contact._id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Send className="w-3.5 h-3.5" />
                                  )}
                                  {content.sendMessage}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
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
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setDeleteConfirm(null)}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 relative text-slate-200"
            onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setDeleteConfirm(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-800 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4 pr-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">{content.deleteTitle || "Delete Message"}</h3>
            </div>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">{content.deleteConfirmText || "Are you sure you want to delete this message? This action cannot be undone."}</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors font-medium text-sm border border-slate-700">
                {content.cancel || "Cancel"}
              </button>
              <button 
                onClick={() => {
                  DeleteContactById(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors font-medium flex items-center gap-2 text-sm shadow-md">
                <Trash2 className="w-4 h-4" /> {content.delete || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Image Lightbox Modal ─────────────────────── */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
          onClick={() => setLightboxSrc(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
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