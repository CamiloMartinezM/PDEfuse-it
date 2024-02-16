import { ImageCanvas } from "../components/interaction-panels/image-canvas";
import PageLayout from "../components/page-layout";

function HomePage() {
    return (
        <PageLayout>
            <h1 className="mb-4">Homogenous Diffusion Demo</h1>
            <div className="row g-5">
                <div className="col-md-6">
                    <h3 className="text-muted">Ideas</h3>
                    <p>Cool ideas will be listed here</p>
                    <ul>
                        <li>Should we include comparison of gaussian blur with homo. diffusion?</li>
                    </ul>
                </div>

                <div className="col-md-6">
                    <h3 className="text-muted">Agenda</h3>
                    <p>Current todos will be listed here</p>
                    <ul>
                        <li>Write form components: slider, checkboxs, numboxs</li>
                        <li>Research how to render latex included markdown</li>
                        <li>Make Homo diffusion</li>
                    </ul>
                </div>
            </div>
            <div className="mt-4">
                <ImageCanvas data={Array(2500).fill(125)} width={50} height={50} />
            </div>
        </PageLayout>
    );
};

export default HomePage;
