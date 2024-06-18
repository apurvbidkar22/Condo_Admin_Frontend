import { useField,ErrorMessage } from "formik";
import React, { useCallback } from "react";
import InputLabel from "../input/InputLabel";

interface InputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  placeHolder?: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextArea: React.FC<InputProps> = ({
  label,
  name,
  required,
  disabled,
  placeHolder,
  className,
  onChange,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    <div className="w-full mt-3 ">
      <InputLabel name={name} label={label} required={required} />
      <textarea
        id={name}
        value={field.value}
        placeholder={placeHolder}
        disabled={disabled}
        onChange={handleChange}
        rows={5}
        onBlur={handleBlur}
        className={`text-sm lg:text-base text-[#636363] block w-full pl-3 pr-3 border border-[#B4B4B4] focus:ring-transparent rounded-md focus:outline-black  
           ${className}
          `}
      />
    <div className="p-1 text-left text-error text-xs">
        <ErrorMessage name={name} />
      </div>
    </div>
  );
};
