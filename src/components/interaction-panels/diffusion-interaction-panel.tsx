import { ChangeEvent, useState } from "react";
import { FileInput } from "../inputs/file-input";
import { Slider } from "../inputs/slider";

export function DiffusionInteractionPanel() {
    const [file, setFile] = useState<File | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            var f = e.target.files[0];
            f.arrayBuffer()

        }
    };
    return <div>
        <FileInput onChange={handleImageChange} />
        {/* <ImageCanvas image={...} /> */}
        <Slider />
    </div>
}