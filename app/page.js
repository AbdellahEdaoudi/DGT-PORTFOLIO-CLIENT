import LandingPage from "./components/LandingPage/LandingPage";
import { headers } from "next/headers";
import { DynamicSubdomainClient } from './components/portfolio/ClientWrappers';

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
  const reserved = ["mylio", "localhost", "www", "api", "admin"];
  // isSubdomain
  const isSubdomain =
    (host.endsWith(".mylio.site") || host.endsWith(".localhost:3000")) &&
    host !== "mylio.site" &&
    host !== "localhost:3000" &&
    !reserved.includes(host.split(".")[0]);

  const iswwwsubdomain = host.startsWith("www.") && !isSubdomain;
  return { isSubdomain, iswwwsubdomain };
}

export async function generateMetadata() {
  // const host = "abdellah-edaoudi.mylio.site"
  // const host = "abdellah-edaoudi.site"
  const headersList = await headers();
  const host = headersList.get("host");
  const { isSubdomain, iswwwsubdomain } = getDomainFlags(host);
  console.log("isSubdomain : " + isSubdomain);
  console.log("iswwwsubdomain : " + iswwwsubdomain);
  let user = null;
  if (isSubdomain) {
    user = await fetchUserData(`https://dgt-portfolio-server.vercel.app/users/metauser/${host.split(".")[0]}`);
  }

  if (user) {
    const username = user.username || host.split(".")[0];
    return {
      title: `${user.fullname} | ${user.category} Portfolio`,
      description: `Explore ${user.fullname}'s professional portfolio and discover projects, technical expertise, work experience, and professional services as a ${user.category}. Connect for collaborations and new opportunities.`,
      keywords: [
        user.fullname,
        user.category,
        `${user.fullname} Portfolio`,
        `${user.category} Portfolio`,
        `${user.fullname} Projects`,
        `${user.fullname} Skills`,
        "Professional Portfolio",
        "Portfolio Website",
      ],
      icons: { icon: user.urlimage, shortcut: user.urlimage, apple: user.urlimage },
      openGraph: {
        title: `${user.fullname} | ${user.category} Portfolio`,
        description: `Explore ${user.fullname}'s professional portfolio and discover projects, technical expertise, work experience, and professional services as a ${user.category}. Connect for collaborations and new opportunities.`,
        url: isSubdomain ? `https://${username}.mylio.site` : `https://${host}`,
        siteName: "DGT Portfolio",
        images: [{ url: user.urlimage, alt: `${user.fullname}'s Profile Picture` }],
        locale: user.displayLanguage === 'ar' ? 'ar_AR' : 'en_US',
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title: `${user.fullname} | ${user.category} Portfolio`,
        description: `Explore ${user.fullname}'s professional portfolio and discover projects, technical expertise, work experience, and professional services as a ${user.category}. Connect for collaborations and new opportunities.`,
        images: [user.urlimage],
      },
      alternates: {
        canonical: isSubdomain ? `https://${username}.mylio.site` : `https://${host}`,
      },
    };
  } else {
    return {
      alternates: {
        canonical: "https://mylio.site",
        languages: {
          'en': 'https://mylio.site/en',
          'es': 'https://mylio.site/es',
          'fr': 'https://mylio.site/fr',
          'ar': 'https://mylio.site/ar',
          'de': 'https://mylio.site/de',
          'ru': 'https://mylio.site/ru',
          'ja': 'https://mylio.site/ja',
          'zh': 'https://mylio.site/zh',
          'nl': 'https://mylio.site/nl',
          'pt': 'https://mylio.site/pt',
          'it': 'https://mylio.site/it',
          'tr': 'https://mylio.site/tr',
          'ko': 'https://mylio.site/ko',
          'hi': 'https://mylio.site/hi',
          'id': 'https://mylio.site/id',
          'pl': 'https://mylio.site/pl',
          'sv': 'https://mylio.site/sv',
          'vi': 'https://mylio.site/vi',
        },
      },
    };
  }
}

export default async function Home() {
  const headersList = await headers();
  const host = headersList.get("host");
  const { isSubdomain, iswwwsubdomain } = getDomainFlags(host);
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
          url: `https://${user.username || host.split(".")[0]}.mylio.site`,
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
        url: "https://mylio.site",
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
      {isSubdomain ? <DynamicSubdomainClient username={host.split(".")[0]} /> : iswwwsubdomain ? <LandingPage lang={"en"} /> : <LandingPage lang={"en"} />}
    </div>
  );
}
