"use client"
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { createContext, useEffect, useState } from 'react';

import GlobalLoader from '../components/GlobalLoader';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [userLinks, setUserLinks] = useState([]);
  const { data, status } = useSession()
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

  // Handle Scroll Locking & Reset
  useEffect(() => {
    if (status === "loading" || (status === "authenticated" && loadingAll)) {
      // Lock scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Unlock scroll and reset position
      document.body.style.overflow = 'unset';
      window.scrollTo(0, 0);
    }

    return () => { document.body.style.overflow = 'unset'; }
  }, [status, loadingAll]);

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
      {(status === "loading" || (status === "authenticated" && loadingAll)) && <GlobalLoader />}
      {children}
    </MyContext.Provider>
  );
};
