import React, { useState } from 'react';
import DiffusionAlgorithmSettings, { algorithmFunctions } from './diffusion-algorithm-settings';

const ImageUploader = () => {
    // Image-Editor variables
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<{ name: string; dataUrl: string; }[]>([]);
    const [processedImage, setProcessedImage] = useState<string | null>(null);

    // Image-Display-Area variables
    const [comparisonMode, setComparisonMode] = useState('side-by-side');
    const [sliderPosition, setSliderPosition] = useState(50); // For the juxtaposed mode
    const [isMouseOver, setIsMouseOver] = useState(false);

    // Image-Processing-Algorithm variables
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
    const [algorithmParams, setAlgorithmParams] = useState({});

    /* Image-Display-Area functions */

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (comparisonMode === 'juxtaposed' && e.currentTarget) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const newSliderPosition = (x / rect.width) * 100;
            setSliderPosition(newSliderPosition);
            setIsMouseOver(true); // Mouse has entered the image
        }
    };

    const resetSlider = () => {
        setIsMouseOver(false); // Mouse has left the image
    };

    /* Image-Processing-Algorithm functions */

    const handleAlgorithmChange = (algorithmName: string, defaultParams: any) => {
        setSelectedAlgorithm(algorithmName);
        setAlgorithmParams(defaultParams);
    };

    /**
     * This function will use selectedAlgorithm and algorithmParams to apply the selected algorithm
     */
    const handleAlgorithmApplication = () => {
        if (!selectedImage || !selectedAlgorithm) return;

        // Use the selectedAlgorithm and algorithmParams to apply the algorithm
        const processFunction = algorithmFunctions[selectedAlgorithm as keyof typeof algorithmFunctions];

        if (!processFunction) {
            console.error(`No processing function found for algorithm: ${selectedAlgorithm}`);
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const imageElement = new Image();

        imageElement.onload = () => {
            canvas.width = imageElement.width;
            canvas.height = imageElement.height;
            if (ctx) {
                ctx.drawImage(imageElement, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const processedImageData = processFunction(imageData, ...Object.values<number | undefined>(algorithmParams));

                // Draw the processed image data back onto the canvas
                ctx.putImageData(processedImageData, 0, 0);

                // Convert the canvas to a data URL and update state
                const dataUrl = canvas.toDataURL();
                setProcessedImage(dataUrl);
            }
        };

        imageElement.src = selectedImage; // This is the data URL of the uploaded image
    };

    /* Image-Editor functions */

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files); // Convert FileList to Array
            let loadedImages: { name: string; dataUrl: string; }[] = []; // This will store the new images to be added to state

            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target) {
                        loadedImages.push({
                            name: file.name,
                            dataUrl: event.target.result as string
                        });

                        // When all files are loaded, update the state
                        if (loadedImages.length === files.length) {
                            setUploadedImages(prevImages => [...prevImages, ...loadedImages]);

                            // If no image is currently selected, select the first new image
                            if (!selectedImage && loadedImages.length > 0) {
                                setSelectedImage(loadedImages[0].dataUrl);
                                setProcessedImage(null);
                            }
                        }
                    }
                };
                reader.readAsDataURL(file);
            });

            e.target.value = ''; // Reset the file input
        }
    };

    function handleDeleteImage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        if (!selectedImage) return; // If there is no image selected, do nothing

        setUploadedImages(prevImages => {
            // Find the index of the image to be deleted
            const indexToDelete = prevImages.findIndex(img => img.dataUrl === selectedImage);

            // Filter out the image to delete
            const remainingImages = prevImages.filter((_, index) => index !== indexToDelete);

            // If the deleted image was selected, choose a new image to select
            if (selectedImage === processedImage) {
                setProcessedImage(null); // Clear the processed image
            }

            if (remainingImages.length > 0) {
                // Select the next image if available, otherwise select the previous one
                const newSelectedIndex = indexToDelete < remainingImages.length ? indexToDelete : remainingImages.length - 1;
                setSelectedImage(remainingImages[newSelectedIndex].dataUrl);
            } else {
                // If there are no remaining images, clear the selection
                setSelectedImage(null);
            }

            return remainingImages;
        });

        // If the deleted image was being displayed, remove it from view
        if (selectedImage === processedImage) {
            setProcessedImage(null); // Remove the processed image if it's the same as the deleted image
        }

        setSelectedImage(null); // Clear the currently selected image

        // Find the file input element and reset its value
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }

    function handleConvertToGrayscale(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        throw new Error('Function not implemented.');
    }

    function handleNormalizeImage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        throw new Error('Function not implemented.');
    }

    function handleReset(event: React.MouseEvent<HTMLButtonElement>): void {
        throw new Error('Function not implemented.');
    }

    function handleFC(event: React.MouseEvent<HTMLButtonElement>): void {
        throw new Error('Function not implemented.');
    }

    function handleToggle(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        throw new Error('Function not implemented.');
    }

    function handleSRGB(event: React.MouseEvent<HTMLButtonElement>): void {
        throw new Error('Function not implemented.');
    }

    function handleGamma(event: React.MouseEvent<HTMLButtonElement>): void {
        throw new Error('Function not implemented.');
    }

    return (
        <div>
            <h3 className="text-muted">Test out Homogeneous diffusion!</h3>
            <div className="container" style={{ display: 'flex' }}>
                <div className="control-panel" style={{ display: 'flex', flexDirection: 'row' }}>
                    <div>
                        <div className="images-section" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {uploadedImages.map((img, index) => (
                                <div key={index} onClick={() => {
                                    setSelectedImage(img.dataUrl);
                                    setProcessedImage(null); // Clear the processed image
                                }} style={{ cursor: 'pointer' }}>
                                    {img.name}
                                </div>
                            ))}
                        </div>

                        {/* File manipulation buttons */}
                        <div className="button-group">
                            <input
                                type="file"
                                id="file-upload"
                                accept="image/*"
                                onChange={handleImageChange}
                                multiple // Allows multiple file selection
                            />
                            <button onClick={handleDeleteImage}>Delete Image</button>
                        </div>
                        <div className="empty-space"></div>

                        <div className="tone-mapping" >
                            <h3>Tonemapping</h3>

                            {/* Sliders for Exposure, Offset, Gamma */}
                            <div className="sliders">
                                <label htmlFor="exposure">Exposure</label>
                                <input type="range" id="exposure" name="exposure" min="-100" max="100" />

                                <div className="half-sliders">
                                    <div>
                                        <label htmlFor="offset">Offset</label>
                                        <input type="range" id="offset" name="offset" min="-100" max="100" />
                                    </div>
                                    <div>
                                        <label htmlFor="gamma">Gamma</label>
                                        <input type="range" id="gamma" name="gamma" min="0.1" max="3" />
                                    </div>
                                </div>
                            </div>

                            <div className="empty-space"></div>

                            {/* Buttons for image tone mapping */}
                            <div className="button-group">
                                <button onClick={handleConvertToGrayscale}>Convert to Grayscale</button>
                                <button onClick={handleNormalizeImage}>Normalize</button>
                                <button onClick={handleReset}>Reset</button>
                            </div>

                            <div className="empty-space"></div>

                            <div className="button-group">
                                <button onClick={handleSRGB}>sRGB</button>
                                <button onClick={handleGamma}>Gamma</button>
                                <button onClick={handleFC}>FC</button>
                                <button onClick={handleToggle}>+/-</button>
                            </div>
                        </div>
                    </div>

                    <div
                        className="image-display-area"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={resetSlider}
                        onMouseEnter={() => setIsMouseOver(true)} // When the mouse enters the area
                    >
                        {(selectedImage && processedImage) ? (
                            <>
                                {comparisonMode === 'side-by-side' ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                        <img src={selectedImage} alt="Uploaded Preview" style={{ maxWidth: '50%', height: '300px' }} />
                                        <img src={processedImage} alt="Processed Upload" style={{ maxWidth: '50%', height: '300px' }} />
                                    </div>
                                ) : (
                                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', maxWidth: '600px', height: '300px', margin: 'auto' }}>
                                        <img src={selectedImage} alt="Original" style={{ position: 'absolute', width: '100%', height: '100%', clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }} />
                                        <img src={processedImage} alt="Processed" style={{ position: 'relative', width: '100%', height: '100%', clipPath: `inset(0 0 0 ${sliderPosition}%)` }} />
                                        <div className="slider-bar" style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: `${sliderPosition}%`,
                                            width: isMouseOver ? '3px' : '2px', // Wider when the mouse is over the image
                                            backgroundColor: isMouseOver ? 'rgba(255, 255, 255, 0.8)' : 'white', // Semi-transparent when the mouse is over, bold when not
                                            cursor: isMouseOver ? 'col-resize' : 'none', // Cursor is none when mouse is over the image
                                            height: '100%'
                                        }}></div>
                                    </div>
                                )}
                                <div className="comparison-button-group" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => setComparisonMode('side-by-side')}
                                        className={comparisonMode === 'side-by-side' ? 'active' : ''}
                                    >
                                        Side-by-side comparison
                                    </button>
                                    <button
                                        onClick={() => setComparisonMode('juxtaposed')}
                                        className={comparisonMode === 'juxtaposed' ? 'active' : ''}
                                    >
                                        Juxtaposed-comparison
                                    </button>
                                </div>
                            </>
                        ) : null}
                    </div>

                    <DiffusionAlgorithmSettings
                        onApply={handleAlgorithmApplication}
                        onAlgorithmChange={handleAlgorithmChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;