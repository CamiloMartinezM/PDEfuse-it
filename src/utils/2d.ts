export function drawImage(
    ctx: CanvasRenderingContext2D, 
    data: number[],
    width: number,
    height: number) {
        // Iterate through the buffer and draw pixels on the canvas
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Calculate the index in the greyValues array
                const index = (y * width + x) * 1;
            
                // Get the grey value (replace 1 with the number of channels if more than 1)
                const greyValue = data[index];
            
                // Draw the pixel on the canvas
                ctx.fillStyle = `rgb(${greyValue}, ${greyValue}, ${greyValue})`;
                ctx.fillRect(x, y, 1, 1);
            }
        }    

    }

export function readPGMFile(file: File) {
    const reader = file.stream().getReader();
    reader.read()
}

// export function smallArrow(x, y)
