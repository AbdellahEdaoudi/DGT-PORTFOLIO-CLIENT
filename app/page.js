import LandingPage from "./Components/LandingPage/LandingPage";
import { headers } from "next/headers";
import SubdomainClient from "./Components/SubdomainClient";
import CustomDomainClient from "./Components/CustomDomainClient";
import { notFound } from "next/navigation";
import { getDictionary } from "./dictionaries/get-dictionary";

async function fetchUserData(url) {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data?.status ? data.user : null;
  } catch (error) {
    return null;
  }
}

function getDomainFlags(host) {
  const username = host.split(".")[0];
  const reserved = ["dgtportfolio", "localhost:3000", "www"];
  const isSubdomain =
    !host.startsWith("dgtportfolio") &&
    host.endsWith("dgtportfolio.com") &&
    host !== "dgtportfolio.com" &&
    username &&
    !reserved.includes(username);
  const isCustomDomain = host.includes("dgtportfolio.vercel.app") || host.includes("dgtportfolio.com") || host.includes("localhost");
  const isExternalCustomDomain = !isSubdomain && !isCustomDomain;
  return { username, isSubdomain, isExternalCustomDomain };
}

export async function generateMetadata() {
  const host = headers().get("host") || "";
  const { username, isSubdomain, isExternalCustomDomain } = getDomainFlags(host);
  console.log("username : "+ username);
  console.log("isSubdomain : "+ isSubdomain);
  console.log("isExternalCustomDomain : "+ isExternalCustomDomain);
  let user = null;
  if (isSubdomain) {
    user = await fetchUserData(`https://dgt-portfolio-server.vercel.app/users/metauser/${username}`);
  } else if (isExternalCustomDomain) {
    user = await fetchUserData(`https://dgt-portfolio-server.vercel.app/users/metacustomdomain/${host}`);
  }

  if (user) {
    return {
      title: `${user.fullname} – Portfolio`,
      description: user.about || `Check out ${user.fullname}'s professional portfolio. View projects, skills, and contact information.`,
      keywords: [`${user.fullname}`, `${user.category}`, "Portfolio", "Professional", "Projects", "Skills"],
      icons: { icon: user.urlimage, shortcut: user.urlimage, apple: user.urlimage },
      openGraph: {
        title: `${user.fullname} – Portfolio`,
        description: user.about || `Check out ${user.fullname}'s professional portfolio. View projects, skills, and contact information.`,
        url: isSubdomain ? `https://${user.username}.dgtportfolio.com` : `https://${host}`,
        siteName: "DGT Portfolio",
        images: [{ url: user.urlimage, alt: `${user.fullname}'s Profile Picture` }],
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
        canonical: isSubdomain ? `https://${user.username}.dgtportfolio.com` : `https://${host}`,
      },
    };
  }
}

export default async function Home() {
  const host = headers().get("host") || "";
  const { username, isSubdomain, isExternalCustomDomain } = getDomainFlags(host);

  let userSchema = null;

  if (isSubdomain) {
    const user = await fetchUserData(`https://dgt-portfolio-server.vercel.app/users/metauser/${username}`);
    if (!user) return notFound();
    userSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: user.fullname,
      jobTitle: user.category || "Professional",
      url: `https://${user.username}.dgtportfolio.com`,
      description: user.about,
      sameAs: Object.values(user.socials || {}).filter(Boolean),
    };
  } else if (isExternalCustomDomain) {
    const user = await fetchUserData(`https://dgt-portfolio-server.vercel.app/users/metacustomdomain/${host}`);
    if (!user) return notFound();
    userSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: user.fullname,
      jobTitle: user.category || "Professional",
      url: `https://${host}`,
      description: user.about,
      sameAs: Object.values(user.socials || {}).filter(Boolean),
    };
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
      {isSubdomain ? <SubdomainClient username={username} /> : isExternalCustomDomain ? <CustomDomainClient host={host} /> : <LandingPage dict={dict} />}
    </div>
  );
}
