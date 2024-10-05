import { ChangeEventHandler } from "react"

export type FileInputProps = {
    onChange: ChangeEventHandler<HTMLInputElement>
}

export function FileInput({ onChange }: FileInputProps) {
    return (
        <input className="form-control" type="file" onChange={onChange} />
    )
}