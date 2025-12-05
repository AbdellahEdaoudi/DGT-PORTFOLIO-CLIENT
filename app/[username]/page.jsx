import React from 'react'
import UserPortfolio from "../Components/UserPortfolio"
import { notFound } from 'next/navigation';
import { generateUserMetadata } from '../lib/metadata';

import { headers } from 'next/headers';
import { fetchUserData } from '../lib/userUtils';

export async function generateMetadata({ params }) {
  const headerStore = headers();
  const host = headerStore.get('x-current-host') || headerStore.get('host');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://dgt-portfolio-server.vercel.app';

  // 3️⃣ Fetch User Metadata
  if (params.username) {
    const user = await fetchUserData(params.username, backendUrl);

    if (!user) return;

    // Determine portfolio URL
    let portfolioUrl = `https://dgtportfolio.com/${params.username}`;

    // If accessing via custom domain (not dgtportfolio.com), use the host as the URL
    if (host && !host.includes('dgtportfolio.com')) {
      portfolioUrl = `https://${host}`;
    }

    // Use utility function
    return generateUserMetadata(user, portfolioUrl);
  }
}

function Page({ params }) {
  return <UserPortfolio params={params} />
}

export default Page
