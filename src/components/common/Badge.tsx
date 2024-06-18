import React from "react";

const Variant = {
  success: "#8AE288",
  error: "#DC4E4E",
};

interface BadgeProps {
  text: string;
  type: "success" | "error";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, type, className }) => {
  return (
    <div>
      <div className={`inline-block bg-[${Variant[type]}] rounded-md`}>
        <div
          className={`${className} text-sm text-white flex justify-center items-center px-4 py-1`}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
