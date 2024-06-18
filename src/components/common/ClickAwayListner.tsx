"use client"
import React, { Fragment, ReactNode, useEffect, useRef } from "react";

interface Props {
  onClose: () => void;
  children: ReactNode;
}

export const ClickAwayListner: React.FC<Props> = ({ onClose, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  return <div ref={ref}>{children}</div>;
};
