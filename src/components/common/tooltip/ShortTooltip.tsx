import React from "react";
import { Tooltip } from "./Tooltip";

interface Props {
  text?: string;
  length: number;
  direction?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export const ShortTooltip: React.FC<Props> = ({
  text,
  length,
  className,
  direction,
}) => {
  const textLength = text?.length;
  return (
    <Tooltip
      content={textLength && textLength > length ? text : ""}
      direction={direction}
    >
      <div className={className}>
        {textLength && textLength > length
          ? `${text?.slice(0, length)}...`
          : text}
      </div>
    </Tooltip>
  );
};
