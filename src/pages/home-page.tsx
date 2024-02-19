import { useEffect, useRef } from "react";
import PageLayout from "../components/page-layout";
import "./home-page.css";

function draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(25, 50);
    ctx.lineTo(50, 75);
    ctx.lineTo(50, 65);
    ctx.lineTo(100, 65);
    ctx.lineTo(100, 35);
    ctx.lineTo(50, 35);
    ctx.lineTo(50, 25);


    
    ctx.fill();
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
