import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", fullWidth = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const sizeStyles = {
      sm: "text-xs px-3 py-2 min-h-[38px] gap-1.5",
      md: "text-sm px-4 py-2.5 min-h-[44px] gap-2",
      lg: "text-base px-6 py-3.5 min-h-[48px] gap-2.5",
    };

    const variantStyles = {
      primary: "bg-[#3B82A0] hover:bg-[#2F6D87] text-white focus:ring-[#3B82A0]/40 shadow-sm shadow-[#3B82A0]/20",
      secondary: "bg-[#DCEFF5] hover:bg-[#cde5ee] text-[#1F2937] dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 focus:ring-[#3B82A0]/30",
      accent: "bg-[#F4A261] hover:bg-[#e7924e] text-white focus:ring-[#F4A261]/40 shadow-sm shadow-[#F4A261]/25",
      outline: "border border-[#E2E8F0] hover:border-[#3B82A0] text-[#1F2937] hover:text-[#3B82A0] bg-white dark:bg-slate-800/90 dark:border-slate-700 dark:text-slate-100 dark:hover:text-[#DCEFF5] focus:ring-[#3B82A0]/30",
      ghost: "text-[#64748B] hover:bg-[#DCEFF5]/60 hover:text-[#1F2937] dark:text-slate-200 dark:hover:bg-slate-800 focus:ring-gray-200",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400 shadow-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
