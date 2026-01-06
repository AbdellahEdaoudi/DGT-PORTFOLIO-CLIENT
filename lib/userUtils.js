/**
 * Get username from host (subdomain or custom domain)
 * @param {string} host - The current host
 * @param {string} backendUrl - Backend API URL
 * @returns {Promise<string|null>} Username or null
 */
export async function getUsernameFromHost(host, backendUrl) {
    const reserved = ['dgtportfolio', 'localhost:3000', 'www', 'localhost'];
    const subdomain = host.split('.')[0];
    let username = null;

    // 1️⃣ Custom Domain
    const isCustomDomain =
        !host.includes('dgtportfolio.com') &&
        !host.includes('localhost') &&
        !host.includes('127.0.0.1') &&
        !host.includes('vercel.app');

    if (isCustomDomain) {
        try {
            const res = await fetch(`${backendUrl}/api/custom-domain/by-domain/${host}`, {
                cache: 'no-store',
            });
            if (res.ok) {
                const data = await res.json();
                if (data.status && data.user) {
                    username = data.user.username;
                }
            }
        } catch (err) {
            console.error('Error fetching custom domain:', err);
        }
    }

    // 2️⃣ Subdomain
    if (!username) {
        const isSubdomain = subdomain && !reserved.includes(subdomain);
        if (isSubdomain) username = subdomain;
    }

    return username;
}

/**
 * Fetch user data from backend
 * @param {string} username - Username to fetch
 * @param {string} backendUrl - Backend API URL
 * @returns {Promise<Object|null>} User object or null
 */
export async function fetchUserData(username) {
  if (!username) return null;
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://dgt-portfolio-server.vercel.app";

  try {
    const res = await fetch(`${backendUrl}/users/metauser/${username}`, {
      // SSR friendly caching
      next: { revalidate: 60 },
    });
    const data = await res.json();
    if (data.status && data.user) {
      return data.user;
    }else{
      return null;
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
    return null;
  }
}

