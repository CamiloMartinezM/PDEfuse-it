/**
 * @brief ImageBuffer class for storing and manipulating image data.
 * @file ImageBuffer.ts
 */
import { rgbToGrayscale } from "../utils/color-mapping";
import { padMatrix, PaddingType } from '../utils/padding';

/**
 * Represents the type of an image.
 */
export enum ImageType {
    GRAYSCALE = 'GRAYSCALE',
    RGB = 'RGB',
    MULTICHANNEL = 'MULTICHANNEL' // TODO: Add support for more than 3 channels
}

/**
 * Represents an image buffer that stores pixel values.
 */
export class ImageBuffer {
    width: number; // The width of the image buffer
    height: number; // The height of the image buffer
    matrix: number[][][]; // The matrix that holds the pixel values
    type: ImageType; // The type of the image buffer

    /**
     * Constructs a new ImageBuffer instance.
     * 
     * @param width - The width of the image buffer.
     * @param height - The height of the image buffer.
     * @param type - The type of the image buffer (default: ImageType.GRAYSCALE).
     */
    constructor(width: number, height: number, type: ImageType = ImageType.GRAYSCALE) {
        this.width = width;
        this.height = height;
        this.type = type;
        this.matrix = this.initializePixelMatrix(width, height, type);
    }

    /**
     * Initializes the pixel matrix for the image buffer.
     * 
     * @param width - The width of the image.
     * @param height - The height of the image.
     * @param type - The type of the pixels that will be stored in the matrix.
     * @returns The initialized pixel matrix.
     * @throws Error if the image type is not supported.
     */
    private initializePixelMatrix(width: number, height: number, type: ImageType): number[][][] {
        let matrix: number[][][];
        if (type === ImageType.RGB) {
            matrix = Array.from({ length: height }, () => new Array(width).fill([0, 0, 0])); // RGB values are stored as [R, G, B]
        }
        else if (type === ImageType.GRAYSCALE) {
            matrix = Array.from({ length: height }, () => new Array(width).fill([0])); // Grayscale values are stored as [value]
        }
        else {
            throw new Error('Image type is not supported');
        }
        return matrix;
    }

    /**
     * Creates a deep copy of the ImageBuffer object.
     * 
     * @returns A new ImageBuffer object that is an exact copy of the original.
     */
    public clone(): ImageBuffer {
        const clonedBuffer = new ImageBuffer(this.width, this.height, this.type);
        clonedBuffer.matrix = this.matrix.map(row => row.map(pixel => [...pixel]));
        return clonedBuffer;
    }

    /**
     * Creates an ImageBuffer object from the given ImageData and image type.
     * 
     * @param imageData - The ImageData object containing pixel data.
     * @param type - The type of the image (grayscale or RGB).
     * @returns A new ImageBuffer object.
     */
    static fromImageData(imageData: ImageData, type: ImageType): ImageBuffer {
        const { width, height } = imageData;
        const newImage = new ImageBuffer(width, height, type);

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const index = (i * width + j) * 4;
                const red = imageData.data[index];
                const green = imageData.data[index + 1];
                const blue = imageData.data[index + 2];

                // Store the pixel value in the matrix, depending on the type of the image
                if (newImage.type === ImageType.GRAYSCALE) {
                    newImage.matrix[i][j] = [rgbToGrayscale(red, green, blue)];
                } else if (newImage.type === ImageType.RGB) {
                    newImage.matrix[i][j] = [red, green, blue];
                }
            }
        }

        return newImage;
    }

    /**
     * Creates an ImageBuffer object from a matrix of pixel values, representing an image.
     * 
     * @param matrix - The matrix representing the image.
     * @returns The created ImageBuffer object.
     */
    static fromMatrix(matrix: number[][][]): ImageBuffer {
        const height = matrix.length;
        const width = matrix[0].length;
        let type: ImageType;

        if (matrix[0][0].length === 1) {
            type = ImageType.GRAYSCALE;
        } else if (matrix[0][0].length === 3) {
            type = ImageType.RGB;
        } else {
            type = ImageType.MULTICHANNEL;
        }

        const newImage = new ImageBuffer(width, height, type);
        newImage.matrix = matrix;
        return newImage;
    }

    /**
     * Retrieves the pixel value at the specified coordinates.
     * 
     * @param x - The x-coordinate of the pixel (in width).
     * @param y - The y-coordinate of the pixel (in height).
     * @returns The pixel value as an array of numbers.
     * @throws Error if the pixel coordinates are out of bounds.
     */
    getPixel(x: number, y: number): number[] {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new Error('Pixel coordinates out of bounds');
        }
        return this.matrix[y][x];
    }

    /**
     * Sets the pixel value at the specified coordinates.
     * 
     * @param x - The x-coordinate of the pixel (in width).
     * @param y - The y-coordinate of the pixel (in height).
     * @param value - The new pixel value as an array of numbers.
     * @throws Error if the pixel coordinates are out of bounds.
     */
    setPixel(x: number, y: number, value: number[]): void {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new Error('Pixel coordinates out of bounds');
        }
        this.matrix[y][x] = value;
    }

    /**
     * Adds padding to the image buffer. If the image is RGB, the padding value should have 3 components. 
     * On the other hand, if it is grayscale, the padding value should have 1 component. 
     * 
     * @param padWidth - The width of the padding.
     * @param padHeight - The height of the padding.
     * @param paddingType - The type of padding to apply.
     * @param paddingValue - The value to use for padding. Defaults to [0.0]. Ignored if `paddingType` is 
     * not PaddingType.CONSTANT.
    */
    pad(padWidth: number, padHeight: number, paddingType: PaddingType, paddingValue: number[] = [0.0]): void {
        if (this.type === ImageType.RGB && paddingValue.length !== 3) {
            paddingValue = [paddingValue[0], paddingValue[0], paddingValue[0]];
        } else if (this.type === ImageType.GRAYSCALE && paddingValue.length !== 1) {
            paddingValue = [paddingValue[0]];
        }
        this.matrix = padMatrix(this.matrix, padWidth, padHeight, paddingType, paddingValue);

        // Update width and height according to the padding
        // TODO: Handle assymetric padding
        this.width += padWidth * 2; // Assuming symmetric padding on both sides
        this.height += padHeight * 2; // Assuming symmetric padding on top and bottom
    }

    /**
     * Trims the padding inplace from the image buffer instance.
     * @param paddingSize - The size of the padding to be removed from each side of the image.
    */
    trimPadding(paddingSize: number): void {
        // Calculate the new dimensions of the image after trimming
        const newWidth = this.width - 2 * paddingSize;
        const newHeight = this.height - 2 * paddingSize;

        // Throw an error if the new dimensions are invalid
        if (newWidth <= 0 || newHeight <= 0) {
            throw new Error('Padding size is too large, resulting in non-positive dimensions for the trimmed image.');
        }

        // Trim the padding from the height (top and bottom)
        this.matrix = this.matrix.slice(paddingSize, this.height - paddingSize);

        // Trim the padding from the width (left and right) for each row
        this.matrix = this.matrix.map(row => row.slice(paddingSize, this.width - paddingSize));

        // Update the width and height properties to reflect the new dimensions
        this.width = newWidth;
        this.height = newHeight;
    }

    /**
     * Converts the ImageBuffer to ImageData format.
     * @returns The converted ImageData object.
     */
    toImageData(): ImageData {
        const imageData = new ImageData(this.width, this.height);

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const index = (i * this.width + j) * 4;
                const pixel = this.matrix[i][j];

                if (this.type === ImageType.GRAYSCALE) {
                    imageData.data[index] = pixel[0]; // R
                    imageData.data[index + 1] = pixel[0]; // G
                    imageData.data[index + 2] = pixel[0]; // B
                } else if (this.type === ImageType.RGB) {
                    imageData.data[index] = pixel[0]; // R
                    imageData.data[index + 1] = pixel[1]; // G
                    imageData.data[index + 2] = pixel[2]; // B
                }
                imageData.data[index + 3] = 255; // Alpha
            }
        }

        return imageData;
    }
}
