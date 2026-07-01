import { DynamicUserPortfolio } from "../../components/portfolio/ClientWrappers";

async function fetchUserData(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return data?.status ? data.user : null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(props) {
  const params = await props.params;
  const user = await fetchUserData(`https://dgt-portfolio-server.vercel.app/users/metauser/${params.username}`);
  const user_portfolio_url = `https://dgtportfolio.com/dp/${params.username}`;

  if (user) {
    return {
      title: `${user.fullname} | ${user.category} Portfolio`,
      description: `Explore ${user.fullname}'s professional portfolio and discover projects, technical expertise, work experience, and professional services as a ${user.category}. Connect for collaborations and new opportunities.`,
      keywords: [
        user.fullname,
        user.category,
        `${user.fullname} Portfolio`,
        `${user.category} Portfolio`,
        `${user.fullname} Projects`,
        `${user.fullname} Skills`,
        "Professional Portfolio",
        "Portfolio Website",
      ],
      icons: { icon: user.urlimage, shortcut: user.urlimage, apple: user.urlimage },
      openGraph: {
        title: `${user.fullname} | ${user.category} Portfolio`,
        description: `Explore ${user.fullname}'s professional portfolio and discover projects, technical expertise, work experience, and professional services as a ${user.category}. Connect for collaborations and new opportunities.`,
        url: user_portfolio_url,
        siteName: "DGT Portfolio",
        images: [{ url: user.urlimage, alt: `${user.fullname}'s Profile Picture` }],
        locale: user.displayLanguage === 'ar' ? 'ar_AR' : 'en_US',
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title: `${user.fullname} | ${user.category} Portfolio`,
        description: `Explore ${user.fullname}'s professional portfolio and discover projects, technical expertise, work experience, and professional services as a ${user.category}. Connect for collaborations and new opportunities.`,
        images: [user.urlimage],
      },
      alternates: {
        canonical: user_portfolio_url,
      },
    };
  } else {
    return {
      alternates: {
        canonical: "https://dgtportfolio.com",
        languages: {
          'en': 'https://dgtportfolio.com/en',
          'es': 'https://dgtportfolio.com/es',
          'fr': 'https://dgtportfolio.com/fr',
          'ar': 'https://dgtportfolio.com/ar',
          'de': 'https://dgtportfolio.com/de',
          'ru': 'https://dgtportfolio.com/ru',
          'ja': 'https://dgtportfolio.com/ja',
          'zh': 'https://dgtportfolio.com/zh',
          'nl': 'https://dgtportfolio.com/nl',
          'pt': 'https://dgtportfolio.com/pt',
          'it': 'https://dgtportfolio.com/it',
          'tr': 'https://dgtportfolio.com/tr',
          'ko': 'https://dgtportfolio.com/ko',
          'hi': 'https://dgtportfolio.com/hi',
          'id': 'https://dgtportfolio.com/id',
          'pl': 'https://dgtportfolio.com/pl',
          'sv': 'https://dgtportfolio.com/sv',
          'vi': 'https://dgtportfolio.com/vi',
        },
      },
    };
  }
}

export default async function Page(props) {
  const params = await props.params;
  return <div>
    <DynamicUserPortfolio username={params.username} />
  </div>;
}
