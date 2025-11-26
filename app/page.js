import LandingPage from "./Components/LandingPage/LandingPage";
import { headers } from 'next/headers'
import SubdomainClient from "./Components/SubdomainClient"

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
              width: 800,
              height: 600,
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
      };
    }
  }
}


export default function Home() {
  const reserved = ["dgtportfolio", "localhost:3000", "www"];
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
