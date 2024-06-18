import { ErrorMessage, useField } from "formik";
import React, { useCallback } from "react";
import InputLabel from "./InputLabel";

interface InputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  placeHolder?: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NumbersOnlyRegex = /[^0-9]/g;
export const TextOnlyRegex = /[^a-zA-Z]/g;
export const AlphaNumericRegex = /[^a-zA-Z0-9+]/g;

export const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  name,
  required,
  disabled,
  placeHolder,
  className,
  onChange,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      helpers.setValue(event.target.value);
      helpers.setTouched(true);
    },
    [helpers, onChange]
  );

  const handleBlur = useCallback(() => {
    helpers.setTouched(true);
  }, [helpers]);

  return (
    <div className="w-full mt-3 font-inter">
      <InputLabel name={name} label={label} required={required} />
      <input
        type={type}
        id={name}
        value={field.value}
        placeholder={placeHolder}
        disabled={disabled}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`text-sm font-roboto lg:text-base text-[#636363] block  w-full pl-3 pr-3 h-11 border border-[#B4B4B4] max-sm:h-8 max-sm:text-xs focus:ring-transparent rounded-md focus:outline-black  
           ${className}
          `}
      />
      <div className="p-1 text-left text-error text-xs">
        <ErrorMessage name={name} />
      </div>
    </div>
  );
};
