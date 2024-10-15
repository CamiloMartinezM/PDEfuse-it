/**
 * @brief Helper functions that handle images.
 * @file image-helpers.ts
 */
import { ImageBuffer, ImageType } from './ImageBuffer'

/**
 * Converts an RGB image to grayscale.
 * @param imageData The input ImageData object
 * @returns A new ImageData object with the grayscale image
 */
export function rgbToGrayscale(imageData: ImageData): ImageData {
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    data[i] = data[i + 1] = data[i + 2] = gray
  }
  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Normalizes the image by stretching its histogram to the full [0, 255] range.
 * @param imageData The input ImageData object
 * @returns A new ImageData object with the normalized image
 */
export function normalizeImage(imageData: ImageData): ImageData {
  const data = imageData.data
  let min = 255
  let max = 0

  // Find the minimum and maximum pixel values
  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      const value = data[i + j]
      if (value < min) min = value
      if (value > max) max = value
    }
  }

  // Normalize the pixel values
  const range = max - min
  if (range === 0) return imageData // Avoid division by zero

  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      data[i + j] = ((data[i + j] - min) / range) * 255
    }
  }

  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Converts sRGB values to linear RGB.
 * @param rgb An array of three sRGB values (0-255)
 * @returns An array of three linear RGB values (0-1)
 */
export function srgbToLinear(rgb: number[]): number[] {
  return rgb.map((v) => {
    v = v / 255
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
}

/**
 * Converts linear RGB values to sRGB.
 * @param rgb An array of three linear RGB values (0-1)
 * @returns An array of three sRGB values (0-255)
 */
export function linearToSrgb(rgb: number[]): number[] {
  return rgb.map((v) => {
    v = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055
    return Math.round(v * 255)
  })
}

/**
 * Applies sRGB to linear conversion to the image.
 * @param imageData The input ImageData object
 * @returns A new ImageData object with sRGB to linear conversion applied
 */
export function applySRGB(imageData: ImageData): ImageData {
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const linear = srgbToLinear([data[i], data[i + 1], data[i + 2]])
    ;[data[i], data[i + 1], data[i + 2]] = linear.map((v) => {
      return Math.round(v * 255)
    })
  }

  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Applies gamma correction to the image.
 * @param imageData The input ImageData object
 * @param gamma The gamma value to apply
 * @returns A new ImageData object with gamma correction applied
 */
export function applyGamma(imageData: ImageData, gamma: number): ImageData {
  const data = imageData.data
  const invGamma = 1 / gamma

  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      data[i + j] = Math.pow(data[i + j] / 255, invGamma) * 255
    }
  }

  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Applies exposure adjustment to the image.
 * @param imageData The input ImageData object
 * @param exposure The exposure value to apply (positive for brighter, negative for darker)
 * @returns A new ImageData object with exposure adjustment applied
 */
export function applyExposure(imageData: ImageData, exposure: number): ImageData {
  const data = imageData.data
  const factor = Math.pow(2, exposure)

  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      data[i + j] = Math.min(255, Math.max(0, data[i + j] * factor))
    }
  }

  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Applies offset adjustment to the image.
 * @param imageData The input ImageData object
 * @param offset The offset value to apply (positive or negative)
 * @returns A new ImageData object with offset adjustment applied
 */
export function applyOffset(imageData: ImageData, offset: number): ImageData {
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      data[i + j] = Math.min(255, Math.max(0, data[i + j] + offset))
    }
  }

  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Inverts the colors of the image.
 * @param imageData The input ImageData object
 * @returns A new ImageData object with inverted colors
 */
export function applyColorInversion(imageData: ImageData): ImageData {
  // TODO: Implement the reverse so that it can be reset
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      data[i + j] = 255 - data[i + j]
    }
  }

  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Applies a False Color filter to the image.
 * @param imageData The input ImageData object
 * @returns A new ImageData object with the False Color filter applied
 */
export function applyFC(imageData: ImageData): ImageData {
  // TODO: Check implementation
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = avg < 128 ? 0 : 255 // Red
    data[i + 1] = avg // Green
    data[i + 2] = avg > 128 ? 255 : 0 // Blue
  }
  return new ImageData(data, imageData.width, imageData.height)
}

/**
 * Creates test ImageData with random pixel values based on the specified image type.
 * @param width - The width of the image.
 * @param height - The height of the image.
 * @param type - The type of the image (grayscale or RGB).
 * @returns ImageData with random pixel values.
 */
export function createTestImageData(width: number, height: number, type: ImageType): ImageData {
  let imageData = new ImageData(width, height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const grayValue = Math.floor(Math.random() * 256) // Random grayscale value between 0 and 255
    if (type === ImageType.GRAYSCALE) {
      imageData.data[i] = grayValue // R
      imageData.data[i + 1] = grayValue // G
      imageData.data[i + 2] = grayValue // B
    } else if (type === ImageType.RGB) {
      imageData.data[i] = grayValue // R
      imageData.data[i + 1] = Math.floor(Math.random() * 256) // G
      imageData.data[i + 2] = Math.floor(Math.random() * 256) // B
    } else {
      throw new Error(`Unsupported image type: ${type}`)
    }
    imageData.data[i + 3] = 255 // Alpha
  }
  return imageData
}

/**
 * Creates test ImageBuffer with random pixel values based on the specified image type.
 * @param width - The width of the image.
 * @param height - The height of the image.
 * @param type - The type of the image (grayscale or RGB).
 * @returns ImageBuffer with random pixel values.
 */
export function createTestImageBuffer(width: number, height: number, type: ImageType): ImageBuffer {
  const newImage = new ImageBuffer(width, height, type)

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (type === ImageType.GRAYSCALE) {
        const grayValue = Math.floor(Math.random() * 256) // Random grayscale value between 0 and 255
        newImage.setPixel(j, i, [grayValue])
      } else if (type === ImageType.RGB) {
        const redValue = Math.floor(Math.random() * 256)
        const greenValue = Math.floor(Math.random() * 256)
        const blueValue = Math.floor(Math.random() * 256)
        newImage.setPixel(j, i, [redValue, greenValue, blueValue])
      } else throw new Error(`Unsupported image type: ${type}`)
    }
  }

  return newImage
}
