import { ReactNode } from "react";

export type FormFieldProps = {
    label?: string;
    child: ReactNode;
}

export function FormField({ label, child }: FormFieldProps) {
    return (
    <>
        {
            label && <label className="form-label">{label}</label>
        }
        {
            child
        }
    </>
    )
}