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
      primary: "bg-[#0F4C81] hover:bg-[#0d3f6e] text-white focus:ring-[#0F4C81]/40 shadow-sm",
      secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 focus:ring-gray-300",
      accent: "bg-[#FF6B35] hover:bg-[#e85a22] text-white focus:ring-[#FF6B35]/40 shadow-sm shadow-orange-500/20",
      outline: "border border-gray-200 hover:border-[#0F4C81] text-gray-800 hover:text-[#0F4C81] bg-white dark:bg-slate-800/90 dark:border-slate-700 dark:text-slate-100 dark:hover:text-sky-300 dark:hover:border-sky-500/50 focus:ring-[#0F4C81]/30",
      ghost: "text-gray-700 hover:bg-gray-100 hover:text-[#0F4C81] dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-sky-300 focus:ring-gray-200",
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
