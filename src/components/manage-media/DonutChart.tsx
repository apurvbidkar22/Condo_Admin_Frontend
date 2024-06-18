import React, { useState, useEffect, useMemo } from "react";

export interface MediaItem {
  color: string;
  label?: string;
  value: number;
  path?: string | undefined;
}

interface DonutChartProps {
  width: number;
  height: number;
  items: MediaItem[];
  innerRadius: number;
  outerRadius: number;
  total: number;
}

const PROGRESS_UNIT = 0.01;
const PROGRESS_TIMEOUT = 5;

const getArcPath = (
  start: number,
  end: number,
  innerRadius: number,
  outerRadius: number
): string => {
  const startAngle = start * Math.PI * 2;
  const endAngle = end * Math.PI * 2;
  const x1 = innerRadius * Math.sin(startAngle);
  const y1 = innerRadius * -Math.cos(startAngle);
  const x2 = outerRadius * Math.sin(startAngle);
  const y2 = outerRadius * -Math.cos(startAngle);
  const x3 = outerRadius * Math.sin(endAngle);
  const y3 = outerRadius * -Math.cos(endAngle);
  const x4 = innerRadius * Math.sin(endAngle);
  const y4 = innerRadius * -Math.cos(endAngle);
  const bigArc = end - start >= 0.5;
  const outerFlags = bigArc ? "1 1 1" : "0 0 1";
  const innerFlags = bigArc ? "1 1 0" : "1 0 0";
  return `M ${x1},${y1} L ${x2},${y2} A ${outerRadius} ${outerRadius} ${outerFlags} ${x3},${y3} 
        L ${x4},${y4} A ${innerRadius} ${innerRadius} ${innerFlags} ${x1},${y1} Z`;
};

export const DonutChart: React.FC<DonutChartProps> = ({
  width,
  height,
  items,
  innerRadius,
  outerRadius,
  total,
}) => {
  const [visiblePart, setVisiblePart] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (visiblePart < 1) {
        setVisiblePart(visiblePart + PROGRESS_UNIT);
      }
    }, PROGRESS_TIMEOUT);

    return () => clearTimeout(timeout);
  }, [visiblePart]);

  const calculateSegments = (): MediaItem[] => {
    const sum = items.reduce((acc, item) => acc + item.value, 0);
    let start = 0;
    return items.map((item) => {
      const delta = (item.value / sum) * visiblePart;
      const path = getArcPath(start, start + delta, innerRadius, outerRadius);
      start += delta;
      return { ...item, path };
    });
  };

  const segments = useMemo(calculateSegments, [
    items,
    innerRadius,
    outerRadius,
    visiblePart,
  ]);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2},${height / 2})`}>
        {segments.map((segment, index) => (
          <path
            key={index}
            stroke={segment.color}
            fill={segment.color}
            d={segment.path}
          />
        ))}
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="28px"
          fontWeight={700}
          fill="black"
        >
          {total ?? 0}%
        </text>
      </g>
    </svg>
  );
};
