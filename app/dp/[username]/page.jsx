import { generateUserMetadata } from "../../../lib/metadata";
import { fetchUserData } from "../../../lib/userUtils";
import { DynamicUserPortfolio } from "../../components/portfolio/ClientWrappers";

export async function generateMetadata(props) {
  const params = await props.params;
  const user = await fetchUserData(params.username);
  const portfolioUrl = `https://dgtportfolio.com/${params.username}`;
  return generateUserMetadata(user, portfolioUrl);
}

export default async function Page(props) {
  const params = await props.params;
  return <DynamicUserPortfolio params={params} />;
}
