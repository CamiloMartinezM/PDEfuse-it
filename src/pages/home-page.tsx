import DiffusionApplication from "../components/forms/diffusion-application";
import PageLayout from "../components/page-layout";

export default function DiffusionDemoPage() {
    return (
        <PageLayout>
            <h1 className="text-center font-bold mb-8 w-full text-3xl">Test out a Diffusion Algorithm!</h1>
            <div className="flex justify-center w-full">
                <DiffusionApplication />
            </div>
        </PageLayout>
    )
}