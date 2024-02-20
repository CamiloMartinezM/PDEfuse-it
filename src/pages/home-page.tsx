import { useEffect, useRef } from "react";
import PageLayout from "../components/page-layout";
import "./home-page.css";
import { arrow } from "../utils/2d/shapes";

function draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {

            const degree = 45; // change this
            
            const arrowPath = arrow(25 * i, 25 * j);
            ctx.save();
            ctx.rotate((degree * Math.PI) / 180); // Rotate
            ctx.fill(arrowPath);
            ctx.restore();
        }
    }
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
                draw(ctx)
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
