import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "accent" | "success" | "warning" | "cyan" | "purple" | "neutral";
  size?: "sm" | "md";
}

export function Badge({
  className = "",
  variant = "primary",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "text-xs px-2.5 py-0.5",
    md: "text-xs sm:text-sm px-3 py-1",
  };

  const variantStyles = {
    primary: "bg-[#0F4C81]/10 text-[#0F4C81] border border-[#0F4C81]/20",
    accent: "bg-orange-50 text-orange-600 border border-orange-200",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    cyan: "bg-cyan-50 text-cyan-700 border border-cyan-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
    neutral: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
