import { useId } from 'react'

export type InputFieldLabelProps = {
  label?: string
}

export type InputFieldProps = InputFieldLabelProps & {
  type: string
  className: string
  value?: string | number // Add optional value prop
  onChange?: React.ChangeEventHandler<HTMLInputElement> // Add optional onChange prop
  step?: string // Add optional step prop for numerical inputs
}

export function InputField({ type, label, className, value, onChange, step }: InputFieldProps) {
  const fieldId = 'input-field-' + useId()
  return (
    <>
      {label && (
        <label htmlFor={fieldId} className="form-label">
          {label}
        </label>
      )}
      <input
        type={type}
        className={className}
        id={fieldId}
        value={value} // Use the value prop
        onChange={onChange} // Use the onChange prop
        step={step} // Use the step prop for inputs like 'number'
      />
    </>
  )
}
