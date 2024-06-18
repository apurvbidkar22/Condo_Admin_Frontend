import { usePopup } from "@/hooks/usePopup";
import React, { useCallback, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ClickAwayListner } from "../ClickAwayListner";

interface Props {
  options: number[];
  onRowsPerPageChange: (val: number) => void;
}

export const RowPerPageDropdown: React.FC<Props> = (props) => {
  const { options, onRowsPerPageChange } = props;
  const [visible, showMenu, hideMenu] = usePopup();
  const [openUpwards, setOpenUpwards] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (option: number) => {
      onRowsPerPageChange(option);
      hideMenu();
    },
    [hideMenu, onRowsPerPageChange]
  );

  const toggleMenu = useCallback(() => {
    if (visible) {
      hideMenu();
    } else {
      showMenu();
    }
  }, [visible, showMenu, hideMenu]);

  useEffect(() => {
    const checkDropdownPosition = () => {
      const dropdownElement = dropdownRef.current;
      if (dropdownElement) {
        const rect = dropdownElement.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow < 150 && spaceAbove > spaceBelow) {
          setOpenUpwards(true);
        } else {
          setOpenUpwards(false);
        }
      }
    };

    if (visible) {
      checkDropdownPosition();
      window.addEventListener("resize", checkDropdownPosition);
    } else {
      window.removeEventListener("resize", checkDropdownPosition);
    }

    return () => {
      window.removeEventListener("resize", checkDropdownPosition);
    };
  }, [visible]);

  return (
    <ClickAwayListner onClose={hideMenu}>
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center">
          <Image
            src={
              process.env.NEXT_PUBLIC_ASSETS_URL +
              "icons/RowPerPageDropdown.svg"
            }
            height={16}
            width={16}
            alt="Row per page dropdown"
            onClick={toggleMenu}
            className={`iconButton ${visible ? "rotate-180" : ""}`}
          />
        </div>
        <div
          className={`absolute h-auto py-1 bg-white rounded-md shadow-lg ${
            visible ? "block z-40" : "hidden"
          } ${openUpwards ? "bottom-full mb-2" : "top-full mt-2"}`}
        >
          <ul>
            {options.map((option: number, index) => (
              <li
                key={index}
                className="text-base block px-4 py-1 text-gray-800 hover:bg-hover cursor-pointer"
                onClick={() => handleClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ClickAwayListner>
  );
};
