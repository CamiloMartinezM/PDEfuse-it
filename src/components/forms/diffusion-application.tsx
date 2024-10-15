import React, { useCallback, useEffect, useRef, useState } from 'react';
import { applyColorInversion, applyExposure, applyFC, applyGamma, applyOffset, applySRGB, normalizeImage, rgbToGrayscale } from '../../core/images/image-helpers';
import { ImageBuffer, ImageType } from '../../core/images/ImageBuffer';
import { getBaseName } from '../../core/utils/hashing';
import DiffusionAlgorithmSettings, { findAlgorithm } from './diffusion-algorithm-settings';

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
    const [paintedAreas, setPaintedAreas] = useState<boolean[][]>([]);

    // State variables for the paint tool
    const [isPainting, setIsPainting] = useState(false);
    const [paintSquareSize, setPaintSquareSize] = useState(50);
    const [paintPosition, setPaintPosition] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [editedImage, setEditedImage] = useState<string | null>(null);

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
        const algorithm = findAlgorithm(algorithmName);
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
        if (!editedImage || !selectedAlgorithm) return;

        const algorithm = findAlgorithm(selectedAlgorithm);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const imageElement = new Image();

        imageElement.onload = () => {
            canvas.width = imageElement.width;
            canvas.height = imageElement.height;
            if (ctx && algorithm) {
                ctx.drawImage(imageElement, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let processedImageData;
                if (algorithm.name === 'Homogeneous Diffusion Inpainting') {
                    console.log("TE LA ENTIERRO");
                    const mask = new ImageBuffer(canvas.width, canvas.height, ImageType.GRAYSCALE);
                    for (let y = 0; y < canvas.height; y++) {
                        for (let x = 0; x < canvas.width; x++) {
                            mask.setPixel(x, y, [paintedAreas[y][x] ? 0 : 1]);
                        }
                    }

                    processedImageData = algorithm.applyFunction(
                        imageData,
                        mask,
                        ...Object.values<number | undefined>(algorithmParams)
                    );
                } else {
                    processedImageData = algorithm.applyFunction(imageData, ...Object.values<number | undefined>(algorithmParams));
                }

                // Draw the processed image data back onto the canvas
                ctx.putImageData(processedImageData, 0, 0);

                // Convert the canvas to a data URL and update state
                const dataUrl = canvas.toDataURL();
                setProcessedImage(dataUrl);
            }
        };

        imageElement.src = editedImage; // This is the data URL of the uploaded image
    };

    /* Image-Editor functions */

    const handleImageSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFilename = e.target.value;
        setSelectedImage(selectedFilename);
        setSelectedClassicCVImage(selectedFilename);
        setProcessedImage(null);

        // Load the selected image onto the canvas
        loadImageOntoCanvas(selectedFilename);

        // Load the first algorithm by default
        const defaultAlgorithm = findAlgorithm(0);
        if (defaultAlgorithm) {
            handleAlgorithmChange(defaultAlgorithm.name);
        }
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

    /* Paint Tool functions */

    useEffect(() => {
        if (selectedImage) {
            loadImageOntoCanvas(selectedImage);
            // Initialize paintedAreas with false values
            const img = new Image();
            img.onload = () => {
                setPaintedAreas(Array(img.height).fill(null).map(() => Array(img.width).fill(false)));
            };
            img.src = selectedImage;
        }
    }, [selectedImage]);

    const loadImageOntoCanvas = (imageSrc: string) => {
        const img = new Image();
        img.onload = () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                setEditedImage(canvas.toDataURL());
                // Reset paintedAreas
                setPaintedAreas(Array(img.height).fill(null).map(() => Array(img.width).fill(false)));
            }
        };
        img.src = imageSrc;
    };

    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDrawingMode) {
            setIsPainting(true);
            const canvas = canvasRef.current;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setPaintPosition({ x, y });
                paintSquare(x, y);
            }
        }
    };

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isPainting && isDrawingMode) {
            const canvas = canvasRef.current;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setPaintPosition({ x, y });
                paintSquare(x, y);
            }
        }
    };

    const handleCanvasMouseUp = () => {
        if (isPainting) {
            setIsPainting(false);
            updateEditedImage();
        }
    };

    const paintSquare = (x: number, y: number) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'black';
                const startX = Math.max(0, x - paintSquareSize / 2);
                const startY = Math.max(0, y - paintSquareSize / 2);
                const width = Math.min(paintSquareSize, canvas.width - startX);
                const height = Math.min(paintSquareSize, canvas.height - startY);
                ctx.fillRect(startX, startY, width, height);

                // Update paintedAreas
                setPaintedAreas(prev => {
                    const newPaintedAreas = [...prev];
                    for (let i = Math.floor(startY); i < Math.floor(startY + height); i++) {
                        for (let j = Math.floor(startX); j < Math.floor(startX + width); j++) {
                            if (i < newPaintedAreas.length && j < newPaintedAreas[i].length) {
                                newPaintedAreas[i][j] = true;
                            }
                        }
                    }
                    return newPaintedAreas;
                });
            }
        }
    };

    const updateEditedImage = () => {
        if (canvasRef.current) {
            setEditedImage(canvasRef.current.toDataURL());
        }
    };

    const handleSquareSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaintSquareSize(Number(e.target.value));
    };

    const handleResetCanvas = () => {
        if (selectedImage) {
            loadImageOntoCanvas(selectedImage);
            // Reset paintedAreas
            setPaintedAreas(Array(canvasRef.current?.height || 0).fill(null).map(() => Array(canvasRef.current?.width || 0).fill(false)));
        }
    };


    const toggleDrawingMode = () => {
        setIsDrawingMode(!isDrawingMode);
    };

    return (
        <div className="flex justify-center w-full">
            <div className="w-2/5 h-full max-h-full pr-5 overflow-y-hidden">
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

                <div className="h-24 border border-gray-300 mb-5 overflow-y-auto p-2.5 rounded-md">
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

                <div className="w-full space-y-8">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Tonemapping</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="exposure" className="block text-sm font-medium text-gray-700 mb-1">Exposure</label>
                                <input type="range" id="exposure" name="exposure" min="-2" max="2" step="0.1" value={exposure} onChange={handleExposureChange}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label htmlFor="offset" className="block text-sm font-medium text-gray-700 mb-1">Offset</label>
                                    <input type="range" id="offset" name="offset" min="-128" max="128" value={offset} onChange={handleOffsetChange}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="gamma" className="block text-sm font-medium text-gray-700 mb-1">Gamma</label>
                                    <input type="range" id="gamma" name="gamma" min="0.1" max="3" step="0.1" value={gamma} onChange={handleGammaChange}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-1 w-full">
                            <button onClick={handleConvertToGrayscale} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Convert to Grayscale</button>
                            <button onClick={handleNormalizeImage} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Normalize</button>
                            <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Reset</button>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button onClick={handleSRGB} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">sRGB</button>
                            <button onClick={handleFC} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition">FC</button>
                            <button onClick={handleToggle} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">+/-</button>
                        </div>
                    </div>
                </div>

                {/* Paint Tool Section */}
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">Paint Tool</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label htmlFor="square-size" className="text-sm font-medium text-gray-700">Square Size:</label>
                            <input
                                type="range"
                                id="square-size"
                                min="10"
                                max="100"
                                value={paintSquareSize}
                                onChange={handleSquareSizeChange}
                                className="flex-grow h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-sm font-semibold text-blue-600">{paintSquareSize}px</span>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={toggleDrawingMode}
                                className={`flex-1 py-2 px-4 rounded-full font-semibold transition ${isDrawingMode
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                            >
                                {isDrawingMode ? 'Disable Drawing' : 'Enable Drawing'}
                            </button>
                            <button
                                onClick={handleResetCanvas}
                                className="flex-1 py-2 px-4 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600 transition"
                            >
                                Reset Canvas
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="w-full h-4/5 max-h-4/5 min-h-4/5 flex flex-col items-center justify-center relative p-5 overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={resetSlider}
                onMouseEnter={() => setIsMouseOver(true)} // When the mouse enters the area
            >
                <div className="image-container">
                    <div className="image-wrapper" style={{ transform: `scale(${zoom})` }}>
                        {selectedImage && (
                            <>
                                <canvas
                                    ref={canvasRef}
                                    onMouseDown={handleCanvasMouseDown}
                                    onMouseMove={handleCanvasMouseMove}
                                    onMouseUp={handleCanvasMouseUp}
                                    onMouseLeave={handleCanvasMouseUp}
                                    style={{
                                        cursor: isDrawingMode ? 'crosshair' : 'default',
                                        maxWidth: '100%',
                                        height: 'auto',
                                        display: isDrawingMode ? 'block' : 'none'
                                    }}
                                />
                                {!isDrawingMode && (
                                    <>
                                        {comparisonMode === 'side-by-side' ? (
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                                <img src={editedImage || selectedImage} alt="Edited Preview" style={{ maxWidth: '50%', height: '300px' }} />
                                                {processedImage ? (
                                                    <img src={processedImage} alt="Processed Upload" style={{ maxWidth: '50%', height: '300px' }} />
                                                ) : (
                                                    <img src={editedImage || selectedImage} alt="Edited Preview" style={{ maxWidth: '50%', height: '300px' }} />
                                                )}
                                            </div>
                                        ) : (
                                            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', maxWidth: '600px', height: '300px', margin: 'auto' }}>
                                                <img src={editedImage || selectedImage} alt="Edited" style={{ position: 'absolute', width: '100%', height: '100%', clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }} />
                                                {processedImage ? (
                                                    <img src={processedImage} alt="Processed" style={{ position: 'relative', width: '100%', height: '100%', clipPath: `inset(0 0 0 ${sliderPosition}%)` }} />
                                                ) : (
                                                    <img src={editedImage || selectedImage} alt="Edited" style={{ position: 'relative', width: '100%', height: '100%', clipPath: `inset(0 0 0 ${sliderPosition}%)` }} />
                                                )}
                                                <div className="slider-bar" style={{
                                                    position: 'absolute',
                                                    top: '0',
                                                    left: `${sliderPosition}%`,
                                                    width: isMouseOver ? '3px' : '2px',
                                                    backgroundColor: isMouseOver ? 'rgba(255, 255, 255, 0.8)' : 'white',
                                                    cursor: isMouseOver ? 'col-resize' : 'none',
                                                    height: '100%'
                                                }}></div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2.5">
                    <button
                        onClick={() => setComparisonMode('side-by-side')}
                        className={`px-5 py-2.5 border-none cursor-pointer transition-colors rounded-lg duration-300 ${comparisonMode === 'side-by-side' ? 'bg-blue-600 text-blue-100' : 'bg-gray-200 text-gray-400'
                            }`}
                    >
                        Side-by-side comparison
                    </button>
                    <button
                        onClick={() => setComparisonMode('juxtaposed')}
                        className={`px-5 py-2.5 border-none cursor-pointer transition-colors rounded-lg duration-300 ${comparisonMode === 'juxtaposed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                            }`}
                    >
                        Juxtaposed-comparison
                    </button>
                </div>

                <div className="absolute top-5 right-5 flex gap-2.5">
                    <button className='zoom-control-button' onClick={handleZoomIn}>+</button>
                    <button className='zoom-control-button' onClick={handleZoomOut}>-</button>
                    <button className='zoom-control-button' onClick={handleZoomReset}>Reset</button>
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