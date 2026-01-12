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
  const cleanHost = host.replace(/^www\./, "");

  const isMainDomain =
    cleanHost === "dgtportfolio.com" ||
    cleanHost === "localhost:3000" ||
    cleanHost === "dgtportfolio.vercel.app";

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
        canonical: isSubdomain ? `https://${username}.dgtportfolio.com` : baseUrl,
      },
    };
  } else if (isMainDomain) {
    return {
      alternates: {
        canonical: baseUrl,
        languages: {
          'en': `${baseUrl}/en`,
          'es': `${baseUrl}/es`,
          'fr': `${baseUrl}/fr`,
          'ar': `${baseUrl}/ar`,
          'de': `${baseUrl}/de`,
          'ru': `${baseUrl}/ru`,
          'ja': `${baseUrl}/ja`,
          'zh': `${baseUrl}/zh`,
          'nl': `${baseUrl}/nl`,
          'pt': `${baseUrl}/pt`,
          'it': `${baseUrl}/it`,
          'tr': `${baseUrl}/tr`,
          'ko': `${baseUrl}/ko`,
          'hi': `${baseUrl}/hi`,
          'id': `${baseUrl}/id`,
          'pl': `${baseUrl}/pl`,
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
