"use client"
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { createContext, useEffect, useState, useRef } from 'react';

import GlobalLoader from '../components/GlobalLoader';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [userLinks, setUserLinks] = useState([]);
  const [userContacts, setUserContacts] = useState([]);
  const [userPayment, setUserPayment] = useState(null);
  const { data, status } = useSession()
  const EmailUser = data?.user?.email || ""
  const [loadingAll, setLoadingAll] = useState(true);

  const stateRef = useRef({
    users: null,
    links: [],
    contacts: [],
    payment: null,
    lastUpdated: null
  });

  useEffect(() => {
    stateRef.current = {
      users: userDetails,
      links: userLinks,
      contacts: userContacts,
      payment: userPayment,
      lastUpdated: stateRef.current.lastUpdated
    };
  }, [userDetails, userLinks, userContacts, userPayment]);

  const updateLocalStorage = (key, value) => {
    if (!EmailUser) return;
    const newLastUpdated = Date.now();
    stateRef.current.lastUpdated = newLastUpdated;
    const currentData = { ...stateRef.current, [key]: value, lastUpdated: newLastUpdated };
    localStorage.setItem(`appData_${EmailUser}`, JSON.stringify(currentData));
  };

  const localSetUserDetails = (newData) => {
    const resolvedData = typeof newData === 'function' ? newData(stateRef.current.users) : newData;
    setUserDetails(resolvedData);
    updateLocalStorage('users', resolvedData);
  };

  const localSetUserLinks = (newData) => {
    const resolvedData = typeof newData === 'function' ? newData(stateRef.current.links) : newData;
    setUserLinks(resolvedData);
    updateLocalStorage('links', resolvedData);
  };

  const localSetUserContacts = (newData) => {
    const resolvedData = typeof newData === 'function' ? newData(stateRef.current.contacts) : newData;
    setUserContacts(resolvedData);
    updateLocalStorage('contacts', resolvedData);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const cacheKey = `appData_${EmailUser}`;
        const cachedData = localStorage.getItem(cacheKey);

        let parsed = null;
        if (cachedData) {
          parsed = JSON.parse(cachedData);
          
          try {
            const lastUpdateRes = await axios.get(`/api/proxy/last-updated`, {
              validateStatus: () => true
            });

            if (lastUpdateRes.status === 401) {
              window.location.href = "/api/auth/signin";
              return;
            }

            if (lastUpdateRes.data?.success && lastUpdateRes.data?.lastUpdated) {
              const serverTime = lastUpdateRes.data.lastUpdated;
              if (parsed.lastUpdated && parsed.lastUpdated >= serverTime) {
                setUserDetails(parsed.users || null);
                setUserLinks(parsed.links || []);
                setUserContacts(parsed.contacts || []);
                setUserPayment(parsed.payment || null);
                stateRef.current.lastUpdated = parsed.lastUpdated;
                setLoadingAll(false);
                return; 
              }
            }
          } catch (e) {
            console.error("Error checking last updated:", e);
          }

          setUserDetails(parsed.users || null);
          setUserLinks(parsed.links || []);
          setUserContacts(parsed.contacts || []);
          setUserPayment(parsed.payment || null);
          setLoadingAll(false);
        }

        const res = await axios.get(`/api/proxy/alldata`, {
          validateStatus: () => true
        });

        if (res.status === 401) {
          window.location.href = "/api/auth/signin";
          return;
        }

        const serverData = {
          users: res.data.users || null,
          links: res.data.links || [],
          contacts: res.data.contacts || [],
          payment: res.data.payment || null,
          lastUpdated: Date.now()
        };

        stateRef.current.lastUpdated = serverData.lastUpdated;
        setUserDetails(serverData.users);
        setUserLinks(serverData.links);
        setUserContacts(serverData.contacts);
        setUserPayment(serverData.payment);

        localStorage.setItem(cacheKey, JSON.stringify(serverData));

      } catch (error) {
        console.error("Error fetching your data:", error);
      } finally {
        setLoadingAll(false);
      }
    };

    if (EmailUser) fetchAllData();
  }, [EmailUser]);

  useEffect(() => {
    if (status === "loading" || (status === "authenticated" && loadingAll)) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      window.scrollTo(0, 0);
    }

    return () => { document.body.style.overflow = 'unset'; }
  }, [status, loadingAll]);

  return (
    <MyContext.Provider
      value={{
        userDetails,
        setUserDetails: localSetUserDetails,
        userPayment,
        userContacts,
        setUserContacts: localSetUserContacts,
        userLinks,
        setUserLinks: localSetUserLinks,
        EmailUser,
        loadingAll
      }}
    >
      {(status === "loading" || (status === "authenticated" && loadingAll)) && <GlobalLoader />}
      {children}
    </MyContext.Provider>
  );
};
