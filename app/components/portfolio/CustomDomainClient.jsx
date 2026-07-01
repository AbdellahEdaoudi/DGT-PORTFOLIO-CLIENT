"use client"
import React, { useContext, useEffect, useState } from 'react'
import Theme1 from "../themes/theme1"
import Theme2 from "../themes/theme2"
import Theme3 from "../themes/theme3"
import Theme4 from "../themes/theme4"
import Theme5 from "../themes/theme5"
import Theme6 from "../themes/theme6"
import Theme7 from "../themes/theme7"
import Theme8 from "../themes/theme8"
import Theme9 from "../themes/theme9"
import Theme10 from "../themes/theme10"
import Theme11 from "../themes/theme11"
import Theme12 from "../themes/theme12"
import axios from 'axios'
import AccountNotFound from "./AccountNotFound"
import MagicalLoader from '../MagicalLoader'
import { MyContext } from '../../context/context'
import { getTranslation } from '../../translations/portfolio'
import Theme13 from '../themes/theme13'
import { useToast } from '../Toast'

export default function CustomDomainClient({ host }) {
  const [userDetails, setUserDetails] = useState(null)
  const [userLinks, setUserLinks] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const { EmailUser } = useContext(MyContext)
  const t = getTranslation(userDetails?.displayLanguage || 'en');
  const [notFound, setNotFound] = useState(false)
  const toast = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const cacheKey = `customDomainData_${host}`;
        const cachedData = localStorage.getItem(cacheKey);

        let parsed = null;
        if (cachedData) {
          parsed = JSON.parse(cachedData);
          try {
            const lastUpdateRes = await axios.get(`/api/proxy/last-updated/customdomain/${host}`);
            if (lastUpdateRes.data?.success && lastUpdateRes.data?.lastUpdated) {
              const serverTime = lastUpdateRes.data.lastUpdated;
              const localTime = parsed.lastUpdated || 0;
              
              if (localTime >= serverTime) {
                setUserDetails(parsed.user);
                setUserLinks(parsed.links || []);
                setLoadingUsers(false);
                return;
              }
            }
          } catch (e) {
            console.error("Error checking last updated:", e);
          }
        }

        const res = await axios.get(`/api/proxy/custom-domain/${host}`);
        
        setUserDetails(res.data.user);
        setUserLinks(res.data.links || []);
        
        localStorage.setItem(cacheKey, JSON.stringify({
          user: res.data.user,
          links: res.data.links || [],
          lastUpdated: Date.now()
        }));
      } catch (error) {
        if (error.response) {
          const msg = error.response.data.message;
          const ownerEmail = error.response.data.email || "not found";
          if (error.response.status === 404) {
            if (msg === "User not found") {
              setNotFound(true);
            } else if (msg === "No payment found for this user" && EmailUser !== ownerEmail) {
              // setNoPayment(true);
              setNotFound(true);
            } else if (msg === "No payment found for this user" && EmailUser === ownerEmail) {
              toast.error(t("errors.noPaymentFound"));
              window.location.href = "https://dgtportfolio.com/payment"
            }
          } else if (error.response.status === 403 && EmailUser !== ownerEmail) {
            // setPaymentInactive(true);
            setNotFound(true);
          } else if (error.response.status === 403 && EmailUser === ownerEmail) {
            toast.error(t("errors.paymentNotActive"));
            window.location.href = "https://dgtportfolio.com/payment"
          } else {
            console.error(t("errors.fetchingUserDetails"), error);
          }
        } else {
          console.error(t("errors.networkError"), error);
        }
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [host, EmailUser]);

  if (loadingUsers) return <MagicalLoader />
  if (notFound) return <AccountNotFound />

  const renderTheme = () => {
    switch (userDetails?.theme) {
      case 1:
        return <Theme1 userDetails={userDetails} userLinks={userLinks} />
      case 2:
        return <Theme2 userDetails={userDetails} userLinks={userLinks} />
      case 3:
        return <Theme3 userDetails={userDetails} userLinks={userLinks} />
      case 4:
        return <Theme4 userDetails={userDetails} userLinks={userLinks} />
      case 5:
        return <Theme5 userDetails={userDetails} userLinks={userLinks} />
      case 6:
        return <Theme6 userDetails={userDetails} userLinks={userLinks} />
      case 7:
        return <Theme7 userDetails={userDetails} userLinks={userLinks} />
      case 8:
        return <Theme8 userDetails={userDetails} userLinks={userLinks} />
      case 9:
        return <Theme9 userDetails={userDetails} userLinks={userLinks} />
      case 10:
        return <Theme10 userDetails={userDetails} userLinks={userLinks} />
      case 11:
        return <Theme11 userDetails={userDetails} userLinks={userLinks} />
      case 12:
        return <Theme12 userDetails={userDetails} userLinks={userLinks} />
      case 13:
        return <Theme13 userDetails={userDetails} userLinks={userLinks} />
      default:
        return userDetails ? <Theme1 userDetails={userDetails} userLinks={userLinks} /> :
          <MagicalLoader />
    }
  }

  return <div>{renderTheme()}</div>
}