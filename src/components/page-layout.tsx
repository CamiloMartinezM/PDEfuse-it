import PageHeader from "./page-header";
import PageFooter from "./page-footer";
import React from "react";

export default function PageLayout({ children }: { children :React.ReactNode }) {
  return (
  <div className="col-lg-10 mx-auto p-3 py-md-5">
    <PageHeader />
    <main>
        { children }
    </main>
    <PageFooter />
    </div>
  );
};