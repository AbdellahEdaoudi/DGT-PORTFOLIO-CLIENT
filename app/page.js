import LandingPage from "./Components/LandingPage/LandingPage";
import { headers } from 'next/headers'
import SubdomainClient from "./Components/SubdomainClient"
import { notFound } from "next/navigation";
import { getDictionary } from "./dictionaries/get-dictionary";

export async function generateMetadata() {
  const headersList = headers();
  // Get the host from the header set by middleware (most reliable) or fallback
  const host = headersList.get("x-current-host") || headersList.get("host") || "dgtportfolio.com";

  const reserved = ["dgtportfolio", "localhost:3000", "www", "localhost"];
  const subdomain = host.split(".")[0];
  let username = null;

  // Use environment variable for backend URL
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // 1. Check Custom Domain
  const isCustomDomain = !host.includes('dgtportfolio.com') &&
    !host.includes('localhost') &&
    !host.includes('127.0.0.1') &&
    !host.includes('vercel.app');

  if (isCustomDomain) {
    try {
      const res = await fetch(`${backendUrl}/api/custom-domain/user/${host}`, {
        next: { revalidate: 3600 },
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status && data.user) {
          username = data.user.username;
        }
      }
    } catch (error) {
      console.error("Metadata: Error fetching custom domain:", error);
    }
  }

  // 2. Check Subdomain (only if not a custom domain user already found)
  if (!username) {
    const isSubdomain = subdomain && !reserved.includes(subdomain);
    if (isSubdomain) {
      username = subdomain;
    }
  }

  if (username) {
    const res = await fetch(`${backendUrl}/users/metauser/${username}`, { cache: 'no-store' });
    const data = await res.json();
    const user = data?.user;
    if (data.status) {
      return {
        title: `${user.fullname} – Portfolio`,
        description: user.about || `Check out ${user.fullname}'s professional portfolio. View projects, skills, and contact information.`,
        keywords: [`${user.fullname}`, `${user.category}`, "Portfolio", "Professional", "Projects", "Skills"],
        icons: {
          icon: user.urlimage,
          shortcut: user.urlimage,
          apple: user.urlimage,
        },
        openGraph: {
          title: `${user.fullname} – Portfolio`,
          description: user.about || `Check out ${user.fullname}'s professional portfolio. View projects, skills, and contact information.`,
          url: `https://${host}`,
          siteName: "DGT Portfolio",
          images: [
            {
              url: user.urlimage,
              alt: `${user.fullname}'s Profile Picture`,
            },
          ],
          locale: "en_US",
          type: "profile",
        },
        twitter: {
          card: "summary_large_image",
          title: `${user.fullname} – Portfolio`,
          description: user.about || `Check out ${user.fullname}'s professional portfolio. View projects, skills, and contact information.`,
          images: [user.urlimage],
        },
        alternates: {
          canonical: `https://${host}`,
        },
      };
    }
  }

  // Default Metadata
  return {
    title: "DGT Portfolio - Build Your Professional Portfolio",
    description: "Create a stunning portfolio in minutes. No coding required.",
  };
}

export default async function Home() {
  const headersList = headers();
  const host = headersList.get("x-current-host") || headersList.get("host") || "dgtportfolio.com";

  const reserved = ["dgtportfolio", "localhost:3000", "www", "localhost"];
  const subdomain = host.split('.')[0];
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  let username = null;
  let userSchema = null;

  // 1. Check Custom Domain
  const isCustomDomain = !host.includes('dgtportfolio.com') &&
    !host.includes('localhost') &&
    !host.includes('127.0.0.1') &&
    !host.includes('vercel.app');

  if (isCustomDomain) {
    try {
      const res = await fetch(`${backendUrl}/api/custom-domain/user/${host}`, {
        next: { revalidate: 3600 },
        cache: 'no-store'
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status && data.user) {
          username = data.user.username;
        }
      }
    } catch (error) {
      console.error("Error fetching custom domain:", error);
    }
  }

  // 2. Check Subdomain
  if (!username) {
    const isSubdomain = subdomain && !reserved.includes(subdomain);
    if (isSubdomain) {
      username = subdomain;
    }
  }

  if (username) {
    try {
      const res = await fetch(`${backendUrl}/users/metauser/${username}`, {
        next: { revalidate: 3600 },
        cache: 'no-store'
      });

      if (res.status === 404) {
        notFound();
      }

      const data = await res.json();

      if (data.status && data.user) {
        const user = data.user;
        userSchema = {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": user.fullname,
          "jobTitle": user.category || "Professional",
          "image": user.urlimage,
          "url": `https://${host}`,
          "description": user.about,
          "sameAs": [
            user.socials?.linkedin,
            user.socials?.github,
            user.socials?.twitter,
            user.socials?.instagram,
            user.socials?.fb,
            user.socials?.youtube,
            user.socials?.telegram,
            user.socials?.whatsapp,
            user.socials?.reddit,
            user.socials?.twitch,
            user.socials?.snapchat,
          ].filter(Boolean)
        };
      }
    } catch (error) {
      console.error("Error fetching user data for schema:", error);
    }
  } else {
    // Schema for the Landing Page (The SaaS Tool itself)
    userSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "DGT Portfolio",
      "applicationCategory": "DesignApplication",
      "operatingSystem": "Web",
      "url": "https://dgtportfolio.com",
      "description": "Build a clean, modern portfolio in minutes. No code required.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "120"
      }
    };
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
      {username ? (
        <SubdomainClient username={username} />
      ) : (
        <LandingPage dict={dict} />
      )}
    </div>
  );
}
