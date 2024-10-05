import React from 'react';
import PageFooter from './page-footer';
import PageHeader from './page-header';

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    return (
        <div className="page-layout col-lg-10 mx-auto p-3 py-md-5">
            <PageHeader />
            <div>
                <main className="main-content">
                    {children}
                </main>
            </div>
            <PageFooter />
        </div>
    );
};

export default PageLayout;