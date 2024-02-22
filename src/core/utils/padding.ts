/**
 * @brief Padding util function.
 * @file padding.ts
 */

/**
 * Available padding types to apply to the image.
 * Some examples are given in the description of the `padMatrix` function.
 */
export enum PaddingType {
    CONSTANT = 'CONSTANT',
    REPEAT = 'REPEAT',
    MIRROR = 'MIRROR',
    EXTEND = 'EXTEND',
}

/**
 * A 3D pixel matrix representing an image.
 */
type PixelMatrix = number[][][];

/**
 * Pads a 3D pixel matrix with specified padding width, height, and type.
 * 
 * @param matrix - The original 3D pixel matrix to be padded.
 * @param padWidth - The number of columns to add to each side of the matrix.
 * @param padHeight - The number of rows to add to each side of the matrix.
 * @param paddingType - The type of padding to apply.
 * @param paddingValue - The default value for padding, used with PaddingType.CONSTANT.
 * @returns The padded 3D pixel matrix.
 * @throws Error if the padding type is not supported.
 * 
 * Examples:
 * 
 * Given a matrix:
 * 
 * `[1, 2]
 *  [3, 4]`
 * 
 * Padding with `padWidth = 2`, `padHeight = 2` and different padding types would result in:
 * 
 * `PaddingType.CONSTANT`: 
 *  Adds a border with a constant value. If `paddingValue = [0]`, the border pixels will be set to `0`.
 * 
 * `[0, 0, 0, 0, 0, 0]
 *  [0, 0, 0, 0, 0, 0]
 *  [0, 0, 1, 2, 0, 0]
 *  [0, 0, 3, 4, 0, 0]
 *  [0, 0, 0, 0, 0, 0]
 *  [0, 0, 0, 0, 0, 0]`
 * 
 * `PaddingType.REPEAT`:
 *  Tiles the original matrix to fill the padding area.
 * 
 * `[1, 2, 1, 2, 1, 2]
 *  [3, 4, 3, 4, 3, 4]
 *  [1, 2, 1, 2, 1, 2]
 *  [3, 4, 3, 4, 3, 4]
 *  [1, 2, 1, 2, 1, 2]
 *  [3, 4, 3, 4, 3, 4]`
 * 
 * `PaddingType.MIRROR`:
 *  Reflects the border pixels of the original matrix across the padding border, creating a mirrored effect.
 * 
 * `[4, 3, 3, 4, 4, 3]
 *  [2, 1, 1, 2, 2, 1]
 *  [2, 1, 1, 2, 2, 1]
 *  [4, 3, 3, 4, 4, 3]
 *  [4, 3, 3, 4, 4, 3]
 *  [2, 1, 1, 2, 2, 1]`
 * 
 * `PaddingType.EXTEND`:
 *  Extends the edge pixels of the original matrix into the padding area. The outermost pixels are repeated.
 * 
 * `[1, 1, 1, 2, 2, 2]
 *  [1, 1, 1, 2, 2, 2]
 *  [1, 1, 1, 2, 2, 2]
 *  [3, 3, 3, 4, 4, 4]
 *  [3, 3, 3, 4, 4, 4]
 *  [3, 3, 3, 4, 4, 4]`
 *
 * Note: The examples assume a grayscale image for simplicity. For RGB images, the `paddingValue` and pixel values are arrays of length 3 (e.g., [R, G, B]).
 */
export const padMatrix = (
    matrix: PixelMatrix,
    padWidth: number,
    padHeight: number,
    paddingType: PaddingType,
    paddingValue: number[] = [0.0] 
): PixelMatrix => {
    const height = matrix.length;
    const width = matrix[0].length;
    const paddedHeight = height + 2 * padHeight;
    const paddedWidth = width + 2 * padWidth;
    const paddedMatrix: PixelMatrix = Array.from({ length: paddedHeight }, () => Array.from({ length: paddedWidth }, () => [...paddingValue]));

    // Copy the original matrix into the center of the padded matrix
    for (let i = 0; i < height; i++) 
        for (let j = 0; j < width; j++) 
            paddedMatrix[i + padHeight][j + padWidth] = [...matrix[i][j]];

    // Apply the specified padding strategy
    switch (paddingType) {
        case PaddingType.REPEAT:
            for (let i = -padHeight; i < height + padHeight; i++) {
                for (let j = -padWidth; j < width + padWidth; j++) {
                    const repeatI = (i + height) % height;
                    const repeatJ = (j + width) % width;
                    paddedMatrix[i + padHeight][j + padWidth] = [...matrix[repeatI][repeatJ]];
                }
            }
            break;
        case PaddingType.MIRROR:
            for (let i = 0; i < paddedHeight; i++) {
                for (let j = 0; j < paddedWidth; j++) {
                    const mirrorI = i < padHeight ? padHeight - 1 - i : (i >= height + padHeight ? 2 * height + padHeight - 1 - i : i - padHeight);
                    const mirrorJ = j < padWidth ? padWidth - 1 - j : (j >= width + padWidth ? 2 * width + padWidth - 1 - j : j - padWidth);
                    paddedMatrix[i][j] = [...matrix[mirrorI][mirrorJ]];
                }
            }
            break;
        case PaddingType.EXTEND:
            for (let i = 0; i < paddedHeight; i++) {
                for (let j = 0; j < paddedWidth; j++) {
                    const extendI = i < padHeight ? 0 : (i >= height + padHeight ? height - 1 : i - padHeight);
                    const extendJ = j < padWidth ? 0 : (j >= width + padWidth ? width - 1 : j - padWidth);
                    paddedMatrix[i][j] = [...matrix[extendI][extendJ]];
                }
            }
            break;
        case PaddingType.CONSTANT:
            break;
        default:
            throw new Error(`Unsupported padding type: ${paddingType}`);
    }

    return paddedMatrix;
};
