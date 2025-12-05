import React from 'react'
import UserPortfolio from "../Components/UserPortfolio"
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const backendUrl = process.env.BACKEND_URL || 'https://dgt-portfolio-server.vercel.app';
  // 3️⃣ Fetch User Metadata
  if (params.username) {
    const res = await fetch(`${backendUrl}/users/metauser/${params.username}`, {
      cache: 'no-store',
    });
    if (res.status === 404) notFound();
    const data = await res.json();
    if (data.status && data.user) {
      const user = data.user;
      const portfolioUrl = `https://dgtportfolio.com/${params.username}`;

      return {
        title: `${user.fullname} – Portfolio`,
        description: user.about || `Check out ${user.fullname}'s professional portfolio.`,
        keywords: [user.fullname, user.category, 'portfolio', 'professional', ...(user.skills || [])],
        authors: [{ name: user.fullname }],
        creator: user.fullname,
        publisher: 'DGT Portfolio',
        icons: {
          icon: user.urlimage,
          shortcut: user.urlimage,
          apple: user.urlimage,
        },
        openGraph: {
          type: 'profile',
          title: `${user.fullname} – Portfolio`,
          description: user.about || `Check out ${user.fullname}'s professional portfolio.`,
          url: portfolioUrl,
          siteName: 'DGT Portfolio',
          locale: user.displayLanguage === 'ar' ? 'ar_AR' : 'en_US',
          images: [
            {
              url: user.urlimage,
              alt: `${user.fullname}'s Profile Picture`,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${user.fullname} – Portfolio`,
          description: user.about || `Check out ${user.fullname}'s professional portfolio.`,
          images: [user.urlimage],
          creator: user.socials?.twitter || undefined,
        },
      };
    }
  }
}

function Page({ params }) {
  return <UserPortfolio params={params} />
}

export default Page
