import dynamic from 'next/dynamic';
import { generateUserMetadata } from "../lib/metadata";
import { fetchUserData } from "../lib/userUtils";

const UserPortfolio = dynamic(() => import('../Components/UserPortfolio'), { ssr: false });

export async function generateMetadata({ params }) {

  const user = await fetchUserData(params.username);
  const portfolioUrl = `https://dgtportfolio.com/${params.username}`;
  return generateUserMetadata(user, portfolioUrl);
}

export default function Page({ params }) {
  return <UserPortfolio params={params} />;
}
