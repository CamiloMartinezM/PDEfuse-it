import { ImageBuffer, ImageType } from '../images/ImageBuffer';
import { PaddingType } from '../utils/padding';

export const applyToImageBuffer = (
    inputImage: ImageBuffer,
    mask: ImageBuffer,
    iterations: number,
    tau: number,
    paddingType: PaddingType = PaddingType.CONSTANT
): ImageBuffer => {
    // Save original width and height of the input image
    let nx = inputImage.width;
    let ny = inputImage.height;
    let paddingSize = 1;

    // Apply padding to the input image according to the specified padding type
    inputImage.pad(paddingSize, paddingSize, paddingType);
    mask.pad(paddingSize, paddingSize, paddingType);

    const hx = 1.0; // pixel size in x direction
    const hy = 1.0; // pixel size in y direction

    // Clone the input ImageBuffer for processing
    const u = inputImage.clone();

    // Initialize pixels where mask is 0 with random values from 0 to 255
    for (let y = 0; y < ny + 2 * paddingSize; y++) {
        for (let x = 0; x < nx + 2 * paddingSize; x++) {
            if (mask.getPixel(x, y)[0] === 0) {
                const randomValue = Math.floor(Math.random() * 256);
                u.setPixel(x, y, [randomValue]);
            }
        }
    }

    // Utility function for handling border conditions
    const dummiesDouble = (image: ImageBuffer) => {
        for (let i = 1; i <= nx; i++) {
            image.setPixel(i, 0, image.getPixel(i, 1));
            image.setPixel(i, ny + paddingSize, image.getPixel(i, ny));
        }
        for (let j = 0; j <= ny + paddingSize; j++) {
            image.setPixel(0, j, image.getPixel(1, j));
            image.setPixel(nx + paddingSize, j, image.getPixel(nx, j));
        }
    };

    const hd = (image: ImageBuffer, tau: number, startX: number = 1, endX: number = nx, startY: number = 1, endY: number = ny, stepX: number = 1, stepY: number = 1) => {
        const rx = tau / (hx * hx);
        const ry = tau / (hy * hy);

        // Clone the image for the calculation step
        const f = image.clone();

        dummiesDouble(f);

        // Process from 1 to width/height, respecting the added border
        for (let i = startX; i !== endX; i += stepX) {
            for (let j = startY; j !== endY; j += stepY) {
                if (mask.getPixel(i, j)[0] === 0) {  // Check if it's a missing data point
                    const newVal = (1 - 2 * rx - 2 * ry) * f.getPixel(i, j)[0] +
                        rx * f.getPixel(i + 1, j)[0] + rx * f.getPixel(i - 1, j)[0] +
                        ry * f.getPixel(i, j + 1)[0] + ry * f.getPixel(i, j - 1)[0];
                    // const newVal = f.getPixel(i, j)[0] +
                    //     rx * (f.getPixel(i + 1, j)[0] - 2.0 * f.getPixel(i, j)[0] + f.getPixel(i - 1, j)[0]) +
                    //     ry * (f.getPixel(i, j + 1)[0] - 2.0 * f.getPixel(i, j)[0] + f.getPixel(i, j - 1)[0]);
                    image.setPixel(i, j, [newVal]);
                }
            }
        }
    };

    // Apply homogeneous diffusion inpainting for a number of given iterations left to right, top to bottom
    for (let k = 1; k <= iterations; k++) {
        hd(u, tau, 1, nx, 1, ny, 1, 1);
    }

    // Trim the padding from the processed ImageBuffer, so it matches the original input image size
    u.trimPadding(paddingSize);

    return u;
};

export const applyToImageData = (
    imageData: ImageData,
    mask: ImageBuffer,
    iterations: number = 10,
    tau: number = 0.25,
    paddingType: PaddingType = PaddingType.CONSTANT
): ImageData => {
    // Create a new grayscale image with pixel values from the original RGB ImageData object
    let inputImage = ImageBuffer.fromImageData(imageData, ImageType.GRAYSCALE);

    // Apply the homogeneous diffusion inpainting algorithm on the input image matrix
    const outputImage = applyToImageBuffer(inputImage, mask, iterations, tau, paddingType);

    // Return a new imageData object from the output image
    return outputImage.toImageData();
};