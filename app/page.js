import LandingPage from './Components/LandingPage/LandingPage';
import { headers, cookies } from 'next/headers';
import SubdomainClient from './Components/SubdomainClient';
import { notFound } from 'next/navigation';
import { getDictionary } from './dictionaries/get-dictionary';

export async function generateMetadata() {
  const cookieStore = cookies();
  const headerStore = headers();

  // ✅ Get host from cookie first, then header, fallback
  const host =
    cookieStore.get('x-current-host')?.value ||
    headerStore.get('x-current-host') ||
    headerStore.get('host') ||
    'dgtportfolio.com';

  const reserved = ['dgtportfolio', 'localhost:3000', 'www', 'localhost'];
  const subdomain = host.split('.')[0];
  let username = null;

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // 1️⃣ Custom Domain
  const isCustomDomain =
    !host.includes('dgtportfolio.com') &&
    !host.includes('localhost') &&
    !host.includes('127.0.0.1') &&
    !host.includes('vercel.app');

  if (isCustomDomain) {
    try {
      const res = await fetch(`${backendUrl}/api/custom-domain/by-domain/${host}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status && data.user) {
          username = data.user.username;
        }
      }
    } catch (err) {
      console.error('Metadata custom domain error:', err);
    }
  }

  // 2️⃣ Subdomain
  if (!username) {
    const isSubdomain = subdomain && !reserved.includes(subdomain);
    if (isSubdomain) username = subdomain;
  }

  // 3️⃣ Fetch User Metadata
  if (username) {
    const res = await fetch(`${backendUrl}/users/metauser/${username}`, {
      cache: 'no-store',
    });
    if (res.status === 404) notFound();
    const data = await res.json();
    if (data.status && data.user) {
      const user = data.user;
      const portfolioUrl = user.customDomainVerified
        ? `https://${host}`
        : `https://${username}.dgtportfolio.com`;

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
              type: 'image/jpeg',
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
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
      };
    }
  }

  // Default Metadata
  return {
    title: 'DGT Portfolio – Build Your Professional Portfolio',
    description: 'Create a stunning portfolio in minutes.',
  };
}

export default async function Home() {
  const cookieStore = cookies();
  const headerStore = headers();

  const host =
    cookieStore.get('x-current-host')?.value ||
    headerStore.get('x-current-host') ||
    headerStore.get('host') ||
    'dgtportfolio.com';

  const reserved = ['dgtportfolio', 'localhost:3000', 'www', 'localhost'];
  const subdomain = host.split('.')[0];
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  let username = null;
  let userSchema = null;

  // 1️⃣ Custom Domain
  const isCustomDomain =
    !host.includes('dgtportfolio.com') &&
    !host.includes('localhost') &&
    !host.includes('127.0.0.1') &&
    !host.includes('vercel.app');

  if (isCustomDomain) {
    try {
      const res = await fetch(`${backendUrl}/api/custom-domain/by-domain/${host}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status && data.user) username = data.user.username;
      }
    } catch (err) {
      console.error('Error fetching custom domain:', err);
    }
  }

  // 2️⃣ Subdomain
  if (!username) {
    const isSubdomain = subdomain && !reserved.includes(subdomain);
    if (isSubdomain) username = subdomain;
  }

  // 3️⃣ Load Schema
  if (username) {
    try {
      const res = await fetch(`${backendUrl}/users/metauser/${username}`, {
        cache: 'no-store',
      });
      if (res.status === 404) notFound();
      const data = await res.json();
      if (data.status && data.user) {
        const user = data.user;
        userSchema = {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: user.fullname,
          jobTitle: user.category,
          image: user.urlimage,
          url: `${user.customDomainVerified ? `https://${host}` : `https://${username}.dgtportfolio.com`}`,
          description: user.about,
          sameAs: Object.values(user.socials || {}).filter(Boolean),
        };
      }
    } catch (err) {
      console.error('Error fetching user schema:', err);
    }
  }

  const dict = await getDictionary('en');

  return (
    <div>
      {userSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(userSchema) }}
        />
      )}
      {username ? <SubdomainClient username={username} /> : <LandingPage dict={dict} />}
    </div>
  );
}
