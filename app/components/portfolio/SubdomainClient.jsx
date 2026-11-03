"use client"
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { handleApiError } from "../../utils/apiErrorHandler";
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
import { MyContext } from '../../context/context'
import { getTranslation } from '../../translations/portfolio'
import MagicalLoader from '../MagicalLoader'
import AccountNotFound from "./AccountNotFound"
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
import Theme13 from '../themes/theme13'
import { useToast } from '../Toast'


export default function SubdomainClient({ username }) {
  const [userDetails, setUserDetails] = useState(null)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const { data } = useContext(MyContext)
  const currentUsername = data?.user?.username || ""
  const lang = userDetails?.displayLanguage || 'en';
  const [dictionary, setDictionary] = useState(null);
  const [notFound, setNotFound] = useState(false)
  const toast = useToast();

  useEffect(() => {
    const loadTranslation = async () => {
      const dict = await getTranslation(lang);
      setDictionary(dict);
    };
    loadTranslation();
  }, [lang]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const cacheKey = `subdomainData_${username}`;
        const cachedData = localStorage.getItem(cacheKey);

        let parsed = null;
        if (cachedData) {
          try {
            parsed = JSON.parse(cachedData);
            if (parsed?.user) {
              setUserDetails(parsed.user);
              setLoadingUsers(false);
            }
          } catch (e) {
            // Ignore cache parse error
          }
        }

        const params = parsed?.user?.updatedAt ? { lastUpdated: parsed.user.updatedAt } : {};
        const res = await axios.get(`${SERVER_URL}/api/users/${username}`, { params });

        if (res.data?.updated === false && parsed?.user) {
          return;
        }

        if (res.data?.user) {
          setUserDetails(res.data.user);

          localStorage.setItem(cacheKey, JSON.stringify({
            user: res.data.user,
            lastUpdated: Date.now()
          }));
        }

      } catch (error) {
        if (error.response) {
          const msg = error.response.data.message;
          const ownerUsername = error.response.data.username || username;
          if (error.response.status === 404) {
            if (msg === "User not found") {
              setNotFound(true);
            } else if (msg === "No payment found for this user" && currentUsername !== ownerUsername) {
              setNotFound(true);
            } else if (msg === "No payment found for this user" && currentUsername === ownerUsername) {
              toast.error(dictionary?.errors?.noPaymentFound || "No payment was found for your account. Please complete payment to continue.");
              window.location.href = "https://mylio.site/payment"
            }
          } else if (error.response.status === 403 && currentUsername !== ownerUsername) {
            setNotFound(true);
          } else if (error.response.status === 403 && currentUsername === ownerUsername) {
            toast.error(dictionary?.errors?.paymentNotActive || "Your payment is not active. Please complete payment to regain access.");
            window.location.href = "https://mylio.site/payment"
          } else {
            await handleApiError({ error, defaultErrorMsg: dictionary?.errors?.fetchingUserDetails || "Error fetching user details:", toast });
          }
        } else {
          await handleApiError({ error, defaultErrorMsg: dictionary?.errors?.networkError || "Network error:", toast });
        }
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [username, currentUsername]);

  if (loadingUsers) return <MagicalLoader />
  if (notFound) return <AccountNotFound />

  const renderTheme = () => {
    switch (userDetails?.theme) {
      case 1:
        return <Theme1 userDetails={userDetails} content={dictionary} />
      case 2:
        return <Theme2 userDetails={userDetails} content={dictionary} />
      case 3:
        return <Theme3 userDetails={userDetails} content={dictionary} />
      case 4:
        return <Theme4 userDetails={userDetails} content={dictionary} />
      case 5:
        return <Theme5 userDetails={userDetails} content={dictionary} />
      case 6:
        return <Theme6 userDetails={userDetails} content={dictionary} />
      case 7:
        return <Theme7 userDetails={userDetails} content={dictionary} />
      case 8:
        return <Theme8 userDetails={userDetails} content={dictionary} />
      case 9:
        return <Theme9 userDetails={userDetails} content={dictionary} />
      case 10:
        return <Theme10 userDetails={userDetails} content={dictionary} />
      case 11:
        return <Theme11 userDetails={userDetails} content={dictionary} />
      case 12:
        return <Theme12 userDetails={userDetails} content={dictionary} />
      case 13:
        return <Theme13 userDetails={userDetails} content={dictionary} />
      default:
        return userDetails ? <Theme1 userDetails={userDetails} content={dictionary} /> :
          <MagicalLoader />
    }
  }

  return <div>{renderTheme()}</div>
}
