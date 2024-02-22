/**
 * @brief Helper functions that handle images.
 * @file image-helpers.ts
 */
import { ImageBuffer, ImageType } from './ImageBuffer';

/**
 * Creates test ImageData with random pixel values based on the specified image type.
 * @param width - The width of the image.
 * @param height - The height of the image.
 * @param type - The type of the image (grayscale or RGB).
 * @returns ImageData with random pixel values.
 */
export function createTestImageData(width: number, height: number, type: ImageType): ImageData {
    let imageData = new ImageData(width, height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const grayValue = Math.floor(Math.random() * 256); // Random grayscale value between 0 and 255
        if (type === ImageType.GRAYSCALE) {
            imageData.data[i] = grayValue; // R
            imageData.data[i + 1] = grayValue; // G
            imageData.data[i + 2] = grayValue; // B
        } else if (type === ImageType.RGB) {
            imageData.data[i] = grayValue; // R
            imageData.data[i + 1] = Math.floor(Math.random() * 256); // G
            imageData.data[i + 2] = Math.floor(Math.random() * 256); // B
        } else {
            throw new Error(`Unsupported image type: ${type}`);
        }
        imageData.data[i + 3] = 255; // Alpha
    }
    return imageData;
}

/**
 * Creates test ImageBuffer with random pixel values based on the specified image type.
 * @param width - The width of the image.
 * @param height - The height of the image.
 * @param type - The type of the image (grayscale or RGB).
 * @returns ImageBuffer with random pixel values.
 */
export function createTestImageBuffer(width: number, height: number, type: ImageType): ImageBuffer {
    const newImage = new ImageBuffer(width, height, type);

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (type === ImageType.GRAYSCALE) {
                const grayValue = Math.floor(Math.random() * 256); // Random grayscale value between 0 and 255
                newImage.setPixel(j, i, [grayValue]);
            } else if (type === ImageType.RGB) {
                const redValue = Math.floor(Math.random() * 256);
                const greenValue = Math.floor(Math.random() * 256);
                const blueValue = Math.floor(Math.random() * 256);
                newImage.setPixel(j, i, [redValue, greenValue, blueValue]);
            } else
                throw new Error(`Unsupported image type: ${type}`);
        }
    }

    return newImage;
}