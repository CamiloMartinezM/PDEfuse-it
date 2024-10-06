import DiffusionApplication from "../components/forms/diffusion-application";
import PageLayout from "../components/page-layout";

export default function DiffusionDemoPage() {
    return (
        <PageLayout>
            <div className="diffusion-demo-container">
                <h1 className="page-title">Test out a Diffusion Algorithm!</h1>
                <div className="diffusion-application-section">
                    <DiffusionApplication />
                </div>
            </div>
        </PageLayout>
    )
}