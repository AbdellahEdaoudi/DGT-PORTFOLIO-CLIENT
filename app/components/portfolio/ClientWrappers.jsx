"use client"

import dynamic from 'next/dynamic';

const SubdomainClient = dynamic(() => import('./SubdomainClient'), { ssr: false });
export const DynamicSubdomainClient = (props) => {
    return <SubdomainClient {...props} />;
};

const UserPortfolio = dynamic(() => import('./UserPortfolio'), { ssr: false });

export const DynamicUserPortfolio = (props) => {
    return <UserPortfolio {...props} />;
};
