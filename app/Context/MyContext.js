"use client"
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { createContext, useEffect, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
   const [userDetails, setUserDetails] = useState(null);
   const [userLinks, setUserLinks] = useState([]);
   const {data,status} = useSession()
   const EmailUser = data?.user?.email
   const [loadingAll, setLoadingAll] = useState(true);
   const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL ;
   
  
  // Fetch all data
useEffect(() => {
  const fetchAllData = async () => {
    try {
      const res = await axios.get(`/api/proxy/alldata`);
      setUserDetails(res.data.users || null);
      setUserLinks(res.data.links || [] );
    } catch (error) {
      console.error("Error fetching all data:", error);
    } finally {
      setLoadingAll(false);
    }
  };

  if (EmailUser) fetchAllData();
}, [EmailUser]);


  return (
    <MyContext.Provider
      value={{
        CLIENT_URL,
        userDetails,
        setUserDetails,
        userLinks,
        setUserLinks,
        EmailUser,
        loadingAll
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
