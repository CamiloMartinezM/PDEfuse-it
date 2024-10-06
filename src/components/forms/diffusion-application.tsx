import React, { useCallback, useRef, useState } from 'react';
import { applyColorInversion, applyExposure, applyFC, applyGamma, applyOffset, applySRGB, normalizeImage, rgbToGrayscale } from '../../core/images/image-helpers';
import { getBaseName } from '../../core/utils/hashing';
import DiffusionAlgorithmSettings, { findAlgorithmByName } from './diffusion-algorithm-settings';

const DiffusionApplication = () => {
    // Image-Editor variables
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<{ name: string; dataUrl: string; }[]>([]);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [selectedClassicCVImage, setSelectedClassicCVImage] = useState<string | null>(null)
    const [exposure, setExposure] = useState(0);
    const [offset, setOffset] = useState(0);
    const [gamma, setGamma] = useState(1);
    const [isInverted, setIsInverted] = useState(false);

    // Available public images for testing
    const imagesContext = (require as any).context('../../../public/test_images', false, /\.png$/);
    const availableImages = imagesContext.keys().map(imagesContext);

    // Image-Display-Area variables
    const [comparisonMode, setComparisonMode] = useState('side-by-side');
    const [sliderPosition, setSliderPosition] = useState(50); // For the juxtaposed mode
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [zoom, setZoom] = useState(1);
    const imageRef = useRef<HTMLImageElement>(null);

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

    const handleZoomIn = () => {
        setZoom(prevZoom => prevZoom * 1.2);
    };

    const handleZoomOut = () => {
        setZoom(prevZoom => prevZoom / 1.2);
    };

    const handleZoomReset = () => {
        setZoom(1);
    };

    /* Image-Processing-Algorithm functions */

    const handleAlgorithmChange = (algorithmName: string) => {
        setSelectedAlgorithm(algorithmName);
        const algorithm = findAlgorithmByName(algorithmName);
        const defaultParams = algorithm ? algorithm.parameters.reduce((acc, param) => {
            acc[param.label] = typeof param.value === 'number' ? param.value : parseFloat(param.value);
            return acc;
        }, {} as Record<string, number>) : {};
        setAlgorithmParams(defaultParams);
    };

    /**
     * This function will use selectedAlgorithm and algorithmParams to apply the selected algorithm
     */
    const handleAlgorithmApplication = () => {
        if (!selectedImage || !selectedAlgorithm) return;

        const algorithm = findAlgorithmByName(selectedAlgorithm);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const imageElement = new Image();

        imageElement.onload = () => {
            canvas.width = imageElement.width;
            canvas.height = imageElement.height;
            if (ctx && algorithm) {
                ctx.drawImage(imageElement, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const processedImageData = algorithm.applyFunction(imageData, ...Object.values<number | undefined>(algorithmParams));

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

    const handleImageSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFilename = e.target.value;
        setSelectedImage(selectedFilename);
        setSelectedClassicCVImage(selectedFilename);
        setProcessedImage(null); // Clear the processed image
    };

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
                                setProcessedImage(null); // Clear the processed image
                                setSelectedClassicCVImage(null); // Clear the classic CV image selection
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

    /**
     * Applies the given image processing function to the selected image and updates the processed image state
     * @param processingFunc The image processing function to apply
     */
    const applyImageProcessing = useCallback((processingFunc: (imageData: ImageData) => ImageData) => {
        if (!selectedImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

            if (imageData) {
                const processedImageData = processingFunc(imageData);
                ctx?.putImageData(processedImageData, 0, 0);
                setProcessedImage(canvas.toDataURL());
            }
        };

        img.src = selectedImage;
    }, [selectedImage]);

    const handleConvertToGrayscale = () => {
        applyImageProcessing(rgbToGrayscale);
    };

    const handleNormalizeImage = () => {
        applyImageProcessing(normalizeImage);
    };

    const handleReset = () => {
        setProcessedImage(null);
        setExposure(0);
        setOffset(0);
        setGamma(1);
        setIsInverted(false);
    };

    const handleFC = () => {
        applyImageProcessing((imageData) => applyFC(imageData));
    };

    const handleToggle = () => {
        setIsInverted(!isInverted);
        applyImageProcessing(applyColorInversion);
    };

    const handleSRGB = () => {
        applyImageProcessing(applySRGB);
    };

    const handleExposureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newExposure = parseFloat(e.target.value);
        setExposure(newExposure);
        applyImageProcessing((imageData) => applyExposure(imageData, newExposure));
    };

    const handleOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOffset = parseFloat(e.target.value);
        setOffset(newOffset);
        applyImageProcessing((imageData) => applyOffset(imageData, newOffset));
    };

    const handleGammaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newGamma = parseFloat(e.target.value);
        setGamma(newGamma);
        applyImageProcessing((imageData) => applyGamma(imageData, newGamma));
    };

    return (
        <div className="diffusion-application-section">
            <div className="image-editor-section">
                {/* Listbox for selecting an image */}
                <div className="image-selector">
                    <label htmlFor="image-selection">Use a classic Computer Vision test image:</label>
                    <select
                        id="image-selection"
                        onChange={handleImageSelection}
                        value={selectedClassicCVImage || ""}
                    >
                        <option value="">Select an image</option>
                        {availableImages.map((filename: string, index: number) => (
                            <option key={index} value={filename}>
                                {/* This regex will match the base file name without the hash and extension */}
                                {getBaseName(filename, "static\\/media\\/(.+?)\\.[a-f0-9]+\\.\\w+")}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="empty-space"></div>
                <label htmlFor="image-selection">Or upload your own:</label>

                <div className="images-section">
                    {uploadedImages.map((img, index) => (
                        <div key={index} onClick={() => {
                            setSelectedImage(img.dataUrl);
                            setProcessedImage(null); // Clear the processed image
                            setSelectedClassicCVImage(null); // Clear the classic CV image selection
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
                        <input type="range" id="exposure" name="exposure" min="-2" max="2" step="0.1" value={exposure} onChange={handleExposureChange} />

                        <div className="half-sliders">
                            <div>
                                <label htmlFor="offset">Offset</label>
                                <input type="range" id="offset" name="offset" min="-128" max="128" value={offset} onChange={handleOffsetChange} />
                            </div>
                            <div>
                                <label htmlFor="gamma">Gamma</label>
                                <input type="range" id="gamma" name="gamma" min="0.1" max="3" step="0.1" value={gamma} onChange={handleGammaChange} />
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
                <div className="image-container">
                    <div className="image-wrapper" style={{ transform: `scale(${zoom})` }}>
                        {(selectedImage) ? (
                            <>
                                {comparisonMode === 'side-by-side' ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                        <img src={selectedImage} alt="Uploaded Preview" style={{ maxWidth: '50%', height: '300px' }} />
                                        {/* Show processed image if available, otherwise show the same selected image */}
                                        {processedImage ? (
                                            <img src={processedImage} alt="Processed Upload" style={{ maxWidth: '50%', height: '300px' }} />
                                        ) : (
                                            <img src={selectedImage} alt="Uploaded Preview" style={{ maxWidth: '50%', height: '300px' }} />
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', maxWidth: '600px', height: '300px', margin: 'auto' }}>
                                        <img src={selectedImage} alt="Original" style={{ position: 'absolute', width: '100%', height: '100%', clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }} />
                                        {/* Show processed image if available, otherwise show the same selected image */}
                                        {processedImage ? (
                                            <img src={processedImage} alt="Processed" style={{ position: 'relative', width: '100%', height: '100%', clipPath: `inset(0 0 0 ${sliderPosition}%)` }} />
                                        ) : (
                                            <img src={selectedImage} alt="Original" style={{ position: 'relative', width: '100%', height: '100%', clipPath: `inset(0 0 0 ${sliderPosition}%)` }} />
                                        )}
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
                            </>
                        ) : null}
                    </div>
                </div>

                <div className="comparison-button-group">
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

                <div className="zoom-controls">
                    <button onClick={handleZoomIn}>+</button>
                    <button onClick={handleZoomOut}>-</button>
                    <button onClick={handleZoomReset}>Reset</button>
                </div>
            </div>

            <section className="algorithm-settings-section">
                <DiffusionAlgorithmSettings
                    onAlgorithmChange={handleAlgorithmChange}
                    onApply={(_, params) => {
                        setAlgorithmParams(params);
                        handleAlgorithmApplication();
                    }}
                />
            </section>
        </div>
    );
};

export default DiffusionApplication;