import PageHeader from "./page-header";
import PageFooter from "./page-footer";

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