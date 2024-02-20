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
export function arrow(
    x: number,
    y: number, 
    r: number = 2.5,
    width: number = 24,
    theta: number = Math.PI / 6
    ): Path2D {
    const { w_head, h_head, h_tail } = getArrowDescription(r, width, theta);
    const path = new Path2D();
    path.moveTo(x, y);
    path.lineTo(x + w_head, y + h_head / 2);
    path.lineTo(x + w_head, y + h_tail / 2);
    path.lineTo(x + width, y + h_tail / 2);
    path.lineTo(x + width, y - h_tail / 2);
    path.lineTo(x + w_head, y - h_tail / 2);
    path.lineTo(x + w_head, y - h_head / 2);
    path.closePath();
    return path;
}

function getArrowDescription(r: number, width: number, theta: number): ArrowDescription {
    if (theta <= 0 || theta >= Math.PI / 4) throw new Error("Invalid angle");

    return {
        w_head: width / (1 + r),
        h_head: 2 * width / (1 + r) * Math.tan(theta),
        h_tail: (r > 1 ? 1/r : r) * 2 * width / (1 + r) * Math.tan(theta)
    }
}

type ArrowDescription = {
    w_head: number;
    h_head: number;
    // w_tail: number; // Not used as it can be calculated by width - w_head
    h_tail: number;
}

/* End of Arrow Shape */
