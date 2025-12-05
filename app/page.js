import LandingPage from './Components/LandingPage/LandingPage';
import { headers, cookies } from 'next/headers';
import SubdomainClient from './Components/SubdomainClient';
import { notFound } from 'next/navigation';
import { getDictionary } from './dictionaries/get-dictionary';
import { generateUserMetadata, generateUserSchema } from './lib/metadata';
import { getUsernameFromHost, fetchUserData } from './lib/userUtils';

export async function generateMetadata() {
  const cookieStore = cookies();
  const headerStore = headers();

  const host =
    cookieStore.get('x-current-host')?.value ||
    headerStore.get('x-current-host') ||
    headerStore.get('host') ||
    'dgtportfolio.com';

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // Get username from host
  const username = await getUsernameFromHost(host, backendUrl);

  // Fetch user data
  if (username) {
    const user = await fetchUserData(username, backendUrl);

    if (!user) {
      notFound();
    }

    const portfolioUrl = user.customDomainVerified
      ? `https://${host}`
      : `https://${username}.dgtportfolio.com`;

    // Use utility function
    return generateUserMetadata(user, portfolioUrl);
  }

  // Default Metadata
  return {
    title: 'DGT Portfolio – Build Your Professional Portfolio',
    description: 'Create a stunning portfolio in minutes.',
  };
}

export default async function Home() {
  const cookieStore = cookies();
  const headerStore = headers();

  const host =
    cookieStore.get('x-current-host')?.value ||
    headerStore.get('x-current-host') ||
    headerStore.get('host') ||
    'dgtportfolio.com';

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  let userSchema = null;

  // Get username from host
  const username = await getUsernameFromHost(host, backendUrl);

  // Load Schema
  if (username) {
    const user = await fetchUserData(username, backendUrl);

    if (!user) {
      notFound();
    }

    const portfolioUrl = user.customDomainVerified
      ? `https://${host}`
      : `https://${username}.dgtportfolio.com`;

    // Use utility function
    userSchema = generateUserSchema(user, portfolioUrl);
  }

  const dict = await getDictionary('en');

  return (
    <div>
      {userSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(userSchema) }}
        />
      )}
      {username ? <SubdomainClient username={username} /> : <LandingPage dict={dict} />}
    </div>
  );
}
