import React from "react";

export interface LogoProps {
  variant?: "full" | "icon" | "wordmark";
  size?: "sm" | "md" | "lg" | "xl" | number;
  theme?: "light" | "dark";
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  mono?: boolean;
}

const SIZE_MAP = {
  sm: { icon: 28, text: "text-lg", gap: "gap-2" },
  md: { icon: 36, text: "text-xl", gap: "gap-2.5" },
  lg: { icon: 44, text: "text-2xl", gap: "gap-3" },
  xl: { icon: 56, text: "text-3xl", gap: "gap-3.5" },
};

export default function Logo({
  variant = "full",
  size = "md",
  theme = "light",
  className = "",
  iconClassName = "",
  textClassName = "",
  mono = false,
}: LogoProps) {
  const sizeConfig = typeof size === "string" ? SIZE_MAP[size] : { icon: size, text: "text-xl", gap: "gap-2.5" };
  const iconPixelSize = sizeConfig.icon;

  // Colors
  const primaryColor = mono ? "currentColor" : "#0F4C81";
  const accentColor = mono ? "currentColor" : "#FF6B35";
  const textColorPrimary = theme === "dark" ? "text-white" : "text-[#1A1A2E]";
  const textColorAccent = "text-[#FF6B35]";

  // The Icon SVG: Modern geometric house silhouette with overlapping community roof & arched corner door
  const IconSVG = (
    <svg
      width={iconPixelSize}
      height={iconPixelSize}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${iconClassName}`}
      aria-hidden="true"
    >
      {/* Background Soft Badge / Tile */}
      <rect
        width="40"
        height="40"
        rx="12"
        fill={theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 76, 129, 0.06)"}
      />

      {/* Secondary / Overlapping Community Roof (Represents shared student housing / multiple rooms) */}
      <path
        d="M21 13.5L28.5 7.5L34 12V28C34 29.1046 33.1046 30 32 30H27"
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* Primary House Silhouette */}
      <path
        d="M6 18.5L18.25 8.2C18.6835 7.83582 19.3165 7.83582 19.75 8.2L27 14.3"
        stroke={primaryColor}
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Main House Base Walls */}
      <path
        d="M9 16.5V29C9 30.1046 9.89543 31 11 31H26C27.1046 31 28 30.1046 28 29V16"
        stroke={primaryColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* "Kona" (Arched Room / Keyhole Doorway Accent) */}
      <path
        d="M15.5 31V23C15.5 21.6193 16.6193 20.5 18 20.5H19C20.3807 20.5 21.5 21.6193 21.5 23V31"
        fill={accentColor}
        fillOpacity="0.18"
        stroke={accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Warm Community Hearth/Window Dot */}
      <circle cx="18.5" cy="15.5" r="1.75" fill={accentColor} />
    </svg>
  );

  // Wordmark Text
  const WordmarkText = (
    <span
      className={`font-display font-bold tracking-tight select-none ${sizeConfig.text} ${textClassName}`}
    >
      <span className={textColorPrimary}>Apna</span>
      <span className={textColorAccent}>Kona</span>
    </span>
  );

  if (variant === "icon") {
    return <div className={`inline-flex items-center justify-center ${className}`}>{IconSVG}</div>;
  }

  if (variant === "wordmark") {
    return <div className={`inline-flex items-center ${className}`}>{WordmarkText}</div>;
  }

  // Full Variant: Icon + Wordmark
  return (
    <div className={`inline-flex items-center ${sizeConfig.gap} ${className}`}>
      {IconSVG}
      {WordmarkText}
    </div>
  );
}
