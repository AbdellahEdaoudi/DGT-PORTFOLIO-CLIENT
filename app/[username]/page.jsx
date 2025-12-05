import UserPortfolio from "../Components/UserPortfolio";
import { notFound } from "next/navigation";
import { generateUserMetadata } from "../lib/metadata";
import { fetchUserData } from "../lib/userUtils";

// ===========================
// 1️⃣  Generate Metadata (SSR)
// ===========================
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

  // Build canonical public URL
  // لأن هذا المسار خاص فقط بـ: https://dgtportfolio.com/username
  const portfolioUrl = `https://dgtportfolio.com/${username}`;

  // Return metadata (OpenGraph + Twitter + Robots + Icons...)
  return generateUserMetadata(user, portfolioUrl);
}

// ===========================
// 2️⃣ Page Component
// ===========================
export default function Page({ params }) {
  return <UserPortfolio params={params} />;
}
