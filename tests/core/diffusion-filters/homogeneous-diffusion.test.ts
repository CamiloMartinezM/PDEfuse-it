import { createTestImageBuffer } from '../../../src/core/images/image-helpers';
import { ImageBuffer, ImageType } from '../../../src/core/images/ImageBuffer';
import { applyToImageBuffer } from '../../../src/core/diffusion-filters/homogeneous-diffusion';

/**
 * These test cases verify the behavior of the homogeneous diffusion filter by checking the expected properties
 * according to the Well-Posedness and Scale-Space Theory.
 */
describe('Homogeneous Diffusion Tests', () => {
     // Create a 5x5 grayscale test image
    const originalImage = createTestImageBuffer(5, 5, ImageType.GRAYSCALE);

    // Calculate initial properties
    const originalGreyValue = originalImage.averageGreyLevel();
    const originalVariance = originalImage.variance();

    // Apply the homogeneous diffusion filter
    let iterations = 10;
    let tau = 0.24;
    let processedImage = applyToImageBuffer(originalImage, iterations, tau);
    let processedImageGreyValue = processedImage.averageGreyLevel();

    // The average grey level should be preserved after applying the filter
    test('Preservation of Average Grey Level', () => {
        expect(processedImageGreyValue).toBeCloseTo(originalGreyValue, 2);
    });

    // The maximum and minimum pixel values should be within the range of the original image maximum and minimum
    test('Maximum–Minimum Principle', () => {
        const originalMax = ImageBuffer.pixelMagnitude(originalImage.findMaxPixel());
        const originalMin = ImageBuffer.pixelMagnitude(originalImage.findMinPixel());
        const processedMax = ImageBuffer.pixelMagnitude(processedImage.findMaxPixel());
        const processedMin = ImageBuffer.pixelMagnitude(processedImage.findMinPixel());

        expect(processedMax).toBeLessThanOrEqual(originalMax);
        expect(processedMin).toBeGreaterThanOrEqual(originalMin);
    });

    iterations = 10000;
    processedImage = applyToImageBuffer(originalImage, iterations, tau);

    // The resulting image should be a constant image with pixel value almost equal to the original image's average grey level
    test('Constant Image for t → ∞', () => {
        const processedVariance = processedImage.variance();

        // Check that the variance has decreased significantly, indicating convergence towards a uniform image
        expect(processedVariance).toBeLessThan(originalVariance);

        // Additionally, check that the processed image's pixel values are close to the original image's average grey level
        processedImage.forEachPixel((pixelValue) => {
            expect(pixelValue[0]).toBeCloseTo(originalGreyValue, 1);
        });
    });
});