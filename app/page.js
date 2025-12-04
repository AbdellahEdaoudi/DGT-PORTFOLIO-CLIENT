import LandingPage from "./Components/LandingPage/LandingPage";
import { cookies } from 'next/headers';
import { notFound } from "next/navigation";
import { getDictionary } from "./dictionaries/get-dictionary";
import SubdomainClient from "./Components/SubdomainClient";

export async function generateMetadata() {
  const reserved = ["dgtportfolio", "localhost", "127.0.0.1", "www"];
  
  // 🔥 نستخدم hostname الحقيقي الذي وضعناه في middleware
  const cookieHost = cookies().get("real-host")?.value;
  const host = cookieHost || "dgtportfolio.com";

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9999';

  let username = null;

  // 1. Custom Domain check
  const isCustomDomain =
    !host.includes("dgtportfolio.com") &&
    !host.includes("localhost") &&
    !host.includes("127.0.0.1");

  if (isCustomDomain) {
    try {
      const res = await fetch(`${backendUrl}/api/custom-domain/user/${host}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status && data.user?.username) {
          username = data.user.username;
        }
      }
    } catch (err) {
      console.error("Error fetching custom domain metadata:", err);
    }
  }

  // 2. Subdomain
  const subdomain = host.split(".")[0];
  if (!username && subdomain && !reserved.includes(subdomain)) {
    username = subdomain;
  }

  // 3. Fetch user metadata
  if (username) {
    try {
      const res = await fetch(`${backendUrl}/users/metauser/${username}`, {
        cache: "no-store",
      });

      const data = await res.json();
      const user = data.user;

      if (data.status) {
        return {
          title: `${user.fullname} – Portfolio`,
          description:
            user.about ||
            `Check out ${user.fullname}'s professional portfolio.`,
          openGraph: {
            title: `${user.fullname} – Portfolio`,
            description:
              user.about ||
              `Check out ${user.fullname}'s professional portfolio.`,
            url: `https://${host}`,
            images: [user.urlimage],
          },
          twitter: {
            card: "summary_large_image",
            title: `${user.fullname} – Portfolio`,
            images: [user.urlimage],
          },
          alternates: {
            canonical: `https://${host}`,
          },
        };
      }
    } catch (err) {
      console.error("User metadata fetch error:", err);
    }
  }

  // Default Landing Page Metadata
  return {
    title: "DGT Portfolio - Build Your Professional Portfolio Online",
    description: "Create a modern online portfolio in minutes.",
  };
}

export default async function Home() {
  const reserved = ["dgtportfolio", "localhost:3000"];
  
  // 🔥 hostname الحقيقي من الـ middleware
  const cookieHost = cookies().get("real-host")?.value;
  const host = cookieHost || "dgtportfolio.com";

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  
  const subdomain = host.split(".")[0];

  let username = null;
  let userSchema = null;

  // Custom Domain
  const isCustomDomain =
    !host.includes("dgtportfolio.com") &&
    !host.includes("localhost:3000");

  if (isCustomDomain) {
    try {
      const res = await fetch(`${backendUrl}/api/custom-domain/user/${host}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.status && data.user?.username) {
        username = data.user.username;
      }
    } catch (err) {
      console.error("Custom domain error:", err);
    }
  }

  // Subdomain
  const isSubdomain = !username && subdomain && !reserved.includes(subdomain);
  if (isSubdomain) username = subdomain;

  // Load user schema
  if (username) {
    try {
      const res = await fetch(`${backendUrl}/users/metauser/${username}`, {
        cache: "no-store",
      });

      if (res.status === 404) notFound();

      const data = await res.json();
      const user = data.user;

      if (data.status) {
        userSchema = {
          "@context": "https://schema.org",
          "@type": "Person",
          name: user.fullname,
          jobTitle: user.category,
          image: user.urlimage,
          url: `https://${host}`,
          description: user.about,
          sameAs: Object.values(user.socials || {}).filter(Boolean),
        };
      }
    } catch (err) {
      console.error("Schema fetch error:", err);
    }
  } else {
    // DGT Portfolio Main Schema
    userSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "DGT Portfolio",
      url: "https://dgtportfolio.com",
      description: "Build a modern portfolio without code.",
    };
  }

  const dict = await getDictionary("en");

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
