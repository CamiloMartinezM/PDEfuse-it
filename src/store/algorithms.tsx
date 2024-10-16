import { applyToImageData as applyHomogeneousDiffusion } from '../core/diffusion-filters/homogeneous-diffusion'
import { applyToImageData as applyHomogeneousDiffusionInpainting } from '../core/diffusion-filters/homogeneous-diffusion-inpainting'
import { applyToImageData as applyPeronaMalikCatte } from '../core/diffusion-filters/perona-malik-catte'

/* Custom Types */

type AlgorithmParameter = {
  label: string
  type: string
  value: number | string
  step?: string
}

export type Algorithm = {
  name: string
  parameters: AlgorithmParameter[]
  descriptionFile: string
  applyFunction: (imageData: ImageData, ...args: any[]) => ImageData
}

/**
 * List of available diffusion algorithms
 */
export const algorithms: Algorithm[] = [
  {
    name: 'Homogeneous Diffusion',
    parameters: [
      { label: 'Number of Iterations:', type: 'number', value: 10 },
      { label: 'Time-step:', type: 'number', value: 0.25, step: '0.01' }
    ],
    descriptionFile: 'homogeneous-diffusion.md',
    applyFunction: applyHomogeneousDiffusion
  },
  {
    name: 'Perona-Malik with Catte',
    parameters: [
      { label: 'Number of Iterations:', type: 'number', value: 10 },
      { label: 'Time-step:', type: 'number', value: 0.24, step: '0.01' },
      { label: 'Lambda:', type: 'number', value: 5, step: '0.1' },
      { label: 'Sigma:', type: 'number', value: 1, step: '0.1' }
    ],
    descriptionFile: 'perona-malik-catte.md',
    applyFunction: applyPeronaMalikCatte
  },
  {
    name: 'Homogeneous Diffusion Inpainting',
    parameters: [
      { label: 'iterations', value: 10, type: 'number' },
      { label: 'tau', value: 0.24, type: 'number' }
    ],
    descriptionFile: 'homogeneous-diffusion.md',
    applyFunction: applyHomogeneousDiffusionInpainting
  }
  // Add more algorithms here
]
