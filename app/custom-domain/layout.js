export const metadata = {
    title: "Custom Domain - DGT Portfolio",
    description: "Connect your own custom domain to your DGT Portfolio. Configure DNS settings and verify your domain ownership.",
    keywords: ["custom domain", "domain configuration", "DNS setup", "portfolio domain", "DGT Portfolio"],
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Custom Domain - DGT Portfolio",
        description: "Connect your own custom domain to your DGT Portfolio. Configure DNS settings and verify your domain ownership.",
        url: "https://dgtportfolio.com/custom-domain",
        siteName: "DGT Portfolio",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "Custom Domain - DGT Portfolio",
        description: "Connect your own custom domain to your DGT Portfolio.",
    },
};

export default function CustomDomainLayout({ children }) {
    return children;
}
