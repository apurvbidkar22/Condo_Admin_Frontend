import { usePopup } from "@/hooks/usePopup";
import { ReactNode } from "react";

export interface TooltipProps {
  children?: ReactNode;
  content: string;
  direction?: "top" | "right" | "bottom" | "left";
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  direction = "bottom",
  children,
}) => {
  const [visible, showTooltip, hideTooltip] = usePopup();

  const getTooltipClass = () => {
    let tooltipClass = `absolute p-2 z-50 transition-all text-md rounded-md bg-hover group-hover:scale-100`;
    switch (direction) {
      case "top":
        tooltipClass += " bottom-8 left-1/2 transform -translate-x-1/2";
        break;
      case "right":
        tooltipClass += " bottom-1/2 left-7 transform translate-y-1/2";
        break;
      case "bottom":
        tooltipClass += " top-5 left-1/2 transform -translate-x-1/2";
        break;
      case "left":
        tooltipClass += ` top-1/2 ${
          content.length >= 10 ? "right-8" : "right-10"
        } transform -translate-y-1/2`;
        break;
      default:
        break;
    }
    return tooltipClass;
  };

  return (
    <div
      className="group relative"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visible && content && (
        <div className={getTooltipClass()}>
          <div>{content}</div>
        </div>
      )}
    </div>
  );
};
