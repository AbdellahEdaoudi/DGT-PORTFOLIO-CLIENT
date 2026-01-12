import LandingPage from "./components/LandingPage/LandingPage";
import { headers } from "next/headers";
import { DynamicSubdomainClient, DynamicCustomDomainClient } from './components/portfolio/ClientWrappers';

async function fetchUserData(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return data?.status ? data.user : null;
  } catch (error) {
    return null;
  }
}

function getDomainFlags(host) {
  const reserved = ["dgtportfolio", "localhost","www","api","admin"];
  // isSubdomain
  const isSubdomain =
    (host.endsWith(".dgtportfolio.com") || host.endsWith(".localhost:3000")) &&
    host !== "dgtportfolio.com" &&
    host !== "localhost:3000" &&
    !reserved.includes(host.split(".")[0]);
  // isCustomDomain
  const isCustomDomain = !isSubdomain &&
    !host.includes("dgtportfolio.") &&
    !host.includes("localhost") &&
    !host.includes("192.168.") &&
    !host.includes("ngrok");
  
  const iswwwsubdomain = host.startsWith("www.") && !isSubdomain && !isCustomDomain;
  return { isSubdomain, isCustomDomain, iswwwsubdomain };
}

export async function generateMetadata() {
  // const host = "abdellah-edaoudi.dgtportfolio.com"
  // const host = "abdellah-edaoudi.site"
  const headersList = await headers();
  const host = headersList.get("host");
  const { isSubdomain, isCustomDomain, iswwwsubdomain } = getDomainFlags(host);
  console.log("isSubdomain : " + isSubdomain);
  console.log("isCustomDomain : " + isCustomDomain);
  console.log("iswwwsubdomain : " + iswwwsubdomain);
  let user = null;
  if (isSubdomain) {
    user = await fetchUserData(`https://dgt-portfolio-server.vercel.app/users/metauser/${host.split(".")[0]}`);
  }
  if (isCustomDomain) {
    user = await fetchUserData(`https://dgt-portfolio-server.vercel.app/users/metacustomdomain/${host}`);
  }

  if (user) {
    const username = user.username || host.split(".")[0];
    return {
      title: `${user.fullname} – Portfolio`,
      description: user.about || `Check out ${user.fullname}'s professional portfolio. View projects, skills, and contact information.`,
      keywords: [`${user.fullname}`, `${user.category}`, "Portfolio", "Professional", "Projects", "Skills"],
      icons: { icon: user.urlimage, shortcut: user.urlimage, apple: user.urlimage },
      openGraph: {
        title: `${user.fullname} – Portfolio`,
        description: user.about || `Check out ${user.fullname}'s professional portfolio. View projects, skills, and contact information.`,
        url: isSubdomain ? `https://${username}.dgtportfolio.com` : `https://${host}`,
        siteName: "DGT Portfolio",
        images: [{ url: user.urlimage, alt: `${user.fullname}'s Profile Picture` }],
        locale: user.displayLanguage === 'ar' ? 'ar_AR' : 'en_US',
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title: `${user.fullname} – Portfolio`,
        description: user.about || `Check out ${user.fullname}'s professional portfolio. View projects, skills, and contact information.`,
        images: [user.urlimage],
      },
      alternates: {
        canonical: isSubdomain ? `https://${username}.dgtportfolio.com` : `https://${host}`,
      },
    };
  } else {
    return {
      alternates: {
        canonical: "https://dgtportfolio.com",
        languages: {
          'en': 'https://dgtportfolio.com/en',
          'es': 'https://dgtportfolio.com/es',
          'fr': 'https://dgtportfolio.com/fr',
          'ar': 'https://dgtportfolio.com/ar',
          'de': 'https://dgtportfolio.com/de',
          'ru': 'https://dgtportfolio.com/ru',
          'ja': 'https://dgtportfolio.com/ja',
          'zh': 'https://dgtportfolio.com/zh',
          'nl': 'https://dgtportfolio.com/nl',
          'pt': 'https://dgtportfolio.com/pt',
          'it': 'https://dgtportfolio.com/it',
          'tr': 'https://dgtportfolio.com/tr',
          'ko': 'https://dgtportfolio.com/ko',
          'hi': 'https://dgtportfolio.com/hi',
          'id': 'https://dgtportfolio.com/id',
          'pl': 'https://dgtportfolio.com/pl',
        },
      },
    };
  }
}

export default async function Home() {
  const headersList = await headers();
  const host = headersList.get("host");
  const { isSubdomain, isCustomDomain, iswwwsubdomain } = getDomainFlags(host);
  let userSchema = null;

  try {
    if (isSubdomain) {
      const user = await fetchUserData(`https://dgt-portfolio-server.vercel.app/users/metauser/${host.split(".")[0]}`);
      if (user) {
        userSchema = {
          "@context": "https://schema.org",
          "@type": "Person",
          name: user.fullname,
          jobTitle: user.category || "Professional",
          url: `https://${user.username || host.split(".")[0]}.dgtportfolio.com`,
          description: user.about,
          sameAs: Object.values(user.socials || {}).filter(Boolean),
        };
      }
    } else if (isCustomDomain) {
      const user = await fetchUserData(`https://dgt-portfolio-server.vercel.app/users/metacustomdomain/${host}`);
      if (user) {
        userSchema = {
          "@context": "https://schema.org",
          "@type": "Person",
          name: user.fullname,
          jobTitle: user.category || "Professional",
          url: `https://${host}`,
          description: user.about,
          sameAs: Object.values(user.socials || {}).filter(Boolean),
        };
      }
    } else {
      userSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "DGT Portfolio",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      url: "https://dgtportfolio.com",
      description: "Build a clean, modern portfolio in minutes. No code required.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "120" },
    };
    }
  } catch (error) {
    console.error("Error generating user schema:", error);
    // Continue rendering without schema
  }

  return (
    <div>
      {userSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(userSchema) }} />}
      {isSubdomain ? <DynamicSubdomainClient username={host.split(".")[0]} /> : isCustomDomain ? <DynamicCustomDomainClient host={host} /> : iswwwsubdomain ? <LandingPage lang={"en"} /> : <LandingPage lang={"en"} />}
    </div>
  );
}
