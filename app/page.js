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
  const isMainDomain =
    host === "dgtportfolio.com" ||
    host === "www.dgtportfolio.com" ||
    host === "localhost:3000" ||
    host === "dgtportfolio.vercel.app";

  const cleanHost = host.replace(/^www\./, "");

  const isSubdomain =
    cleanHost.endsWith("dgtportfolio.com") &&
    !isMainDomain;

  const isCustomDomain =
    !isSubdomain &&
    !isMainDomain &&
    !cleanHost.includes("localhost") &&
    !cleanHost.includes("vercel.app") &&
    !cleanHost.includes("ngrok") &&
    !cleanHost.startsWith("192.168.");

  return { isMainDomain, isSubdomain, isCustomDomain, cleanHost };
}

export async function generateMetadata() {
  // const host = "abdellah-edaoudi.dgtportfolio.com"
  // const host = "abdellah-edaoudi.site"
  const headersList = await headers();
  const host = headersList.get("host") || "";
  console.log("DEBUG - Host:", host);
  const { isMainDomain, isSubdomain, isCustomDomain, cleanHost } = getDomainFlags(host);

  console.log("DEBUG - isMainDomain:", isMainDomain);
  console.log("DEBUG - isSubdomain:", isSubdomain);
  console.log("DEBUG - isCustomDomain:", isCustomDomain);

  let user = null;
  if (isSubdomain) {
    user = await fetchUserData(`https://dgt-portfolio-server.vercel.app/users/metauser/${cleanHost.split(".")[0]}`);
  }
  if (isCustomDomain) {
    user = await fetchUserData(`https://dgt-portfolio-server.vercel.app/users/metacustomdomain/${cleanHost}`);
  }

  if (user) {
    const username = user.username || cleanHost.split(".")[0];
    return {
      title: `${user.fullname} – Portfolio`,
      description: user.about || `Check out ${user.fullname}'s professional portfolio. View projects, skills, and contact information.`,
      keywords: [`${user.fullname}`, `${user.category}`, "Portfolio", "Professional", "Projects", "Skills"],
      icons: { icon: user.urlimage, shortcut: user.urlimage, apple: user.urlimage },
      openGraph: {
        title: `${user.fullname} – Portfolio`,
        description: user.about || `Check out ${user.fullname}'s professional portfolio. View projects, skills, and contact information.`,
        url: isSubdomain ? `https://${username}.dgtportfolio.com` : `https://${cleanHost}`,
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
        canonical: isSubdomain ? `https://${username}.dgtportfolio.com` : `https://${cleanHost}`,
      },
    };
  } else if (isMainDomain) {
    // Metadata for the Main Home Page (Default Language: English)
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
  // const host = "abdellah-edaoudi.dgtportfolio.com"
  // const host = "abdellah-edaoudi.site"
  const headersList = await headers();
  const host = headersList.get("host") || "";
  console.log("DEBUG - Home Host:", host);
  const { isSubdomain, isCustomDomain, cleanHost } = getDomainFlags(host);
  let userSchema = null;

  try {
    if (isSubdomain) {
      const user = await fetchUserData(`https://dgt-portfolio-server.vercel.app/users/metauser/${cleanHost.split(".")[0]}`);
      if (user) {
        userSchema = {
          "@context": "https://schema.org",
          "@type": "Person",
          name: user.fullname,
          jobTitle: user.category || "Professional",
          url: `https://${user.username || cleanHost.split(".")[0]}.dgtportfolio.com`,
          description: user.about,
          sameAs: Object.values(user.socials || {}).filter(Boolean),
        };
      }
    } else if (isCustomDomain) {
      const user = await fetchUserData(`https://dgt-portfolio-server.vercel.app/users/metacustomdomain/${cleanHost}`);
      if (user) {
        userSchema = {
          "@context": "https://schema.org",
          "@type": "Person",
          name: user.fullname,
          jobTitle: user.category || "Professional",
          url: `https://${cleanHost}`,
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
      {isSubdomain ? (
        <DynamicSubdomainClient username={cleanHost.split(".")[0]} />
      ) : isCustomDomain ? (
        <DynamicCustomDomainClient host={cleanHost} />
      ) : (
        <LandingPage lang={"en"} />
      )}
    </div>
  );
}
