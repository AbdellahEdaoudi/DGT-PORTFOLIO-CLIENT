import LandingPage from "./Components/LandingPage/LandingPage";
import { headers } from "next/headers";
import { getDictionary } from "./dictionaries/get-dictionary";
import dynamic from 'next/dynamic';

const SubdomainClient = dynamic(() => import('./Components/SubdomainClient'), { ssr: false });
const CustomDomainClient = dynamic(() => import('./Components/CustomDomainClient'), { ssr: false });

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
  const reserved = ["dgtportfolio", "localhost:3000", "www"];
  // isSubdomain
  const isSubdomain =
    (host.endsWith("dgtportfolio.com") || host.endsWith("localhost:3000")) &&
    host !== "dgtportfolio.com" &&
    host !== "localhost:3000" &&
    !reserved.includes(host.split(".")[0]);
  // isExternalCustomDomain
  const isExternalCustomDomain = !isSubdomain &&
    !host.includes("dgtportfolio.com") &&
    !host.includes("localhost") &&
    !host.includes("dgtportfolio.vercel.app");
  return { isSubdomain, isExternalCustomDomain };
}

export async function generateMetadata() {
  // const host = "abdellah-edaoudi.dgtportfolio.com"
  // const host = "abdellah-edaoudi.site"
  const host = headers().get("host");
  const { isSubdomain, isExternalCustomDomain } = getDomainFlags(host);
  console.log("isSubdomain : " + isSubdomain);
  console.log("isExternalCustomDomain : " + isExternalCustomDomain);
  let user = null;
  if (isSubdomain) {
    user = await fetchUserData(`https://dgt-portfolio-server.vercel.app/users/metauser/${host.split(".")[0]}`);
  }
  if (isExternalCustomDomain) {
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
  }
}

export default async function Home() {
  const host = headers().get("host");
  const { isSubdomain, isExternalCustomDomain } = getDomainFlags(host);
  let userSchema = null;

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
  } else if (isExternalCustomDomain) {
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

  const dict = await getDictionary("en");
  return (
    <div>
      {userSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(userSchema) }} />}
      {isSubdomain ? <SubdomainClient username={host.split(".")[0]} /> : isExternalCustomDomain ? <CustomDomainClient host={host} /> : <LandingPage dict={dict} />}
    </div>
  );
}
