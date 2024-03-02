export type Pair = [number, number];
export type Matrix = [Pair, Pair];

export function getRotationMatrix(radian: number): Matrix {
    return [[Math.cos(radian), -Math.sin(radian)], [Math.sin(radian), Math.cos(radian)]];
}

export function pairAdd(pair1: Pair, pair2: Pair): Pair {
    return [pair1[0] + pair2[0], pair1[1] + pair2[1]];
}

export function pairInverse(pair: Pair): Pair {
    return [-pair[0], -pair[1]];
}

export function pairMinus(pair1: Pair, pair2: Pair): Pair {
    return pairAdd(pair1, pairInverse(pair2));
}
export function pairDotProduct(pair1: Pair, pair2: Pair): number {
    return pair1[0] * pair2[0] + pair1[1] * pair2[1];
}
export function transformPair(transformMatrix: Matrix, pair: Pair): Pair {
    const [i, j] = transformMatrix;
    return [pairDotProduct(i, pair), pairDotProduct(j, pair)];
}
    
export function pairToString(pair: Pair): string {
    return `(${pair[0]}, ${pair[1]})`;
}

export function cartesianToCanvas(coord: Pair): Pair {
    // Note that the y axis is inverted canvas's coordinate system 
    return [coord[0], -coord[1]];
}

function getEdges(vertices: Pair[]): Pair[] {
    const n = vertices.length;
    const edges: Pair[] = [];
    for (let i = 0; i < n; i++) {
        edges.push(pairMinus(vertices[(i + 1) % n], vertices[i]));
    }
    return edges;
}

export class Shape {
    vertices: Pair[];
    edges: Pair[];
    constructor(vertices: Pair[]) {
        this.vertices = vertices;
        this.edges = getEdges(vertices);
    }

    // note that offset is in canvas's coordinate system
    // but vertices and edges are in Cartesian coordinate system
    getPath(offset: Pair): Path2D {
        const path = new Path2D();

        let penpoint = pairAdd(offset, cartesianToCanvas(this.vertices[0]));

        path.moveTo(...penpoint);
        
        for (let i = 0; i < this.edges.length; i++) {
            // Move to the next vertex
            penpoint = pairAdd(penpoint, cartesianToCanvas(this.edges[i]));
            path.lineTo(...penpoint);
        }

        return path;
    }

    transform(transformationMatrix: Matrix): Shape {
        const vertices = this.vertices.map(vertex => transformPair(transformationMatrix, vertex));
        return new Shape(vertices);
    }

}


export class Square extends Shape {
    constructor(width: number) {
        const a = width / 2;
        super([[-a, a], [a, a], [a, -a], [-a, -a]]);
    }
}




// interface IShape {
//     show(ctx: CanvasRenderingContext2D, degree?: number): void;
// }




// export type Vertex = [number, number];

// export class Shape {
//     vertices: Vertex[];
//     center: Vertex;
//     constructor(vertices: Vertex[]) {
//         this.vertices = vertices;
//         this.center = getCenter(this.vertices);
//     }
// }

// export function getPath(offset: Vertex, shape: Shape): Path2D {
//     const path = new Path2D();

//     let [x, y] = offset;

//     path.moveTo(x, y);
    
//     for (let i = 0; i < shape.vertices.length; i++) {
//         // Move to the next vertex
//         // Note that the canvas's coordinate system is inverted from the Cartesian coordinate system
//         x -= shape.vertices[i][0];
//         y -= shape.vertices[i][1];
//         path.lineTo(x, y);
//     }

//     return path;
// }

// export function transformShape(matrix: TransformationMatrix, shape: Shape): Shape {
//     const vertices = shape.vertices.map(vertex => transformVertex(matrix, vertex));
//     return new Shape(vertices);
// }

// export function rotateOffsets(offsetx: number, offsety: number, centerx: number, centery: number, angle: number) {
//     // square distance between offset point to center point
//     const dist = (centerx - offsetx)**2 + (centery - offsety)**2;
//     Math.cos(angle)
// }

// export function getCenter(vertices: Vertex[]): Vertex {
//     // The center of a polygon is the average of its vertices
//     const n = vertices.length;
//     let x = 0;
//     let y = 0;
//     for (let i = 0; i < n; i++) {
//         x += Math.abs(vertices[i][0]);
//         y += Math.abs(vertices[i][1]);
//     }
//     return [x / n, y / n];
// }


// export function minus(x: Vertex, y: Vertex): Vertex {
//     return [x[0] - y[0], x[1] - y[1]];
// }

// export function transformVertex(matrix: TransformationMatrix, vertex: Vertex): Vertex {
//     const [i, j] = matrix;
//     return [i[0] * vertex[0] + i[1] * vertex[1], j[0] * vertex[0] + j[1] * vertex[1]];
// }

// export class Square extends Shape {
//     constructor(width: number) {
//         super([[width, 0], [0, width], [-width, 0], [0, -width]]);
//     }
// }



/*
Arrow Shape

An arrow consists of two parts: arrow head (the triangle shape in the front) and arrow tail (the rectangular tail)
The relationship between them can be expressed by such formulas:
    h_head = 2 * w_head * tan(θ)
    h_tail = r * h_head
    w_tail = r * w_head
Thus we have the following free variables:
    r (ratio of tail to head)
    width (w_head + w_tail)
    θ (1/2 angle of the arrow head, between 0 and π/4 in radian)
*/


// const DEFAULT_ARROW_PARAMS: ArrowParameters = {
//     r: 2,
//     width: 25,
//     theta: Math.PI / 6
// }
// export class Arrow implements IShape {

//     private x: number;
//     private y: number;
//     private center: [number, number];
//     private params: ArrowParameters;
//     private geo: ArrowGeometry;
//     private path: Path2D;

//     constructor(x: number, y: number, params?: ArrowParameters) {
//         this.x = x;
//         this.y = y;
//         this.params = params ?? DEFAULT_ARROW_PARAMS;
        
//         this.geo = getArrowGeometry(this.params);
//         this.center = [x + this.geo.h_head / 2, y + this.params.width / 2]
//         this.path = getArrowPath(x, y, this.geo.w_head, this.params.width - this.geo.w_head, this.geo.h_head, this.geo.h_tail);
//     }

//     public show(ctx: CanvasRenderingContext2D, degree?: number): void {
//         ctx.fill(this.path)
//         if (degree !== undefined) {
//             ctx.translate(this.center[0], this.center[1])
//             ctx.rotate(degree);
//             ctx.translate(-this.center[0], -this.center[1])

//         }

//     }
// }

// function getArrowGeometry(params: ArrowParameters): ArrowGeometry {
//     const { r, width, theta } = params;
//     if (theta <= 0 || theta >= Math.PI / 2) throw new Error("Invalid angle");

//     return {
//         w_head: width / (1 + r),
//         h_head: 2 * width / (1 + r) * Math.tan(theta),
//         h_tail: (r > 1 ? 1/r : r) * 2 * width / (1 + r) * Math.tan(theta)
//     }
// }

// type ArrowParameters = {
//     r: number;
//     width: number;
//     theta: number;
// }

// type ArrowGeometry = {
//     w_head: number;
//     h_head: number;
//     // w_tail: number; // Not used as it can be calculated by width - w_head
//     h_tail: number;
// }

// function getArrowPath(x: number, y: number, w_head: number, w_tail: number, h_head: number, h_tail: number): Path2D {
//     const path = new Path2D();
//     path.moveTo(x, y);
//     path.lineTo(x + w_head, y + h_head / 2);
//     path.lineTo(x + w_head, y + h_tail / 2);
//     path.lineTo(x + w_head + w_tail, y + h_tail / 2);
//     path.lineTo(x + w_head + w_tail, y - h_tail / 2);
//     path.lineTo(x + w_head, y - h_tail / 2);
//     path.lineTo(x + w_head, y - h_head / 2);
//     path.closePath();
//     return path;
// }

/* End of Arrow Shape */
