import React from "react";

interface FilterIconProps {
  className?: string;
  size?: number;
  isActive?: boolean;
}

export const FilterIcon: React.FC<FilterIconProps> = ({
  className = "text-gray-500",
  size = 20,
  isActive = false,
}) => {
  return (
    <svg
      xmlns="w3.org"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isActive ? "white" : "none"}
      stroke={isActive ? "white" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
};
