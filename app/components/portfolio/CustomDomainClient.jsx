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
import Theme13 from '../themes/theme13'

export default function CustomDomainClient({ host }) {
  const [userDetails, setUserDetails] = useState(null)
  const [userLinks, setUserLinks] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const { EmailUser } = useContext(MyContext)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`/api/proxy/custom-domain/${host}`);
        setUserDetails(res.data.user);
        setUserLinks(res.data.links || []);
      } catch (error) {
        if (error.response) {
          const msg = error.response.data.message;
          const ownerEmail = error.response.data.email || "not found";
          if (error.response.status === 404) {
            if (msg === "User not found") {
              setNotFound(true);
            } else if (msg === "No subscription found for this user" && EmailUser !== ownerEmail) {
              // setNoSubscription(true);
              setNotFound(true);
            } else if (msg === "No subscription found for this user" && EmailUser === ownerEmail) {
              alert("No subscription was found for your account. Please subscribe to continue.");
              window.location.href = "https://dgtportfolio.com/subscription"
            }
          } else if (error.response.status === 403 && EmailUser !== ownerEmail) {
            // setSubscriptionInactive(true);
            setNotFound(true);
          } else if (error.response.status === 403 && EmailUser === ownerEmail) {
            alert("Your subscription has expired or is inactive. Please renew it to regain access.");
            window.location.href = "https://dgtportfolio.com/subscription"
          } else {
            console.error("Error fetching user details:", error);
          }
        } else {
          console.error("Network error:", error);
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
