import { useEffect, useRef } from "react";
import PageLayout from "../components/page-layout";
import "./home-page.css";
import { getRotationMatrix } from "../utils/2d/shape";
import { Arrow, getCirclePath } from "../utils/2d/shapes";

function draw(ctx: CanvasRenderingContext2D) {
    // blue rect
    // clear the canvas
    // ctx.clearRect(0, 0, 150, 150);
    // const time = new Date();

    // const angle =((2 * Math.PI) / 6) * time.getSeconds() +
    // ((2 * Math.PI) / 6000) * time.getMilliseconds();

    // const square = new Square(25);
    // const rotatedSquare = transformShape(getRotationMatrix(angle), square);
    // ctx.fill(getPath(75, 75, rotatedSquare));

    
    // grey rect
    // ctx.fillStyle = "#4D4E53";
    // ctx.fillRect(30, 30, 100, 100);
    // ctx.restore();
  
    // // right rectangles, rotate from rectangle center
    // // draw blue rect
    // ctx.fillStyle = "#0095DD";
    // ctx.fillRect(150, 30, 100, 100);
  
    // ctx.translate(200, 80); // translate to rectangle center
    // // x = x + 0.5 * width
    // // y = y + 0.5 * height
    // ctx.rotate((Math.PI / 180) * 25); // rotate
    // ctx.translate(-200, -80); // translate back
  
    // // draw grey rect
    // ctx.fillStyle = "#4D4E53";
    // ctx.fillRect(150, 30, 100, 100);
  }

function HomePage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const convasElement = canvasRef.current;

        if (convasElement !== null) {
            const ctx = convasElement.getContext('2d')
            
            if (ctx === null) {
                console.error("Cannot get 2d context from canvas!");
            } else {

                // const square = new Square(25);
                // ctx.fillStyle = 'black';
                // ctx.fill(square.getPath([25, 25]));

                // ctx.fillStyle = 'blue';
                // ctx.fill(getCirclePath(25, 25));

                // ctx.fillStyle = 'red';
                // ctx.fill(getCirclePath(0, 0));

                // const rotated = square.transform(getRotationMatrix(Math.PI / 4));
                // ctx.fillStyle = 'green';
                // ctx.fill(rotated.getPath([25, 25]));

                


                const loop = () => {
                    // clear the canvas
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    const shape = new Arrow();

                    // rotating square animation
                    // get angle from time
                    const time = new Date();
                    const angle = ((2 * Math.PI) / 6) * time.getSeconds() +
                        ((2 * Math.PI) / 6000) * time.getMilliseconds();
                    

                    // get the black rotated square
                    const rotatedShape = shape.transform(getRotationMatrix(angle));
                    ctx.fillStyle = 'black';
                    ctx.fill(rotatedShape.getPath([75,75]));
                    ctx.fillStyle = 'red';
                    ctx.fill(getCirclePath(75, 75));

                    window.requestAnimationFrame(loop);
                    // setTimeout(() => {
                        
                    //     window.requestAnimationFrame(loop);
                    // }, 1000); // Adjust the delay time (in milliseconds desired
    
                }
                
                window.requestAnimationFrame(loop);

                
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
