"use client"
import React, { useEffect, useState } from 'react'
import Themeone from "../Components/themes/themeone"
import ThemeTwo from "../Components/themes/themetwo"
import ThemeThree from "../Components/themes/themethree"
import ThemeFour from "../Components/themes/themefour"
import ThemeFive from "../Components/themes/themefive"
import axios from 'axios'
import AccountNotFound from "../Components/AccountNotFound"
import MagicalLoader from '../Components/MagicalLoader'

export const runtime = 'edge';

function Page({ params }) {
  const [userDetails, setUserDetails] = useState(null)
  const [userLinks, setUserLinks] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true)
      setNotFound(false)
      try {
        const res = await axios.get(`/api/proxy/users/${params.username}`)
        setUserDetails(res.data.user)
        setUserLinks(res.data.links || [])
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setNotFound(true)
        } else {
          console.error("Error fetching user details:", error)
        }
      } finally {
        setLoadingUsers(false)
      }
    }
    fetchUsers()
  }, [params.username])

  if (loadingUsers) return <MagicalLoader />
  if (notFound) return <AccountNotFound />

  const renderTheme = () => {
    switch (userDetails?.theme) {
      case 1:
        return <Themeone userDetails={userDetails} userLinks={userLinks} />
      case 2:
        return <ThemeTwo userDetails={userDetails} userLinks={userLinks} />
      case 3:
        return <ThemeThree userDetails={userDetails} userLinks={userLinks} />
      case 4:
        return <ThemeFour userDetails={userDetails} userLinks={userLinks} />
      case 5:
        return <ThemeFive userDetails={userDetails} userLinks={userLinks} />
      default:
        return userDetails ? <Themeone userDetails={userDetails} userLinks={userLinks} /> :
        <MagicalLoader />
    }
  }

  return <div>{renderTheme()}</div>
}

export default Page
