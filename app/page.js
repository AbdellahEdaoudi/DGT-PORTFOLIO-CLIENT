import LandingPage from "./Components/LandingPage/LandingPage";
import { headers, cookies } from "next/headers";
import SubdomainClient from "./Components/SubdomainClient";
import { notFound } from "next/navigation";
import { getDictionary } from "./dictionaries/get-dictionary";

export async function generateMetadata() {
  const cookieStore = cookies();

  // ✔ Get host from middleware cookie first
  const host =
    cookieStore.get("x-current-host")?.value ||
    headers().get("host") ||
    "dgtportfolio.com";

  const reserved = ["dgtportfolio", "localhost:3000", "www", "localhost"];
  const subdomain = host.split(".")[0];
  let username = null;

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9999";

  // 1. Custom Domain
  const isCustomDomain =
    !host.includes("dgtportfolio.com") &&
    !host.includes("localhost") &&
    !host.includes("127.0.0.1") &&
    !host.includes("vercel.app");

  if (isCustomDomain) {
    try {
      const res = await fetch(
        `${backendUrl}/api/custom-domain/by-domain/${host}`,
        { cache: "no-store" }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.status && data.user) {
          username = data.user.username;
        }
      }
    } catch (err) {
      console.error("Metadata custom domain error:", err);
    }
  }

  // 2. Subdomain
  if (!username) {
    const isSub = subdomain && !reserved.includes(subdomain);
    if (isSub) username = subdomain;
  }

  // 3. Fetch User Metadata
  if (username) {
    const res = await fetch(
      `${backendUrl}/users/metauser/${username}`,
      { cache: "no-store" }
    );

    const data = await res.json();
    if (data.status) {
      const user = data.user;

      return {
        title: `${user.fullname} – Portfolio`,
        description: user.about,
        openGraph: {
          title: `${user.fullname} – Portfolio`,
          description: user.about,
          url: `https://${host}`,
          images: [user.urlimage],
        },
        twitter: {
          card: "summary_large_image",
          title: `${user.fullname} – Portfolio`,
          description: user.about,
          images: [user.urlimage],
        },
      };
    }
  }

  // Default Metadata
  return {
    title: "DGT Portfolio – Build Your Professional Portfolio",
    description: "Create a stunning portfolio in minutes.",
  };
}

export default async function Home() {
  const cookieStore = cookies();

  const host =
    cookieStore.get("x-current-host")?.value ||
    headers().get("host") ||
    "dgtportfolio.com";

  const reserved = ["dgtportfolio", "localhost:3000", "www", "localhost"];
  const subdomain = host.split(".")[0];
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9999";

  let username = null;
  let userSchema = null;

  // 1. Custom Domain
  const isCustomDomain =
    !host.includes("dgtportfolio.com") &&
    !host.includes("localhost") &&
    !host.includes("127.0.0.1") &&
    !host.includes("vercel.app");

  if (isCustomDomain) {
    const res = await fetch(
      `${backendUrl}/api/custom-domain/by-domain/${host}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    if (data.status && data.user) username = data.user.username;
  }

  // 2. Subdomain
  if (!username) {
    const isSub = subdomain && !reserved.includes(subdomain);
    if (isSub) username = subdomain;
  }

  // 3. Load Schema User Data
  if (username) {
    const res = await fetch(
      `${backendUrl}/users/metauser/${username}`,
      { cache: "no-store" }
    );

    if (res.status === 404) notFound();

    const data = await res.json();
    if (data.status) {
      const user = data.user;

      userSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": user.fullname,
        "jobTitle": user.category,
        "image": user.urlimage,
        "url": `https://${host}`,
        "description": user.about,
        "sameAs": Object.values(user.socials || {}).filter(Boolean),
      };
    }
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
