/**
 * @brief Test cases for the padding util function.
 * @file padding.test.ts
 */
import { padMatrix, PaddingType } from '../../../src/core/utils/padding';

/**
 * These test cases verify the behavior of the padding function by checking the expected width and height
 * of the padded matrix after applying different padding width and height values.
 */
describe('Test output size of padMatrix function', () => {
    const originalMatrix = [
        [[1], [2]],
        [[3], [4]]
    ];

    const testCases = [
        { matrix: originalMatrix, padWidth: 0, padHeight: 0, expectedWidth: 2, expectedHeight: 2 },
        { matrix: originalMatrix, padWidth: 1, padHeight: 1, expectedWidth: 4, expectedHeight: 4 },
        { matrix: originalMatrix, padWidth: 3, padHeight: 3, expectedWidth: 8, expectedHeight: 8 }
    ];

    Object.values(PaddingType).forEach((paddingType) => {
        describe(`with PaddingType ${paddingType}`, () => {
            testCases.forEach(({ matrix, padWidth, padHeight, expectedWidth, expectedHeight }) => {
                test(`matrix of size ${matrix.length}x${matrix[0].length} should have padded size of ${expectedWidth}x${expectedHeight} ` + 
                    `for padWidth = ${padWidth} and padHeight = ${padHeight}`, () => {
                    const paddedMatrix = padMatrix(matrix, padWidth, padHeight, paddingType);
                    expect(paddedMatrix[0].length).toBe(expectedWidth);
                    expect(paddedMatrix.length).toBe(expectedHeight);
                });
            });
        });
    });
});

/**
 * These test cases verify the actual output of the padding function by checking the resulting padded matrix.
 */
describe('Test values of padded matrix', () => {
    // Example matrix
    const exampleMatrix = [
        [[1], [2]],
        [[3], [4]]
    ];

    const paddingTestCases = [
        {
            padWidth: 2, padHeight: 2, paddingType: PaddingType.CONSTANT, expectedMatrix: [
                [[0], [0], [0], [0], [0], [0]],
                [[0], [0], [0], [0], [0], [0]],
                [[0], [0], [1], [2], [0], [0]],
                [[0], [0], [3], [4], [0], [0]],
                [[0], [0], [0], [0], [0], [0]],
                [[0], [0], [0], [0], [0], [0]]
            ]
        },
        {
            padWidth: 2, padHeight: 2, paddingType: PaddingType.REPEAT, expectedMatrix: [
                [[1], [2], [1], [2], [1], [2]],
                [[3], [4], [3], [4], [3], [4]],
                [[1], [2], [1], [2], [1], [2]],
                [[3], [4], [3], [4], [3], [4]],
                [[1], [2], [1], [2], [1], [2]],
                [[3], [4], [3], [4], [3], [4]]
            ]
        },
        {
            padWidth: 2, padHeight: 2, paddingType: PaddingType.MIRROR, expectedMatrix: [
                [[4], [3], [3], [4], [4], [3]],
                [[2], [1], [1], [2], [2], [1]],
                [[2], [1], [1], [2], [2], [1]],
                [[4], [3], [3], [4], [4], [3]],
                [[4], [3], [3], [4], [4], [3]],
                [[2], [1], [1], [2], [2], [1]]
            ]
        },
        {
            padWidth: 2, padHeight: 2, paddingType: PaddingType.EXTEND, expectedMatrix: [
                [[1], [1], [1], [2], [2], [2]],
                [[1], [1], [1], [2], [2], [2]],
                [[1], [1], [1], [2], [2], [2]],
                [[3], [3], [3], [4], [4], [4]],
                [[3], [3], [3], [4], [4], [4]],
                [[3], [3], [3], [4], [4], [4]]
            ]
        }
    ];

    paddingTestCases.forEach(({ paddingType, expectedMatrix }) => {
        test(`with PaddingType ${paddingType}`, () => {
            const paddedMatrix = padMatrix(exampleMatrix, 2, 2, paddingType);
            expect(paddedMatrix).toEqual(expectedMatrix);
        });
    });
});

/**
 * These test cases verify additional requirements of the padding function.
 * For instance, throwing an Error if an unsupported PaddingType is provided.
 */
describe('Additional padMatrix requirements', () => {
    // Test for invalid padding type
    test('Invalid PaddingType throws Error', () => {
        expect(() => {
            padMatrix([[[]]], 1, 1, "INVALID" as PaddingType);
        }).toThrow('Unsupported padding type: INVALID');
    })
});