import UserPortfolio from "../Components/UserPortfolio";
import { notFound } from "next/navigation";
import { generateUserMetadata } from "../lib/metadata";
import { fetchUserData } from "../lib/userUtils";


export async function generateMetadata({ params }) {

  const user = await fetchUserData(params.username);
  const portfolioUrl = `https://dgtportfolio.com/${params.username}`;
  return generateUserMetadata(user, portfolioUrl);
}

export default function Page({ params }) {
  return <UserPortfolio params={params} />;
}
