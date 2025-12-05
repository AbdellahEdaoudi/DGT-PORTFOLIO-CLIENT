"use client"
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { createContext, useEffect, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
   const [userDetails, setUserDetails] = useState(null);
   const [userLinks, setUserLinks] = useState([]);
   const {data,status} = useSession()
   const EmailUser = data?.user?.email || ""
   const [loadingAll, setLoadingAll] = useState(true);   
  
  // Fetch all data
useEffect(() => {
  const fetchAllData = async () => {
    try {
      const res = await axios.get(`/api/proxy/alldata`, {
        validateStatus: () => true
      });

      if (res.status === 401) {
        window.location.href = "/api/auth/signin";
        return;
      }

      setUserDetails(res.data.users || null);
      setUserLinks(res.data.links || []);
      
    } catch (error) {
      console.error("Error fetching your data:", error);
    } finally {
      setLoadingAll(false);
    }
  };

  if (EmailUser) fetchAllData();
}, [EmailUser]);



  return (
    <MyContext.Provider
      value={{
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
