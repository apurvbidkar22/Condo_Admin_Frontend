import { ErrorMessage, useField } from "formik";
import React, { useCallback } from "react";
import "./Checkbox.css"

interface CheckboxProps {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label = "",
  required,
  disabled,
  className,
  onChange,
}) => {
  const [field, meta] = useField(name);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      field.onChange(e);
      if (onChange) {
        onChange(e);
      }
    },
    [field, onChange]
  );

  return (
    <>
      <div className={className}>
          <input
            {...field}
            type="checkbox"
            disabled={disabled}
            checked={field.value}
            onChange={handleChange}
          />
          <span className="ml-2 text-gray-700 text-mini font-normal">
            {label}
            {required && <span className="text-error">*</span>}
          </span>
      </div>
      <ErrorMessage name={name} className="p-1 text-left text-error text-xs" />
    </>
  );
};
