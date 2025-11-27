"use client"
import axios from 'axios'
import { CheckCheck, Loader } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
function Userinfo({ userData, setUserDetails }) {
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
      return setErrormsg("Username already exists")
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
        Saved successfully!
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
        setErrormsg(error.response.data.error)
      } else if (error.response?.status === 400) {
        setErrormsg("Username already exists")
      }
      // console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form >
      {/* Profile Image Section */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-2 md:gap-8">
        <div className="flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl border-2 border-gray-200 rounded-2xl p-6 w-full md:w-1/3">
          <Image
            onClick={() => {
              const PORTFOLIO = `https://${userData.username}.dgtportfolio.com`
              if (userData.username) {
                router.push(PORTFOLIO)
              } else if (!userData.username) {
                setErrormsg("Username is required to see your personal portfolio")
              }
            }}
            src={imagePreview}
            alt="Profile"
            className="rounded-full cursor-pointer w-32 h-32 md:w-40 md:h-40 object-cover border-4 border-teal-500 shadow-lg"
            width={160}
            height={160}
          />
          <label className="mt-4 bg-gradient-to-r from-teal-400 to-green-500 hover:from-teal-500 hover:to-green-600 text-white font-semibold rounded-full px-6 py-2 cursor-pointer transition duration-300 transform hover:scale-105">
            Upload Image
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
              setErrormsg("Username is required to see your personal portfolio")
            }
          }} className="text-3xl md:block hidden font-bold text-gray-800 text-center mb-6">
            {fullname || "Full Name"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
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
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
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
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
              <input
                type="text"
                value={country}
                maxLength={100}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2 border-2 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
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
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <input
              type="text"
              maxLength={100}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Developer, Designer"
              className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>
        </div>
      </div>
      {/* Submit Button */}
      <div className="flex justify-end py-4 border-b-2 border-gray-200">
        <button onClick={UpUserInfo}
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" /> Saving...
            </>
          ) : (
            "💾 Save"
          )}
        </button>
      </div>
    </form>
  )
}

export default Userinfo