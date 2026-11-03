"use client"
import { createContext, useEffect, useState } from 'react';
import GlobalLoader from '../components/GlobalLoader';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [data, setData] = useState({
    user: null,
    contacts: [],
    payment: null,
  });
  const [loadingAll, setLoadingAll] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Sync auth & data from localStorage (data_username)
  useEffect(() => {
    const loadUser = () => {
      if (typeof window !== "undefined") {
        let loadedData = null;
        try {
          const username = localStorage.getItem("username");
          if (username) {
            const stored = localStorage.getItem(`data_${username}`);
            if (stored) {
              const parsed = JSON.parse(stored);
              loadedData = parsed?.data ? parsed.data : parsed;
            }
          }
        } catch (e) {
          console.error("Failed to parse data from localStorage", e);
        }

        if (loadedData && loadedData.user) {
          setData({
            user: loadedData.user,
            contacts: Array.isArray(loadedData.contacts) ? loadedData.contacts : [],
            payment: loadedData.payment ?? null,
          });
        } else {
          setData({ user: null, contacts: [], payment: null });
        }
        setAuthInitialized(true);
      }
    };

    loadUser();

    window.addEventListener("auth-change", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("auth-change", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  return (
    <MyContext.Provider
      value={{
        data,
        setData,
        loadingAll,
        authInitialized
      }}
    >
      {loadingAll && data?.user && <GlobalLoader />}
      {children}
    </MyContext.Provider>
  );
};
