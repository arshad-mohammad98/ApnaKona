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
    primary: "bg-[#DCEFF5] text-[#164355] border border-[#3B82A0]/25 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/50 font-bold",
    accent: "bg-[#FEF7F1] text-[#9A460E] border border-[#F4A261]/30 dark:bg-orange-950/60 dark:text-orange-300 font-bold",
    success: "bg-[#DDF3EA] text-[#144D37] border border-[#A4DFCA] dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50 font-bold",
    warning: "bg-amber-50 text-amber-950 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50 font-bold",
    cyan: "bg-[#DCEFF5] text-[#164355] border border-[#BCE1EC] font-bold",
    purple: "bg-purple-50 text-purple-950 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/50 font-bold",
    neutral: "bg-slate-100 text-[#1E293B] border border-[#CBD5E1] dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 font-semibold",
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
