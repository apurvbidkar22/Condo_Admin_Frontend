import Image from "next/image";
import { useCallback, useState } from "react";

interface AccordionProps {
  title: string | JSX.Element;
  disabled?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  disabled,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <div className="w-full">
      <div className="h-12 rounded-lg flex justify-start items-center font-inter relative transition-all duration-300">
        <div className="text-sm w-full">{title}</div>
        {!disabled && (
          <Image
            height={14}
            width={14}
            src={process.env.NEXT_PUBLIC_ASSETS_URL + "icons/DownArrowIcon.svg"}
            className={`absolute left-0 transition-transform transform cursor-pointer ${
              isOpen ? "rotate-180" : ""
            }`}
            alt="searchIcon"
            onClick={toggleAccordion}
          />
        )}
      </div>
      {!disabled && (
        <div
          className={`text-black text-lg font-normal transition-all duration-300 shadow-lg ${
            isOpen ? "max-h-full opacity-100 mt-0" : "max-h-12 opacity-0"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
