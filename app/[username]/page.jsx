import React from 'react'
import UserPortfolio from "../Components/UserPortfolio"
import { notFound } from 'next/navigation';
import { generateUserMetadata } from '../lib/metadata';

export async function generateMetadata({ params }) {
  const backendUrl = process.env.BACKEND_URL || 'https://dgt-portfolio-server.vercel.app';
  // 3️⃣ Fetch User Metadata
  if (params.username) {
    const res = await fetch(`${backendUrl}/users/metauser/${params.username}`);
    if (res.status === 404) notFound();
    const data = await res.json();
    if (data.status && data.user) {
      const user = data.user;
      const portfolioUrl = `https://dgtportfolio.com/${params.username}`;

      // Use utility function
      return generateUserMetadata(user, portfolioUrl);
    }
  }
}

function Page({ params }) {
  return <UserPortfolio params={params} />
}

export default Page
