"use client"

import dynamic from 'next/dynamic';

const SubdomainClient = dynamic(() => import('./SubdomainClient'), { ssr: false });
const CustomDomainClient = dynamic(() => import('./CustomDomainClient'), { ssr: false });

export const DynamicSubdomainClient = (props) => {
    return <SubdomainClient {...props} />;
};

export const DynamicCustomDomainClient = (props) => {
    return <CustomDomainClient {...props} />;
};

const UserPortfolio = dynamic(() => import('./UserPortfolio'), { ssr: false });

export const DynamicUserPortfolio = (props) => {
    return <UserPortfolio {...props} />;
};
