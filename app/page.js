import LandingPage from "./Components/LandingPage/LandingPage";
import { headers } from 'next/headers'
import SubdomainClient from "./Components/SubdomainClient"



export default function Home() {
  const reserved = ["dgtportfolio.com","dgtportfolio.vercel.app","localhost:3000"];
  const host = headers().get('host');
  const subdomain = host.split('.')[0];
  const isSubdomain = subdomain && !reserved.includes(subdomain);

  return (
    <div>
      {isSubdomain ? (
        <SubdomainClient username={subdomain} />
      ) : (
        <LandingPage />
      )}
    </div>
  );
}
