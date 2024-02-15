import React, { useState } from 'react';
import { processImageWithHomogeneousDiffusion } from "../diffusion-algorithms/homogeneous-diffusion";
import { InputField } from "./input-field";

const ImageUploader = () => {
    const [image, setImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [iterations, setIterations] = useState<number>(10); // Default value
    const [tau, setTau] = useState<number>(0.25); // Default value

    const handleHomogeneousDiffusion = () => {
        if (!image) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const imageElement = new Image();

        imageElement.onload = () => {
            canvas.width = imageElement.width;
            canvas.height = imageElement.height;
            if (ctx) {
                ctx.drawImage(imageElement, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const processedImageData = processImageWithHomogeneousDiffusion(
                    imageData,
                    iterations,
                    tau
                );

                // Draw the processed image data back onto the canvas
                ctx.putImageData(processedImageData, 0, 0);

                // Convert the canvas to a data URL and update state
                const dataUrl = canvas.toDataURL();
                setProcessedImage(dataUrl);
            }
        };

        imageElement.src = image; // This is the data URL of the uploaded image
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();

            reader.onload = (event) => {
                if (event.target) {
                    console.log(event.target.result);
                    setImage(event.target.result as string);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="row g-5">
            <div className="col-md-6">
                <h3 className="text-muted">Test out Homogeneous diffusion!</h3>
                <p>Upload your own image...</p>
                <div>
                    <InputField
                        type="number"
                        label="Number of Iterations:"
                        className="input-style-class"
                        value={iterations}
                        onChange={(e) => setIterations(Number(e.target.value))}
                    />
                </div>
                <div>
                    <InputField
                        type="number"
                        label="Time-step:"
                        className="input-style-class"
                        value={tau}
                        onChange={(e) => setTau(Number(e.target.value))}
                        step="0.01"
                    />
                </div>
                <div>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {image && (
                        <>
                            <button onClick={handleHomogeneousDiffusion} disabled={!image}>
                                Apply Homogeneous Diffusion
                            </button>
                            <div style={{ marginTop: '1rem', display: 'flex' }}>
                                <div style={{ marginRight: '1rem', height: '300px' }}>
                                    <img src={image} alt="Uploaded Preview" style={{ maxWidth: '100%', height: '100%' }} />
                                </div>
                                {processedImage && (
                                    <div style={{ height: '300px' }}>
                                        <img src={processedImage} alt="Processed Upload" style={{ maxWidth: '100%', height: '100%' }} />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;
