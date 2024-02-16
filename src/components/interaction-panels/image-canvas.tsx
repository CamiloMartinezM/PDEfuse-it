import { useEffect, useRef } from "react";
import { drawImage } from "../utils";

export type ImageCanvasProps = {
    data: number[]; // grey scaled img data
    width: number;
    height: number;
}

export function ImageCanvas({ data, width, height }: ImageCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const convasElement = canvasRef.current;

        if (convasElement !== null) {
            const ctx = convasElement.getContext('2d');
            
            if (ctx === null) {
                console.error("Cannot get 2d context from canvas!");
            } else {
                drawImage(ctx, data, width, height);
            }
        }
      }, [canvasRef, data, width, height])

    return (
        <canvas width={width} height={height} ref={canvasRef} />
    )
}
