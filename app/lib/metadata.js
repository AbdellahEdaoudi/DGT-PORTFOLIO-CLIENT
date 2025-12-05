/**
 * Generate user metadata for SEO and social media
 * @param {Object} user - User object from API
 * @param {string} url - The portfolio URL (subdomain or custom domain)
 * @returns {Object} Next.js metadata object
 */
export function generateUserMetadata(user, url) {
    if (!user) return null;

    const portfolioUrl = url || `https://${user.username}.dgtportfolio.com`;

    return {
        title: `${user.fullname} – Portfolio`,
        description: user.about || `Check out ${user.fullname}'s professional portfolio.`,
        keywords: [
            user.fullname,
            user.category,
            'portfolio',
            'professional',
            ...(user.skills || [])
        ],
        authors: [{ name: user.fullname }],
        creator: user.fullname,
        publisher: 'DGT Portfolio',
        icons: {
            icon: user.urlimage,
            shortcut: user.urlimage,
            apple: user.urlimage,
        },
        openGraph: {
            type: 'profile',
            title: `${user.fullname} – Portfolio`,
            description: user.about || `Check out ${user.fullname}'s professional portfolio.`,
            url: portfolioUrl,
            siteName: 'DGT Portfolio',
            locale: user.displayLanguage === 'ar' ? 'ar_AR' : 'en_US',
            images: [
                {
                    url: user.urlimage,
                    alt: `${user.fullname}'s Profile Picture`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${user.fullname} – Portfolio`,
            description: user.about || `Check out ${user.fullname}'s professional portfolio.`,
            images: [user.urlimage],
            creator: user.socials?.twitter || undefined,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

/**
 * Generate structured data (Schema.org) for user
 * @param {Object} user - User object from API
 * @param {string} url - The portfolio URL
 * @returns {Object} Schema.org JSON-LD object
 */
export function generateUserSchema(user, url) {
    if (!user) return null;

    const portfolioUrl = url || `https://${user.username}.dgtportfolio.com`;

    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: user.fullname,
        jobTitle: user.category,
        image: user.urlimage,
        url: portfolioUrl,
        description: user.about,
        email: user.email,
        telephone: user.phoneNumber,
        sameAs: Object.values(user.socials || {}).filter(Boolean),
    };
}
