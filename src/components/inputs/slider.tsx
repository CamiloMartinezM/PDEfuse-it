import React from "react";

export type SliderProps = {
    min?: number;
    max?: number;
    step?: number;
}
export function Slider({ min = 0, max = 100, step = 1 }: SliderProps) {
    return  (
        <>
            <label htmlFor="slider-field"></label>
            <input type="range"className="form-range" id="slider-field" min={min} max={max} step={step} ></input>
        </>
    )

}