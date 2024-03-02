import { Pair, getRotationMatrix } from "./shape";
import { Arrow } from "./shapes";

export class VectorField {
    field: Pair[][];
    constructor(field: Pair[][]) {
        this.field = field;
    }
    getPath(offset: Pair = [0, 0]): Path2D {
        const path = new Path2D();
        const arrow = new Arrow();
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[i].length; j++) {
                const [x, y] = this.field[i][j];
                const rotatedArrow = arrow.transform(getRotationMatrix(Math.atan2(y, x)));
                const cellSize = 25;
                path.addPath(rotatedArrow.getPath([(i + 1) * cellSize, (j + 1) * cellSize]));
            }
        }
        return path;
    }
}