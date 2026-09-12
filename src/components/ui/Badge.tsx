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
    primary: "bg-[#0F4C81]/10 text-[#0F4C81] border border-[#0F4C81]/20 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30",
    accent: "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/50",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50",
    warning: "bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50",
    cyan: "bg-cyan-50 text-cyan-800 border border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/50",
    purple: "bg-purple-50 text-purple-800 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/50",
    neutral: "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
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
