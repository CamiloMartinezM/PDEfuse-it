import { Shape } from "./shape";

export const getCirclePath = (x: number, y: number, radius: number = 2): Path2D => {
    const path = new Path2D();
    path.arc(x, y, 2, 0, radius * Math.PI, false);
    return path;
}

export class Arrow extends Shape {
    constructor(
        theta: number = Math.PI / 4,
        whead: number = 5,
        wtail: number = 5,
        htail: number = 5
    ) {
        const hhead = whead * Math.tan(theta) * 2;
        const width = whead + wtail;

        // width and height should be positive
        // htail should be less than hhead
        // theta should be between 0 and π/2 (not inclusive)
        if (whead <= 0 || wtail <= 0 || htail <= 0 ||
            theta <= 0 || theta >= Math.PI / 2 ||
            hhead <= htail
        ) throw new Error('Invalid arrow parameters');
        
        super([
            [whead - width / 2, hhead / 2],
            [whead - width / 2, (hhead - htail) / 2],
            [width / 2, (hhead - htail) / 2],
            [width / 2, -(hhead - htail) / 2],
            [whead - width / 2, -(hhead - htail) / 2],
            [whead - width / 2, -hhead / 2],
            [-width / 2, 0],
        ])
    }
}