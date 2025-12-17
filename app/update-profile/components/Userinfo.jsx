"use client"
import axios from 'axios'
import { CheckCheck, Loader, FileDown } from '../../Components/Icons'
import { PDFDownloadLink } from '@react-pdf/renderer'
import ResumePdf from './ResumePdf'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from '../../lib/translations'

function Userinfo({ userData, setUserDetails }) {
  const { t } = useTranslation(userData?.displayLanguage || 'en')
  const user = userData || {}
  const [imagePreview, setImagePreview] = useState(user.urlimage || "")
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fullname, setFullname] = useState(user.fullname || "")
  const [email, setEmail] = useState(user.email || "")
  const [username, setUsername] = useState(user.username || "")
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "")
  const [country, setCountry] = useState(user.country || "")
  const [category, setCategory] = useState(user.category || "")
  const [errormsg, setErrormsg] = useState("")
  const router = useRouter()

  // Handle image upload with automatic compression
  const handleImageUpload = (e) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files?.[0];
      if (file) {
        setErrormsg(""); // Clear any previous errors

        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new window.Image();
          img.onload = () => {
            // Create canvas to compress image
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions to reduce file size
            const maxSize = 1200; // Max width/height
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

            // Compress image with quality adjustment
            let quality = 0.8;
            const targetSize = 200 * 1024; // 200KB

            const compressImage = (qual) => {
              canvas.toBlob((blob) => {
                if (blob.size > targetSize && qual > 0.1) {
                  // If still too large, reduce quality more
                  compressImage(qual - 0.1);
                } else {
                  // Convert blob to file
                  const compressedFile = new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                  });

                  // Create preview
                  const previewReader = new FileReader();
                  previewReader.onloadend = () => {
                    setImagePreview(previewReader.result);
                    setImageFile(compressedFile);
                  };
                  previewReader.readAsDataURL(compressedFile);
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

  // Submit form
  const UpUserInfo = async (e) => {
    if (!username) {
      return setErrormsg(t('usernameExists'))
    }
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      // Basic fields
      formData.append("fullname", fullname);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("phoneNumber", phoneNumber);
      formData.append("country", country);
      formData.append("category", category);
      formData.append("urlimage", imageFile || imagePreview || "");

      await axios.put(`/api/proxy/users/update/user-info`, formData);
      toast(<p className='flex gap-3 items-center'><CheckCheck className="text-teal-500" />
        {t('savedSuccessfully')}
      </p>, {
        autoClose: 2000,
      })
      setUserDetails(prev => ({
        ...(prev || {}),
        fullname,
        email,
        username,
        phoneNumber,
        country,
        category,
        urlimage: imagePreview || (prev?.urlimage || "")
      }));
      setErrormsg("")
    } catch (error) {
      if (error.response?.data?.error) {
        const errorData = error.response.data.error;
        // Check if errorData is an object with an 'error' property
        if (typeof errorData === 'object' && errorData.error) {
          setErrormsg(String(errorData.error));
        } else {
          setErrormsg(typeof errorData === 'object' ? JSON.stringify(errorData) : String(errorData));
        }
      } else if (error.response?.status === 400) {
        setErrormsg(t('usernameExists'))
      }
      // console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form dir={userData?.displayLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Profile Image Section */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-2 md:gap-8">
        <div className="flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl border-2 border-gray-200 rounded-2xl p-6 w-full md:w-1/3">
          <Image
            onClick={() => {
              const PORTFOLIO = `https://${userData.username}.dgtportfolio.com`
              if (userData.username) {
                router.push(PORTFOLIO)
              } else if (!userData.username) {
                setErrormsg(t('usernameRequired'))
              }
            }}
            src={imagePreview}
            alt="Profile"
            className="rounded-full cursor-pointer w-32 h-32 md:w-40 md:h-40 object-cover border-4 border-teal-500 shadow-lg"
            width={160}
            height={160}
            priority
          />
          <label className="mt-4 bg-gradient-to-r from-teal-400 to-green-500 hover:from-teal-500 hover:to-green-600 text-white font-semibold rounded-full px-6 py-2 cursor-pointer transition duration-300 transform hover:scale-105">
            {t('uploadImage')}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        {/* User Information */}
        <div className="text-xs md:text-base bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl border-2 border-gray-200 rounded-2xl p-6 w-full md:w-2/3 space-y-4">
          <h2 onClick={() => {
            const PORTFOLIO = `https://${userData.username}.dgtportfolio.com`
            if (userData.username) {
              router.push(PORTFOLIO)
            } else if (!userData.username) {
              setErrormsg(t('usernameRequired'))
            }
          }} className="text-3xl md:block hidden font-bold text-gray-800 text-center mb-6">
            {fullname || t('fullName')}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('fullName')}</label>
              <input
                type="text"
                value={fullname}
                maxLength={50}
                onChange={(e) => setFullname(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('username')}</label>
              <input
                type="text"
                value={username}
                maxLength={30}
                onChange={(e) => setUsername(e.target.value.replace(/[.\s/]/g, "").toLowerCase())}
                required
                className={`w-full px-4 py-2 border-2 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition
                  ${errormsg ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"}`}
              />
              {errormsg && (
                <p className="mt-1 text-red-500 text-sm font-medium">{errormsg}</p>
              )}
              {username ? (
                <p className="mt-1 ml-2 text-blue-500 text-xs font-medium">{`${username}.dgtportfolio.com`}</p>
              ) : (
                <p className="mt-1 ml-2 text-blue-500 text-xs font-medium">{`${t('username')}.dgtportfolio.com`}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('country')}</label>
              <input
                type="text"
                value={country}
                maxLength={100}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2 border-2 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('phone')}</label>
              <input
                type="tel"
                maxLength={100}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border-2 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">{t('specialization')}</label>
            <input
              type="text"
              maxLength={100}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={t('exampleSpecialization')}
              className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>
        </div>
      </div>
      {/* Submit Button */}
      <div className="flex justify-end py-4 border-b-2 border-gray-200 gap-4">
        <PDFDownloadLink
          document={<ResumePdf userData={userData} />}
          fileName={`cv.${userData?.username || 'resume'}.pdf`}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
        >
          {({ blob, url, loading, error }) => {
            if (error) {
              return (
                <>
                  <span className="text-red-500">{t('errorGeneratingPdf') || 'Error generating PDF'}</span>
                </>
              );
            }
            return loading ? (
              <>
                <Loader size={20} className="animate-spin" /> {t('loading') || 'Loading...'}
              </>
            ) : (
              <>
                <FileDown size={20} />
                {(() => {
                  const translations = {
                    en: 'Download CV',
                    fr: 'Télécharger CV',
                    es: 'Descargar CV',
                    ar: 'تحميل السيرة الذاتية',
                    de: 'Lebenslauf herunterladen',
                    ru: 'Скачать резюме',
                    ja: '履歴書をダウンロード',
                    zh: '下载简历',
                    nl: 'CV downloaden',
                    pt: 'Baixar CV',
                    it: 'Scarica CV',
                    hi: 'सीवी डाउनलोड करें',
                    tr: 'CV İndir',
                    ko: 'CV 다운로드',
                  };
                  return translations[userData?.displayLanguage] || translations['en'];
                })()}
              </>
            );
          }}
        </PDFDownloadLink>
        <button onClick={UpUserInfo}
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" /> {t('saving')}
            </>
          ) : (
            `💾 ${t('save')}`
          )}
        </button>
      </div>
    </form>
  )
}

export default Userinfo