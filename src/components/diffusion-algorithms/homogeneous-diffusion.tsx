type PixelMatrix = number[][];

const allocateMatrix = (width: number, height: number): PixelMatrix => {
    // Add 2 to width and height to account for the border
    return Array.from({ length: height + 2 }, () => new Array(width + 2).fill(0));
};

const applyHomogeneousDiffusion = (
    inputMatrix: PixelMatrix,
    width: number,
    height: number,
    iterations: number,
    tau: number
): PixelMatrix => {
    const hx = 1.0; // pixel size in x direction
    const hy = 1.0; // pixel size in y direction
    const c: number[][] = allocateMatrix(width, height).map(() => new Array(width).fill(0));
    const u: number[][] = inputMatrix.map((row) => [...row]);

    const dummiesDouble = (u: number[][], nx: number, ny: number) => {
        for (let i = 1; i <= nx; i++) {
            u[i][0] = u[i][1];
            u[i][ny + 1] = u[i][ny];
        }

        for (let j = 0; j <= ny + 1; j++) {
            u[0][j] = u[1][j];
            u[nx + 1][j] = u[nx][j];
        }
    };

    const hdEx = (tau: number, nx: number, ny: number) => {
        const rx = tau / (hx * hx);
        const ry = tau / (hy * hy);
        const f: number[][] = allocateMatrix(nx + 2, ny + 2).map(() => new Array(ny + 2).fill(0));

        for (let i = 1; i <= nx; i++) {
            for (let j = 1; j <= ny; j++) {
                f[i][j] = u[i][j];
            }
        }

        dummiesDouble(f, nx, ny);

        // Process from 1 to nx/ny, respecting the added border
        for (let i = 1; i <= nx; i++) {
            for (let j = 1; j <= ny; j++) {
                if (c[i][j] === 0) {
                    u[i][j] =
                        (1 - 2 * rx - 2 * ry) * f[i][j] +
                        rx * f[i + 1][j] +
                        rx * f[i - 1][j] +
                        ry * f[i][j + 1] +
                        ry * f[i][j - 1];
                }
            }
        }

        return;
    };

    for (let k = 1; k <= iterations; k++) {
        hdEx(tau, width, height);
    }

    return u;
};

export const processImageWithHomogeneousDiffusion = (
    imageData: ImageData,
    iterations: number = 10, // Default number of iterations
    tau: number = 0.25 // Default time step size
): ImageData => {
    const width = imageData.width;
    const height = imageData.height;
    const inputMatrix: PixelMatrix = allocateMatrix(width, height);

    // Fill inputMatrix with pixel values from imageData, starting at 1 to leave a border
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const index = (i * width + j) * 4;
            const red = imageData.data[index];
            const green = imageData.data[index + 1];
            const blue = imageData.data[index + 2];
            inputMatrix[i + 1][j + 1] = (red + green + blue) / 3; // Average of RGB values
        }
    }

    const outputMatrix = applyHomogeneousDiffusion(inputMatrix, width, height, iterations, tau);

    // Create a new ImageData object from outputMatrix
    const newImageData = new ImageData(width, height);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const value = outputMatrix[i][j];
            const index = (i * width + j) * 4;
            newImageData.data[index] = value;
            newImageData.data[index + 1] = value;
            newImageData.data[index + 2] = value;
            newImageData.data[index + 3] = 255; // Alpha value
        }
    }

    return newImageData;
};