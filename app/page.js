import LandingPage from "./Components/LandingPage/LandingPage";
import { headers } from 'next/headers'
import SubdomainClient from "./Components/SubdomainClient"

export async function generateMetadata() {
  const reserved = ["dgtportfolio","localhost:3000"];
  const host = headers().get("host");
  const username = host.split(".")[0];
  const isSubdomain = username && !reserved.includes(username);

//   if (!isSubdomain) {
//   return {
//     title: "Dgt Portfoliosdd",
//     description: "Create your professional portfolio easily!",
//     icons: {
//       icon: "/LogoinQrcode.png",       
//       shortcut: "/LogoinQrcode.png", 
//       apple: "/LogoinQrcode.png",   
//     },
//   };
// }

  if (isSubdomain) {
  const res = await fetch(`https://dgt-portfolio-server.vercel.app/users/metauser/${username}`);
  const data = await res.json();
  const user = data.user;
  if (!user) {
    return {
      title: "User Not Found",
      description: "This portfolio does not exist.",
    };
  }

  return {
    title: `${user.fullname} - Portfolio`,
    description: user.about,
    icons: {
      icon: user.urlimage,       
      shortcut: user.urlimage, 
      apple: user.urlimage,   
    },
    openGraph: {
      title: `${user.fullname} - Portfolio`,
      description: user.about,
      url: `https://${username}.dgtportfolio.com`,
      images: [user.urlimage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.fullname} - Portfolio`,
      description: user.about,
      images: [user.urlimage],
    },
  };
  }
}



export default function Home() {
  const reserved = ["dgtportfolio","localhost:3000"];
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
