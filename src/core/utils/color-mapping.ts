/**
 * @brief Color-mappings util function for conversion between color spaces.
 * @file color-mapping.ts
 */

/**
 * Converts RGB color values to grayscale.
 * 
 * @param red - The red component of the RGB color.
 * @param green - The green component of the RGB color.
 * @param blue - The blue component of the RGB color.
 * @returns The grayscale value.
 */
export function rgbToGrayscale(red: number, green: number, blue: number): number {
    return (red + green + blue) / 3;
}