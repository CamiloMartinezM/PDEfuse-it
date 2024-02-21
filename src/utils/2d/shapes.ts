interface IShape {
    show(ctx: CanvasRenderingContext2D, degree?: number): void;
}

export type TransformationMatrix = [Vertex, Vertex];

export function getRotationMatrix(radian: number): TransformationMatrix {
    return [[Math.cos(radian), -Math.sin(radian)], [Math.sin(radian), Math.cos(radian)]];
}

export type Vertex = [number, number];

export class Shape {
    vertices: Vertex[];

    constructor(vertices: Vertex[]) {
        this.vertices = vertices;
    }
}

export function getPath(offsetx: number, offsety: number, shape: Shape): Path2D {
    const path = new Path2D();

    let x = offsetx;
    let y = offsety;

    path.moveTo(x, y);
    
    for (let i = 0; i < shape.vertices.length; i++) {
        // Move to the next vertex
        // Note that the canvas's coordinate system is inverted from the Cartesian coordinate system
        x -= shape.vertices[i][0];
        y -= shape.vertices[i][1];
        path.lineTo(x, y);
    }

    return path;
}

export function transformShape(matrix: TransformationMatrix, shape: Shape): Shape {
    const vertices = shape.vertices.map(vertex => transformVertex(matrix, vertex));
    return new Shape(vertices);
}

export function transformVertex(matrix: TransformationMatrix, vertex: Vertex): Vertex {
    const [i, j] = matrix;
    return [i[0] * vertex[0] + i[1] * vertex[1], j[0] * vertex[0] + j[1] * vertex[1]];
}

export class Square extends Shape {
    constructor(width: number) {
        super([[width, 0], [0, width], [-width, 0], [0, -width]]);
    }
}



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
