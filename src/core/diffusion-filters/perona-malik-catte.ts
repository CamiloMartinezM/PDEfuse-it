/**
 * @brief Perona-Malik filter with Catte regularization implementation.
 * @file perona-malik-catte.ts
 */
import { PaddingType } from '../utils/padding'
import { ImageBuffer, ImageType } from '../images/ImageBuffer'

/**
 * Performs Gaussian convolution on the input image.
 * @param sigma Standard deviation of the Gaussian
 * @param prec Cutoff at precision * sigma
 * @param nx Image dimension in x direction
 * @param ny Image dimension in y direction
 * @param hx Pixel size in x direction
 * @param hy Pixel size in y direction
 * @param u Input/output ImageBuffer
 */
export function gaussConv(
  sigma: number,
  prec: number,
  nx: number,
  ny: number,
  hx: number,
  hy: number,
  u: ImageBuffer
): void {
  // Helper function to allocate a vector
  const allocDoubleVector = (size: number): number[] => new Array(size).fill(0)

  // Convolution in x direction
  let length = Math.floor((prec * sigma) / hx) + 1
  let conv = allocDoubleVector(length + 1)

  // Compute entries of convolution vector
  let aux1 = 1.0 / (sigma * Math.sqrt(2.0 * Math.PI))
  let aux2 = (hx * hx) / (2.0 * sigma * sigma)
  for (let i = 0; i <= length; i++) {
    conv[i] = aux1 * Math.exp(-i * i * aux2)
  }

  // Normalization
  let sum = conv[0]
  for (let i = 1; i <= length; i++) {
    sum += 2.0 * conv[i]
  }
  for (let i = 0; i <= length; i++) {
    conv[i] /= sum
  }

  let help = allocDoubleVector(nx + 2 * length)

  for (let j = 0; j < ny; j++) {
    // Copy u in row vector
    for (let i = 0; i < nx; i++) {
      help[i + length] = u.getPixel(i, j)[0]
    }

    // Extend signal by mirroring
    let k = length
    let l = length + nx - 1
    while (k > 0) {
      let pmax = Math.min(k, nx)
      for (let p = 1; p <= pmax; p++) {
        help[k - p] = help[k + p - 1]
        help[l + p] = help[l - p + 1]
      }
      k -= nx
      l += nx
    }

    // Convolution step
    for (let i = length; i <= nx + length - 1; i++) {
      sum = conv[0] * help[i]
      for (let p = 1; p <= length; p++) {
        sum += conv[p] * (help[i + p] + help[i - p])
      }
      u.setPixel(i - length, j, [sum])
    }
  }

  // Convolution in y direction
  length = Math.floor((prec * sigma) / hy) + 1
  conv = allocDoubleVector(length + 1)

  // Compute entries of convolution vector
  aux1 = 1.0 / (sigma * Math.sqrt(2.0 * Math.PI))
  aux2 = (hy * hy) / (2.0 * sigma * sigma)
  for (let j = 0; j <= length; j++) {
    conv[j] = aux1 * Math.exp(-j * j * aux2)
  }

  // Normalization
  sum = conv[0]
  for (let j = 1; j <= length; j++) {
    sum += 2.0 * conv[j]
  }
  for (let j = 0; j <= length; j++) {
    conv[j] /= sum
  }

  help = allocDoubleVector(ny + 2 * length)

  for (let i = 0; i < nx; i++) {
    // Copy u in column vector
    for (let j = 0; j < ny; j++) {
      help[j + length] = u.getPixel(i, j)[0]
    }

    // Extend signal by mirroring
    let k = length
    let l = length + ny - 1
    while (k > 0) {
      let pmax = Math.min(k, ny)
      for (let p = 1; p <= pmax; p++) {
        help[k - p] = help[k + p - 1]
        help[l + p] = help[l - p + 1]
      }
      k -= ny
      l += ny
    }

    // Convolution step
    for (let j = length; j <= ny + length - 1; j++) {
      sum = conv[0] * help[j]
      for (let p = 1; p <= length; p++) {
        sum += conv[p] * (help[j + p] + help[j - p])
      }
      u.setPixel(i, j - length, [sum])
    }
  }
}

/**
 * Applies the Perona-Malik filter with Catte regularization to an ImageBuffer.
 * @param inputImage - The input ImageBuffer
 * @param iterations - Number of iterations
 * @param tau - Time step size (0 < tau < 0.25)
 * @param lambda - Contrast parameter
 * @param sigma - Noise scale
 * @param paddingType - Type of padding to apply
 * @returns A new ImageBuffer with the filter applied
 */
export const applyToImageBuffer = (
  inputImage: ImageBuffer,
  iterations: number,
  tau: number,
  lambda: number,
  sigma: number,
  paddingType: PaddingType = PaddingType.CONSTANT
): ImageBuffer => {
  const nx = inputImage.width
  const ny = inputImage.height
  const hx = 1.0 // pixel size in x direction
  const hy = 1.0 // pixel size in y direction
  const paddingSize = 1

  // Apply padding to the input image
  inputImage.pad(paddingSize, paddingSize, paddingType)

  // Clone the input ImageBuffer for processing
  const u = inputImage.clone()

  const catte = (u: ImageBuffer) => {
    const f = u.clone()
    const v = u.clone()
    const g = new ImageBuffer(nx + 2, ny + 2, ImageType.GRAYSCALE)

    // Regularize v by Gaussian convolution
    if (sigma > 0.0) {
      gaussConv(sigma, 5.0, nx, ny, hx, hy, v)
    }

    // Compute diffusivities g
    const invTwoHx = 1.0 / (2.0 * hx)
    const invTwoHy = 1.0 / (2.0 * hy)
    const aux = 1.0 / (2.0 * lambda * lambda)

    for (let i = 1; i <= nx; i++) {
      for (let j = 1; j <= ny; j++) {
        const vx = (v.getPixel(i + 1, j)[0] - v.getPixel(i - 1, j)[0]) * invTwoHx
        const vy = (v.getPixel(i, j + 1)[0] - v.getPixel(i, j - 1)[0]) * invTwoHy
        const gradSqr = vx * vx + vy * vy
        g.setPixel(i, j, [Math.exp(-gradSqr * aux)])
      }
    }

    // Perform one diffusion step
    const rxx = tau / (2.0 * hx * hx)
    const ryy = tau / (2.0 * hy * hy)

    for (let i = 1; i <= nx; i++) {
      for (let j = 1; j <= ny; j++) {
        const newVal =
          f.getPixel(i, j)[0] +
          rxx *
            ((g.getPixel(i + 1, j)[0] + g.getPixel(i, j)[0]) *
              (f.getPixel(i + 1, j)[0] - f.getPixel(i, j)[0]) +
              (g.getPixel(i - 1, j)[0] + g.getPixel(i, j)[0]) *
                (f.getPixel(i - 1, j)[0] - f.getPixel(i, j)[0])) +
          ryy *
            ((g.getPixel(i, j + 1)[0] + g.getPixel(i, j)[0]) *
              (f.getPixel(i, j + 1)[0] - f.getPixel(i, j)[0]) +
              (g.getPixel(i, j - 1)[0] + g.getPixel(i, j)[0]) *
                (f.getPixel(i, j - 1)[0] - f.getPixel(i, j)[0]))
        u.setPixel(i, j, [newVal])
      }
    }
  }

  // Apply the Perona-Malik filter for the given number of iterations
  for (let k = 0; k < iterations; k++) {
    catte(u)
  }

  // Trim the padding from the processed ImageBuffer
  u.trimPadding(paddingSize)

  return u
}

/**
 * Applies the Perona-Malik filter with Catte regularization to ImageData.
 * @param imageData - The input ImageData
 * @param iterations - Number of iterations
 * @param tau - Time step size (0 < tau < 0.25)
 * @param lambda - Contrast parameter
 * @param sigma - Noise scale
 * @param paddingType - Type of padding to apply
 * @returns A new ImageData with the filter applied
 */
export const applyToImageData = (
  imageData: ImageData,
  iterations: number = 10,
  tau: number = 0.24,
  lambda: number = 5,
  sigma: number = 1,
  paddingType: PaddingType = PaddingType.CONSTANT
): ImageData => {
  let inputImage = ImageBuffer.fromImageData(imageData, ImageType.GRAYSCALE)
  const outputImage = applyToImageBuffer(inputImage, iterations, tau, lambda, sigma, paddingType)
  return outputImage.toImageData()
}
