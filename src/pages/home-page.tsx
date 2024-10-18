import { useEffect, useRef } from "react";
import PageLayout from "../components/page-layout";
import "./home-page.css";
import { getRotationMatrix } from "../utils/2d/shape";
import { Arrow, getCirclePath } from "../utils/2d/shapes";
import { VectorField } from "../utils/2d/vector-field";
import React from "react";

function HomePage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const convasElement = canvasRef.current;

        if (convasElement !== null) {
            const ctx = convasElement.getContext('2d');
            
            if (ctx === null) {
                console.error("Cannot get 2d context from canvas!");
            } else {

                const field = new VectorField([
                    [ [-1, -1], [1, 0], [1, 0], [1, 0], [1, 0] ],
                    [ [1, 0], [-1, -1], [1, 0], [1, 0], [1, 0] ],
                    [ [1, 0], [1, 0], [-1, -1], [1, 0], [1, 0] ],
                    [ [1, 0], [1, 0], [1, 0], [-1, -1], [1, 0] ],
                    [ [1, 0], [1, 0], [1, 0], [1, 0], [-1, -1] ]
                ]);

                ctx.fill(field.getPath());
                // const loop = () => {
                //     // clear the canvas
                //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                //     const shape = new Arrow();

                //     // rotating square animation
                //     // get angle from time
                //     const time = new Date();
                //     const angle = ((2 * Math.PI) / 6) * time.getSeconds() +
                //         ((2 * Math.PI) / 6000) * time.getMilliseconds();

                //     // get the black rotated square
                //     const rotatedShape = shape.transform(getRotationMatrix(angle));
                //     ctx.fillStyle = 'black';
                //     ctx.fill(rotatedShape.getPath([75,75]));
                //     ctx.fillStyle = 'red';
                //     ctx.fill(getCirclePath(75, 75));

                //     window.requestAnimationFrame(loop);    
                // }
                
                // window.requestAnimationFrame(loop);

                
            }
        }
      }, [canvasRef])      

    return (
        <PageLayout>
            <div className="d-flex justify-content-center">
                <canvas id="canvas" width="150" height="150" ref={canvasRef}></canvas>
            </div>
        </PageLayout>
    );
};

export default HomePage;
