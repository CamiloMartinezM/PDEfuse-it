import { useId} from "react";

export type InputFieldLabelProps = {
    label?: string;
}

export type InputFieldProps = InputFieldLabelProps & {
    type: string;
    className: string;
}

export function InputField({ type, label, className }: InputFieldProps) {
    const fieldId = "input-field-" + useId();
    return (
    <>
        {
            label && <label htmlFor={fieldId} className="form-label">{label}</label>
        }
        <input type={type} className={className} id={fieldId}></input>
    </>
    )
}