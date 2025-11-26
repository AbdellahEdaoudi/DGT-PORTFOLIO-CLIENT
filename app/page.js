import LandingPage from "./Components/LandingPage/LandingPage";
import { headers } from 'next/headers'
import SubdomainClient from "./Components/SubdomainClient"
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const reserved = ["dgtportfolio", "localhost:3000", "www"];
  const host = headers().get("host");
  const username = host.split(".")[0];
  const isSubdomain = username && !reserved.includes(username);
  if (isSubdomain) {
    const res = await fetch(`https://dgt-portfolio-server.vercel.app/users/metauser/${username}`);
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
          url: `https://${username}.dgtportfolio.com`,
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
          canonical: `https://${username}.dgtportfolio.com`,
        },
      };
    }
  }
}


export default async function Home() {
  const reserved = ["dgtportfolio", "localhost:3000", "www"];
  const host = headers().get('host');
  const subdomain = host.split('.')[0];
  const isSubdomain = subdomain && !reserved.includes(subdomain);

  let userSchema = null;

  if (isSubdomain) {
    try {
      const res = await fetch(`https://dgt-portfolio-server.vercel.app/users/metauser/${subdomain}`, { next: { revalidate: 3600 } });

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
          "jobTitle": user.category || "Professional", // Assuming category holds the job title like 'Full Stack Developer'
          "image": user.urlimage,
          "url": `https://${subdomain}.dgtportfolio.com`,
          "description": user.about,
          "sameAs": [
            // Add social links if they exist in the user object
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
          ].filter(Boolean) // Remove undefined/null values
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

  return (
    <div>
      {userSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(userSchema) }}
        />
      )}
      {isSubdomain ? (
        <SubdomainClient username={subdomain} />
      ) : (
        <LandingPage />
      )}
    </div>
  );
}
