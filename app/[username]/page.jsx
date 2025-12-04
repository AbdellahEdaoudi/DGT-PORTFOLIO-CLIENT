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
          return {
            title: `${user.fullname} – Portfolio`,
            description: user.about || `Check out ${user.fullname}'s professional portfolio.`,
            openGraph: {
              title: `${user.fullname} – Portfolio`,
              description: user.about,
              url: `https://dgtportfolio.com/${params.username}`,
              images: [user.urlimage],
            },
            twitter: {
              card: 'summary_large_image',
              title: `${user.fullname} – Portfolio`,
              description: user.about,
              images: [user.urlimage],
            },
          };
        }
      }
}

function Page({ params }) {
  return <UserPortfolio params={params} />
}

export default Page
