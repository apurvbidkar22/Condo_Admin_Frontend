import React, { useCallback, useState } from "react";
import { useField, ErrorMessage } from "formik";
import InputLabel from "../input/InputLabel";
import { Option } from "@/models/Common";
import Image from "next/image";

interface DropdownProps {
  name: string;
  options?: Option[];
  required?: boolean;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (selectedOption: Option) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  name,
  options = [],
  required,
  label,
  disabled,
  placeholder,
  className,
  onChange,
}) => {
  const [field, meta, helpers] = useField(name);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = useCallback(
    (option: Option) => {
      helpers.setValue(option.value);
      setIsOpen(false);
      onChange?.(option || { value: "", label: "" });
    },
    [helpers, onChange]
  );

  const handleToggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className="w-full mt-3">
      <InputLabel name={name} label={label} required={required} />
      <div className={`relative ${isOpen ? "z-20" : ""}`}>
        <div
          className={`text-sm lg:text-base text-[#636363] w-full pl-3 pr-3 h-11 border border-[#B4B4B4]
          focus:ring-transparent rounded-md hover:outline-primary flex justify-start items-center
           ${className}
          `}
          onClick={handleToggleDropdown}
        >
          {field.value
            ? options.find((option) => option.value === field.value)?.label ||
              placeholder
            : placeholder}
        </div>
        <Image
          height={12}
          width={12}
          src={
            isOpen
              ? process.env.NEXT_PUBLIC_ASSETS_URL + "icons/UpArrowIcon.svg"
              : process.env.NEXT_PUBLIC_ASSETS_URL + "icons/DownArrowIcon.svg"
          }
          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
          alt="searchIcon"
        />
        <div
          className={`absolute max-h-52 w-full overflow-y-auto py-1 bg-white rounded-md shadow-lg transition-all duration-200 ${
            isOpen ? "block" : "hidden"
          } `}
        >
          {options.length > 0 ? (
            options.map((option, index) => (
              <div
                key={index}
                className="text-sm block px-4 py-2 text-gray-800 hover:bg-hover cursor-pointer "
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="text-sm block px-4 py-2 text-gray-800 hover:bg-blue-200">
              No options
            </div>
          )}
        </div>
      </div>
      <div className="p-1 text-left text-error text-xs">
        <ErrorMessage name={name} />
      </div>
    </div>
  );
};
