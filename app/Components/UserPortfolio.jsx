"use client"
import React, { useContext, useEffect, useState } from 'react'
import Themeone from "./themes/themeone"
import ThemeTwo from "./themes/themetwo"
import ThemeThree from "./themes/themethree"
import ThemeFour from "./themes/themefour"
import ThemeFive from "./themes/themefive"
import ThemeSix from "./themes/themesix"
import ThemeSeven from "./themes/themeseven"
import ThemeEight from "./themes/themeeight"
import ThemeNine from "./themes/themenine"
import ThemeTen from "./themes/themeten"
import ThemeEleven from "./themes/themeeleven"
import axios from 'axios'
import AccountNotFound from "./AccountNotFound"
import MagicalLoader from './MagicalLoader'
import { MyContext } from '../Context/MyContext'

function UserPortfolio({ params }) {
    const [userDetails, setUserDetails] = useState(null)
    const [userLinks, setUserLinks] = useState([])
    const [loadingUsers, setLoadingUsers] = useState(true)
    const { EmailUser } = useContext(MyContext)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`/api/proxy/users/${params.username}`);

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
    }, [params.username, EmailUser]);

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
            case 6:
                return <ThemeSix userDetails={userDetails} userLinks={userLinks} />
            case 7:
                return <ThemeSeven userDetails={userDetails} userLinks={userLinks} />
            case 8:
                return <ThemeEight userDetails={userDetails} userLinks={userLinks} />
            case 9:
                return <ThemeNine userDetails={userDetails} userLinks={userLinks} />
            case 10:
                return <ThemeTen userDetails={userDetails} userLinks={userLinks} />
            case 11:
                return <ThemeEleven userDetails={userDetails} userLinks={userLinks} />
            default:
                return userDetails ? <Themeone userDetails={userDetails} userLinks={userLinks} /> :
                    <MagicalLoader />
        }
    }

    return <div>{renderTheme()}</div>
}

export default UserPortfolio
