import { Square, getRotationMatrix } from "./shape";

test('edge of a square should be generated correctly', () => {
    const square = new Square(43);
    
    expect(square.edges).toEqual([
        [43, 0],
        [0, -43],
        [-43, 0],
        [0, 43]
    ]);
})

test('vertices of the square should be rotated correctly', () => {
    const square = new Square(10);
    const rotated = square.transform(getRotationMatrix(Math.PI / 4));
    const sqrtTwo = Math.sqrt(2);
    expect(rotated.vertices).toEqual(
        [
            [0, 5 * sqrtTwo],
            [5 * sqrtTwo, 0],
            [0, -5 * sqrtTwo],
            [-5 * sqrtTwo, 0]
        ]
    )
})