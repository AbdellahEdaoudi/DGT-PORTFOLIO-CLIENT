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
  const user_portfolio_url = `https://mylio.site/dp/${params.username}`;

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
        canonical: "https://mylio.site",
        languages: {
          'en': 'https://mylio.site/en',
          'es': 'https://mylio.site/es',
          'fr': 'https://mylio.site/fr',
          'ar': 'https://mylio.site/ar',
          'de': 'https://mylio.site/de',
          'ru': 'https://mylio.site/ru',
          'ja': 'https://mylio.site/ja',
          'zh': 'https://mylio.site/zh',
          'nl': 'https://mylio.site/nl',
          'pt': 'https://mylio.site/pt',
          'it': 'https://mylio.site/it',
          'tr': 'https://mylio.site/tr',
          'ko': 'https://mylio.site/ko',
          'hi': 'https://mylio.site/hi',
          'id': 'https://mylio.site/id',
          'pl': 'https://mylio.site/pl',
          'sv': 'https://mylio.site/sv',
          'vi': 'https://mylio.site/vi',
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
