import { usePopup } from "@/hooks/usePopup";
import { Option } from "@/models/Common";
import React, { ReactNode, useCallback, useRef } from "react";
import { ClickAwayListner } from "../ClickAwayListner";

interface Props {
  children: ReactNode;
  options: Option[];
  onClick: (val: string) => void;
}

export const HamburgurMenu: React.FC<Props> = (props) => {
  const { options, onClick, children } = props;
  const [visisble, showMenu, hideMenu] = usePopup();

  const toggleDropdown = useCallback(() => {
    if (visisble) {
      hideMenu();
    } else {
      showMenu();
    }
  }, [hideMenu, showMenu, visisble]);

  const handleClick = useCallback(
    (option: Option) => {
      onClick(option.value);
      hideMenu();
    },
    [hideMenu, onClick]
  );

  return (
    <ClickAwayListner onClose={hideMenu}>
      <div className="realtive">
        <div className="cursor-pointer" onClick={toggleDropdown}>
          {children}
        </div>
        <div
          className={`absolute h-auto py-1 bg-white rounded-md shadow-lg ${
            visisble ? "block z-40 " : "hidden"
          } `}
        >
          <ul>
            {options.map((option: Option, index) => {
              return (
                <li
                  key={index}
                  className="text-base font-inter block px-4 py-1 text-gray-800 hover:bg-hover cursor-pointer"
                  onClick={() => handleClick(option)}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </ClickAwayListner>
  );
};
