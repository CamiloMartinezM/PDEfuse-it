import { Shape } from "./shape";

export const getCirclePath = (x: number, y: number, radius: number = 2): Path2D => {
    const path = new Path2D();
    path.arc(x, y, 2, 0, radius * Math.PI, false);
    return path;
}

export class Arrow extends Shape {
    constructor(
        theta: number = Math.PI / 4,
        whead: number = 20,
        wtail: number = 30,
        htail: number = 20
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
            [width / 2 - whead, hhead / 2],
            [width / 2 - whead, (hhead - htail) / 2],
            [width / 2, (hhead - htail) / 2],
            [width / 2, -(hhead - htail) / 2],
            [width / 2 - whead, -(hhead - htail) / 2],
            [width / 2 - whead, -hhead / 2],
            [-width / 2, 0],
        ])
    }
}