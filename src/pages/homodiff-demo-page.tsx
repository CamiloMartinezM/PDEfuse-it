import ImageUploader from "../components/forms/image-uploader";
import PageLayout from "../components/page-layout";

export default function HomogeneousDiffusionDemoPage() {
    return (
        <PageLayout>
            <h1 className="mb-4">Homogeneous Diffusion Demo</h1>
            <ImageUploader />
        </PageLayout>
    )
}