import React from 'react';
import PageFooter from './page-footer';
import PageHeader from './page-header';

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col relative max-h-screen min-h-screen mx-auto p-10">
            {/* <main className="justify-center flex overflow-hidden"> */}
            <PageHeader />
            {children}
            <PageFooter />
            {/* </main> */}
        </div>
    );
};

export default PageLayout;