'use client';
import { useContext, useState } from 'react';
import { createPortal } from "react-dom";
import { Link, X, Edit3, Trash2, CheckCircle, Loader } from '../Components/Icons';
import { MyContext } from '../Context/MyContext';
import axios from 'axios';
import { toast } from "react-toastify";
import ParticleComponent from "../Components/ParticleComponent"
import DOMPurify from 'dompurify';
import WarningModal from "./Pages/WarningModal"
import ConfirmModal from "./Pages/ConfirmModal"
import MagicalLoader from '../Components/MagicalLoader';
import Header from '../Components/header';
import { useTranslation } from '../lib/translations';

function EditUserLinks() {
  const { EmailUser, userLinks, setUserLinks, loadingAll, userDetails } = useContext(MyContext);
  const { t } = useTranslation(userDetails?.displayLanguage || 'en');
  const [loadingAction, setLoadingAction] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Add States
  const [namelink, setNamelink] = useState('');
  const [link, setLink] = useState('');
  const [highlightedLinkId, setHighlightedLinkId] = useState(null);

  // Edit States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLinkId, setEditLinkId] = useState(null);
  const [editNamelink, setEditNamelink] = useState('');
  const [editLinkUrl, setEditLinkUrl] = useState('');

  const AddLink = async (e) => {
    e.preventDefault();
    setLoadingAction('add');
    const regex = /<script.*?>.*?<\/script>|<iframe.*?>.*?<\/iframe>|javascript:|eval\(|alert\(|document\.cookie|window\.location|<a\s+href=["']?javascript:.*?["']?/i;

    if (regex.test(link) || regex.test(namelink)) {
      setLoadingAction(null);
      document.getElementById('my_modal_2').showModal();
      return;
    }

    try {
      const sanitizedLink = DOMPurify.sanitize(link);
      const response = await axios.post(`/api/proxy/links`, {
        useremail: EmailUser,
        namelink,
        link: sanitizedLink
      });
      setUserLinks(prevLinks => [response.data.data, ...prevLinks]);
      toast(t('linkAddedSuccessfully'));
      setLink('');
      setNamelink('');
    } catch (error) {
      console.error('There was an error adding the link!', error);
      toast.error(t('failedToAddLink'));
    } finally {
      setLoadingAction(null);
    }
  };

  const EditLink = (lnk) => {
    setEditLinkId(lnk._id);
    setEditNamelink(lnk.namelink);
    setEditLinkUrl(lnk.link);
    setIsEditModalOpen(true);
  };

  const UpdateLink = async (e) => {
    e.preventDefault();
    setLoadingAction('update');
    const regex = /<script.*?>.*?<\/script>|<iframe.*?>.*?<\/iframe>|javascript:|eval\(|alert\(|document\.cookie|window\.location|<a\s+href=["']?javascript:.*?["']?/i;

    if (regex.test(editLinkUrl) || regex.test(editNamelink)) {
      setLoadingAction(null);
      document.getElementById('my_modal_2').showModal();
      return;
    }

    try {
      const sanitizedLink = DOMPurify.sanitize(editLinkUrl);
      const response = await axios.put(`/api/proxy/links/${editLinkId}`, {
        useremail: EmailUser,
        namelink: editNamelink,
        link: sanitizedLink
      });
      setUserLinks(prevLinks =>
        prevLinks.map(item => (item._id === editLinkId ? response.data.data : item))
      );
      toast(
        <p className="flex gap-3 items-center">
          <CheckCircle /> {t('linkUpdatedSuccessfully')}
        </p>,
        { autoClose: 3000 }
      );
      setIsEditModalOpen(false);
      setEditLinkId(null);
      setEditLinkUrl('');
      setEditNamelink('');

      // Highlight the updated link
      setHighlightedLinkId(editLinkId);
      setTimeout(() => setHighlightedLinkId(null), 5000);
    } catch (error) {
      console.error('There was an error updating the link!', error);
      toast.error(t('failedToUpdateLink'));
    } finally {
      setLoadingAction(null);
    }
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    if (!deleteId) return;
    setLoadingAction(`delete-${deleteId}`);
    try {
      await axios.delete(`/api/proxy/links/${deleteId}`);
      setUserLinks(prev => prev.filter(item => item._id !== deleteId));
      setEditLinkId(null);
      setNamelink('');
      setLink('');
      toast(t('linkDeletedSuccessfully'));
    } catch (error) {
      console.error('There was an error deleting the link!', error);
      toast.error(t('failedToDeleteLink'));
    } finally {
      setLoadingAction(null);
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };


  if (!EmailUser || loadingAll) { return <MagicalLoader /> }


  return (
    <div className={`bg-cyan-950 min-h-screen pb-12 justify-center`} dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Header lang={userDetails?.displayLanguage} />
      {/* UserLinks */}
      <div className="flex items-center justify-center p-4">
        <section className='p-2 md:p-4 rounded-lg bg-gray-100 w-full max-w-[98%] md:w-[110vh] user-select-none mx-auto md:mx-0 text-gray-800 shadow-xl'>
          <h1 className='p-2 text-center text-lg md:text-3xl font-semibold text-gray-900'>{t('businessLinks')}</h1>
          {/* Add Link Form */}
          <div className={`mx-0 md:mx-3 p-3 md:p-6 bg-white rounded-xl shadow-sm border border-gray-200 mb-6 md:mb-8`}>
            <form onSubmit={AddLink} className="space-y-3 md:space-y-5">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t('Title') || "Title"}</label>
                <input
                  type="text"
                  value={namelink}
                  onChange={(e) => setNamelink(e.target.value)}
                  required
                  placeholder={t('exampleWebsite')}
                  maxLength={100}
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 bg-gray-50 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-xs md:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">{t('Link') || "Link"}</label>
                <input
                  type="url"
                  value={link}
                  placeholder={t('exampleUrl')}
                  maxLength={100}
                  onChange={(e) => setLink(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 bg-gray-50 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-xs md:text-sm"
                />
              </div>
              <button
                disabled={loadingAction !== null || userLinks.length >= 10}
                type="submit"
                className={`w-full text-white font-medium md:font-semibold text-xs md:text-sm px-3 py-2 md:px-4 md:py-2.5 rounded-lg transition duration-300 shadow-md ${userLinks.length >= 10 ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-700 hover:bg-sky-800'}`}
              >
                {loadingAction === 'add' ? (
                  <div className='flex items-center justify-center'><Loader size={24} className="animate-spin" /></div>
                ) : (userLinks.length >= 10 ? "10 Max" : t('addLink'))}
              </button>
            </form>
            <WarningModal />
          </div>
          {/* Links */}
          <div className='space-y-3 grid grid-cols-1'>
            {(loadingAll) ? (
              <div className='space-y-4 mt-3'>
                {[1, 2, 3, 4].map((mp, i) => (
                  <div key={i} className='w-full h-20 bg-gray-300 animate-pulse rounded-xl'></div>
                ))}
              </div>
            ) :
              userLinks.length > 0 ? (
                userLinks.map((lnk, i) => (
                  <div
                    key={i}
                    className={`group flex justify-between items-center p-2.5 md:p-4 bg-white border rounded-xl hover:shadow-md transition-all duration-300 ${highlightedLinkId === lnk._id
                      ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200'
                      : 'border-gray-200'
                      }`}
                  >
                    <div className='flex items-center gap-2 md:gap-4 overflow-hidden'>
                      <div className='p-1.5 md:p-3 bg-teal-50 border border-teal-100 rounded-full text-teal-600 shrink-0'>
                        <Link className="w-3.5 h-3.5 md:w-5 md:h-5" />
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <p className='text-xs md:text-base font-semibold break-all text-gray-800'>{lnk.namelink}</p>
                        <a href={lnk.link} target="_blank" rel="noreferrer" className='text-[10px] md:text-xs text-blue-500 hover:text-blue-700 hover:underline truncate block max-w-full'>
                          {lnk.link}
                        </a>
                      </div>
                    </div>
                    <div className='flex items-center gap-1.5 md:gap-2 shrink-0 ml-1.5 md:ml-2'>
                      <button
                        onClick={() => {
                          EditLink(lnk);
                        }}
                        className='flex items-center gap-1.5 md:gap-2 px-1.5 py-1 md:px-3 md:py-2 text-[10px] md:text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all duration-200'
                        title={t('edit') || "Edit"}
                      >
                        <Edit3 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span className="hidden sm:inline">{t('edit') || "Edit"}</span>
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(lnk._id);
                          setConfirmOpen(true);
                        }}
                        disabled={loadingAction !== null}
                        className='flex items-center gap-1.5 md:gap-2 px-1.5 py-1 md:px-3 md:py-2 text-[10px] md:text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        title={t('delete') || "Delete"}
                      >
                        {loadingAction === `delete-${lnk._id}` ? (
                          <Loader size={10} className="animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            <span className="hidden sm:inline">{t('delete') || "Delete"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p>{t('noLinksFound') || "No links added yet."}</p>
                </div>
              )
            }
          </div>
        </section>
      </div>
      <ConfirmModal
        isOpen={confirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message={
          <div className="flex flex-col gap-2">
            <p>{t('deleteLinkConfirm')}</p>
            {deleteId && (() => {
              const item = userLinks.find(l => l._id === deleteId);
              if (!item) return null;
              return (
                <div className="bg-red-50 p-2 md:p-3 rounded-lg border border-red-100 text-end flex flex-col items-center">
                  <p className="font-bold text-gray-900 text-sm break-all text-center">{item.namelink}</p>
                  <p className="text-gray-500 text-xs break-all">{item.link}</p>
                </div>
              );
            })()}
          </div>
        }
      />

      {/* Edit Modal */}
      {isEditModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative" dir={userDetails?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className={`absolute top-4 ${userDetails?.displayLanguage === 'ar' ? 'left-4' : 'right-4'} text-gray-400 hover:text-gray-600 transition`}
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('updateLink') || "Update Link"}</h2>

            <form onSubmit={UpdateLink} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Title') || "Title"}</label>
                <input
                  type="text"
                  value={editNamelink}
                  onChange={(e) => setEditNamelink(e.target.value)}
                  required
                  placeholder={t('exampleWebsite')}
                  maxLength={100}
                  className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('Link') || "Link"}</label>
                <input
                  type="url"
                  value={editLinkUrl}
                  placeholder={t('exampleUrl')}
                  maxLength={100}
                  onChange={(e) => setEditLinkUrl(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all sm:text-sm"
                />
              </div>
              <button
                disabled={loadingAction !== null}
                type="submit"
                className="w-full text-white font-semibold px-4 py-2.5 rounded-lg transition duration-300 shadow-md bg-teal-600 hover:bg-teal-700"
              >
                {loadingAction === 'update' ? (
                  <div className='flex items-center justify-center'><Loader size={24} className="animate-spin" /></div>
                ) : (
                  t('updateLink') || "Update"
                )}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default EditUserLinks;
