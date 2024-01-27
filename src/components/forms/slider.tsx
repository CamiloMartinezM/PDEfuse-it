import { InputField, InputFieldLabelProps } from "./input-field"

export default function Slider({ label }: InputFieldLabelProps) {
    return <InputField type="slider" className="form-range" label={label} />
}