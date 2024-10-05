import ImageEditor from "../components/forms/image-editor";
import PageLayout from "../components/page-layout";

export default function DiffusionDemoPage() {
    return (
        <PageLayout>
            <div className="diffusion-demo-container">
                <h1 className="page-title">Test out a Diffusion Algorithm!</h1>
                <div className="image-editor-section">
                    <ImageEditor />
                </div>
            </div>
        </PageLayout>
    )
}