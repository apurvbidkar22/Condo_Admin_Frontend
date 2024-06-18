import React from "react";

interface Props {
  value: number;
  size: number;
  width?: number;
  color: string;
}

export const CircularProgress: React.FC<Props> = ({
  value,
  color,
  size,
  width = 10,
}) => {
  const r = size / 2 - width / 2;
  const circ = 2 * Math.PI * r;
  const strokePct = value === 0 ? circ : ((100 - value) * circ) / 100;

  return (
    <svg width={size} height={size}>
      <circle
        r={r}
        cx={size / 2}
        cy={size / 2}
        fill="transparent"
        stroke="#F5F5F5"
        strokeWidth={width}
        strokeLinecap="square"
      />
      <circle
        r={r}
        cx={size / 2}
        cy={size / 2}
        fill="transparent"
        stroke={color}
        strokeWidth={width}
        strokeDasharray={circ}
        strokeDashoffset={strokePct}
        strokeLinecap="square"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="20px"
        fontWeight={700}
        fill="black"
      >
        {value}%
      </text>
    </svg>
  );
};
