import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Loader } from "../loader/Loader";
import { useField, useFormikContext } from "formik";
import { MediaFilters } from "@/models/BuildingMediaModel";

interface Props {
  name: string;
  options?: string[];
  required?: boolean;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const AutoComplete: React.FC<Props> = ({
  name,
  options = [],
  label,
  disabled,
  loading,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [field, meta, helpers] = useField<string>(name);
  const [inputValue, setInputValue] = useState(field.value);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const { setValues, values } = useFormikContext<MediaFilters>();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    setFilteredOptions(options);
  };

  const handleSelect = useCallback(
    (option: string) => {
      helpers.setValue(option);
      setInputValue(option);
      setIsOpen(false);
      const filters: MediaFilters = { ...values, [name]: option };
      switch (name) {
        case "state":
          filters.metro = undefined;
          filters.county = undefined;
          filters.city = undefined;
          filters.zip = undefined;
          filters.neighbourhood = undefined;
          filters.name = undefined;
          break;
        case "metro":
          filters.county = undefined;
          filters.city = undefined;
          filters.zip = undefined;
          filters.neighbourhood = undefined;
          filters.name = undefined;
          break;
        case "county":
          filters.city = undefined;
          filters.zip = undefined;
          filters.neighbourhood = undefined;
          filters.name = undefined;
          break;
        case "city":
          filters.zip = undefined;
          filters.neighbourhood = undefined;
          filters.name = undefined;
          break;
        case "zip":
          filters.neighbourhood = undefined;
          filters.name = undefined;
          break;
        case "neighbourhood":
          filters.name = undefined;
          break;
        default:
          break;
      }
      setValues(filters);
    },
    [helpers, name, values, setValues]
  );

  useEffect(() => {
    if (!field.value) {
      setInputValue(field.value);
    }
  }, [field.value]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
      setIsOpen(true);
    },
    [options]
  );

  useEffect(() => {
    if (!options) setFilteredOptions(options);
  }, [options]);

  return (
    <div ref={dropdownRef} className={`relative ${isOpen ? "z-20" : ""}`}>
      <div className="w-full" aria-expanded={isOpen}>
        <label htmlFor={name} className="sr-only">
          {label}
        </label>
        <input
          type="text"
          id={name}
          className={`text-sm bg-white border border-[#CBCBCB] focus:outline-black rounded-md pl-2 py-2 pr-5 text-gray-700 relative w-full h-9 text-left`}
          name={name}
          onClick={toggleDropdown}
          placeholder={label}
          disabled={disabled}
          value={inputValue || ""}
          onChange={handleChange}
          aria-autocomplete="list"
          aria-controls={`${name}-listbox`}
          aria-activedescendant={isOpen ? `${name}-option-0` : undefined}
        />
        {loading ? (
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
            <Loader className="!border-black !h-4 !w-4" />
          </div>
        ) : (
          <img
            src={
              isOpen
                ? process.env.NEXT_PUBLIC_ASSETS_URL + "icons/UpArrowIcon.svg"
                : process.env.NEXT_PUBLIC_ASSETS_URL + "icons/DownArrowIcon.svg"
            }
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 h-3 w-3"
            alt="searchIcon"
          />
        )}
      </div>
      {isOpen && (
        <ul
          id={`${name}-listbox`}
          className="absolute max-h-52 w-64 overflow-y-auto overflow-x-hidden py-1 bg-white rounded-md shadow-lg"
          role="listbox"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                id={`${name}-option-${index}`}
                className="text-base block px-4 py-2 text-gray-800 hover:bg-hover cursor-pointer"
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={option === field.value}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="text-base block px-4 py-2 text-gray-800">
              No options
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
