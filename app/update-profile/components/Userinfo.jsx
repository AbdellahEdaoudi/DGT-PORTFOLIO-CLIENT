"use client"
import axios from 'axios'
import { CheckCheck, Loader } from 'lucide-react'
import Image from 'next/image'
import React, { useContext } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
function Userinfo({userData,setUserDetails}) {
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
        // Handle image upload
    const handleImageUpload = (e) => {
        if (e.target && e.target.files && e.target.files.length > 0) {
            const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setImageFile(file);
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
        if (error.response?.status === 400){
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
       <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-8">
         <div className="flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl border-2 border-gray-200 rounded-2xl p-6 w-full md:w-1/3">
           <Image
             src={imagePreview}
             alt="Profile"
             className="rounded-full w-32 h-32 md:w-40 md:h-40 object-cover border-4 border-teal-500 shadow-lg"
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
           <h2 className="text-3xl md:block hidden font-bold text-gray-800 text-center mb-6">{fullname || "Your Name"}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
               <input
                 type="text"
                 value={fullname}
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
                 onChange={(e) => setUsername(e.target.value.replace(/[/\s]/g, "").toLowerCase())}
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
                 onChange={(e) => setCountry(e.target.value)}
                 className="w-full px-4 py-2 border-2 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
               />
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
               <input
                 type="tel"
                 value={phoneNumber}
                 onChange={(e) => setPhoneNumber(e.target.value)}
                 className="w-full px-4 py-2 border-2 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
               />
             </div>
             <div className="md:col-span-2">
               <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
               <input
                 type="text"
                 value={category}
                 onChange={(e) => setCategory(e.target.value)}
                 placeholder="e.g. Developer, Designer"
                 className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
               />
             </div>
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