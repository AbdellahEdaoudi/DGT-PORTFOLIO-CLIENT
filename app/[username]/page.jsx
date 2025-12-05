import UserPortfolio from "../Components/UserPortfolio";
import { notFound } from "next/navigation";
import { generateUserMetadata } from "../lib/metadata";
import { fetchUserData } from "../lib/userUtils";

// ===========================
// 1️⃣  Generate Metadata (SSR)
// ===========================
import { headers } from 'next/headers';

export async function generateMetadata({ params }) {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://dgt-portfolio-server.vercel.app";

  const username = params.username;

  if (!username) {
    return {
      title: "User Not Found",
      description: "This portfolio does not exist.",
    };
  }

  // Fetch user data
  const user = await fetchUserData(username, backendUrl);
  if (!user) return notFound();

  // Determine Canonical URL
  // Middleware passes the original host in 'x-current-host'
  const headerList = headers();
  const currentHost = headerList.get('x-current-host') ||
    headerList.get('host') ||
    `dgtportfolio.com`;

  const isCustomDomain = currentHost !== 'dgtportfolio.com' &&
    !currentHost.includes('localhost') &&
    !currentHost.endsWith('.dgtportfolio.com'); // Optional: check if subdomain wants own URL vs main

  // Ideally, use the host the user requested
  // If it's a custom domain, 'currentHost' is 'abdellah.site' -> https://abdellah.site
  // If it's a subdomain, 'currentHost' is 'abdellah.dgtportfolio.com' -> https://abdellah.dgtportfolio.com
  // If it's the main domain, 'currentHost' is 'dgtportfolio.com' -> https://dgtportfolio.com/abdellah

  let portfolioUrl = `https://${currentHost}`;

  if (currentHost === 'dgtportfolio.com' || currentHost === 'www.dgtportfolio.com' || currentHost.includes('localhost')) {
    portfolioUrl = `${currentHost.includes('localhost') ? 'http' : 'https'}://${currentHost}/${username}`;
  }

  // Return metadata (OpenGraph + Twitter + Robots + Icons...)
  return generateUserMetadata(user, portfolioUrl);
}

// ===========================
// 2️⃣ Page Component
// ===========================
export default function Page({ params }) {
  return <UserPortfolio params={params} />;
}
