/**
 * @brief Homogeneous diffusion filter implementation.
 * @file homogeneous-diffusion.ts
 */
import { PaddingType } from '../utils/padding';
import { ImageBuffer, ImageType } from '../images/ImageBuffer';

/**
 * Applies a homogeneous diffusion filter to an ImageBuffer object.
 * 
 * It first applies specified padding to the input image, performs the homogeneous diffusion process for the given 
 * number of iterations and time step size, and then removes the added padding to return an image that matches
 * the original input image's dimensions.
 * 
 * @param inputImage - The input ImageBuffer object to which the homogeneous diffusion filter will be applied.
 * @param iterations - The number of iterations for the diffusion process.
 * @param tau - The time step size for the diffusion process.
 * @param paddingType - The type of padding to be applied to the input image before processing, to handle border effects.
 * @returns A new ImageBuffer object that is the result of applying the homogeneous diffusion filter to the input image.
 */
export const applyToImageBuffer = (
    inputImage: ImageBuffer,
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

    const hx = 1.0; // pixel size in x direction
    const hy = 1.0; // pixel size in y direction

    // Clone the input ImageBuffer for processing
    const u = inputImage.clone();

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

    const hd = (image: ImageBuffer, tau: number) => {
        const rx = tau / (hx * hx);
        const ry = tau / (hy * hy);

        // Clone the image for the calculation step
        const f = image.clone();

        dummiesDouble(f);

        // Process from 1 to width/height, respecting the added border
        for (let i = 1; i <= nx; i++) {
            for (let j = 1; j <= ny; j++) {
                const newVal = f.getPixel(i, j)[0] +
                    rx * (f.getPixel(i + 1, j)[0] - 2.0 * f.getPixel(i, j)[0] + f.getPixel(i - 1, j)[0]) +
                    ry * (f.getPixel(i, j + 1)[0] - 2.0 * f.getPixel(i, j)[0] + f.getPixel(i, j - 1)[0]);
                image.setPixel(i, j, [newVal]);
            }
        }
    };

    // Apply homogeneous diffusion for a number of given iterations
    for (let k = 1; k <= iterations; k++) {
        hd(u, tau);
    }

    // Trim the padding from the processed ImageBuffer, so it matches the original input image size
    u.trimPadding(paddingSize);

    return u;
};

/**
 * Converts ImageData to grayscale and applies a homogeneous diffusion filter.
 * 
 * This function effectively converts the input image to grayscale and then executes the function applyToImageBuffer() on it.
 * 
 * @param imageData - The input ImageData object to be processed. The image will be converted to grayscale.
 * @param iterations - Optional. The number of iterations for the diffusion process (default: 10).
 * @param tau - Optional. The time step size for the diffusion process (default: 0.25).
 * @param paddingType - Optional. The type of padding to apply before processing (default: PaddingType.CONSTANT).
 * @returns A new ImageData object representing the grayscale version of the input image after applying the diffusion process.
 */
export const applyToImageData = (
    imageData: ImageData,
    iterations: number = 10,
    tau: number = 0.25,
    paddingType: PaddingType = PaddingType.CONSTANT
): ImageData => {
    // Create a new grayscale image with pixel values from the original RGB ImageData object
    let inputImage = ImageBuffer.fromImageData(imageData, ImageType.GRAYSCALE);

    // Apply the homogeneous diffusion algorithm on the input image matrix
    const outputImage = applyToImageBuffer(inputImage, iterations, tau, paddingType);

    // Return a new imageData object from the output image
    return outputImage.toImageData();
};