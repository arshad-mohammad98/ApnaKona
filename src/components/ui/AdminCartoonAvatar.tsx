import React from "react";

interface AdminCartoonAvatarProps {
  size?: number;
  className?: string;
  showBadge?: boolean;
}

export default function AdminCartoonAvatar({
  size = 56,
  className = "",
  showBadge = true,
}: AdminCartoonAvatarProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        className="w-full h-full drop-shadow-xs transition-transform duration-150 hover:scale-[1.02]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Soft Sky + Mint Theme Gradients */}
          <radialGradient id="blueAdminBg" cx="50%" cy="42%" r="58%">
            <stop offset="0%" stopColor="#DCEFF5" />
            <stop offset="50%" stopColor="#5FA4BE" />
            <stop offset="100%" stopColor="#3B82A0" />
          </radialGradient>

          {/* Soft Sky Shirt Gradients */}
          <linearGradient id="blueShirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A93B2" />
            <stop offset="60%" stopColor="#3B82A0" />
            <stop offset="100%" stopColor="#25576D" />
          </linearGradient>

          <linearGradient id="blueCollarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5FA4BE" />
            <stop offset="100%" stopColor="#33728C" />
          </linearGradient>

          {/* Skin Gradient */}
          <linearGradient id="skinToneBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDDFC7" />
            <stop offset="100%" stopColor="#F5BE9E" />
          </linearGradient>

          {/* Hair Gradient */}
          <linearGradient id="darkHairBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#292524" />
            <stop offset="100%" stopColor="#1C1917" />
          </linearGradient>

          {/* Clip path for circular avatar */}
          <clipPath id="blueAvatarClip">
            <circle cx="60" cy="60" r="56" />
          </clipPath>
        </defs>

        {/* Clean Static Soft Sky Outer Circle Border */}
        <circle
          cx="60"
          cy="60"
          r="57.5"
          stroke="#3B82A0"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Avatar Interior */}
        <g clipPath="url(#blueAvatarClip)">
          {/* Bluish Background */}
          <circle cx="60" cy="60" r="56" fill="url(#blueAdminBg)" />

          {/* Inner concentric soft glow rings */}
          <circle cx="60" cy="60" r="46" stroke="#DDF3EA" strokeWidth="1" opacity="0.4" fill="none" />
          <circle cx="60" cy="60" r="36" stroke="#DDF3EA" strokeWidth="0.8" opacity="0.3" fill="none" />
          <circle cx="95" cy="40" r="14" fill="#FFFFFF" opacity="0.12" />

          {/* Collared Shirt Body */}
          <path
            d="M22 120 C22 93 38 85 60 85 C82 85 98 93 98 120 Z"
            fill="url(#blueShirtGrad)"
          />

          {/* Placket line and button */}
          <line x1="60" y1="92" x2="60" y2="120" stroke="#25576D" strokeWidth="2" />
          <circle cx="60" cy="98" r="1.5" fill="#DDF3EA" />
          <circle cx="60" cy="107" r="1.5" fill="#DDF3EA" />

          {/* Neck */}
          <rect x="52" y="69" width="16" height="19" rx="6" fill="url(#skinToneBlue)" />

          {/* Shirt Collars */}
          {/* Left Collar */}
          <polygon points="60,86 42,85 52,98" fill="url(#blueCollarGrad)" stroke="#25576D" strokeWidth="1" />
          {/* Right Collar */}
          <polygon points="60,86 78,85 68,98" fill="url(#blueCollarGrad)" stroke="#25576D" strokeWidth="1" />

          {/* Mint Lanyard Strap */}
          <path d="M47 85 L56 107" stroke="#DDF3EA" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M73 85 L64 107" stroke="#DDF3EA" strokeWidth="2.5" strokeLinecap="round" />

          {/* Admin ID Badge Card */}
          <rect x="49" y="106" width="22" height="15" rx="2.5" fill="#FFFFFF" stroke="#3B82A0" strokeWidth="1" />
          <rect x="52" y="108" width="16" height="3" rx="1" fill="#3B82A0" />
          <text x="60" y="116" textAnchor="middle" fill="#1F2937" fontSize="4.2" fontWeight="900" fontFamily="sans-serif">
            ADMIN
          </text>
          <circle cx="53" cy="116.5" r="1.2" fill="#F4A261" />

          {/* Head */}
          <ellipse cx="60" cy="51" rx="22" ry="24" fill="url(#skinToneBlue)" />

          {/* Ears */}
          <circle cx="38" cy="51" r="5" fill="url(#skinToneBlue)" />
          <circle cx="38" cy="51" r="2.2" fill="#E2A687" opacity="0.6" />
          <circle cx="82" cy="51" r="5" fill="url(#skinToneBlue)" />
          <circle cx="82" cy="51" r="2.2" fill="#E2A687" opacity="0.6" />

          {/* Soft Cheeks */}
          <ellipse cx="46.5" cy="56" rx="3.5" ry="2" fill="#F43F5E" opacity="0.3" />
          <ellipse cx="73.5" cy="56" rx="3.5" ry="2" fill="#F43F5E" opacity="0.3" />

          {/* Cheerful Mouth */}
          <path d="M53 59 C55 64 65 64 67 59 Z" fill="#991B1B" />
          <path d="M54.5 59.5 C56 61 64 61 65.5 59.5 Z" fill="#FFFFFF" />

          {/* Nose */}
          <ellipse cx="60" cy="53" rx="2.2" ry="1.6" fill="#DC8C6E" />

          {/* Eyes */}
          <circle cx="49" cy="47" r="4" fill="#1C1917" />
          <circle cx="47.6" cy="45.6" r="1.4" fill="#FFFFFF" />
          <circle cx="71" cy="47" r="4" fill="#1C1917" />
          <circle cx="69.6" cy="45.6" r="1.4" fill="#FFFFFF" />

          {/* Eyebrows */}
          <path d="M44 41 C47 38.5 51 39.5 53 41" stroke="#292524" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M76 41 C73 38.5 69 39.5 67 41" stroke="#292524" strokeWidth="2.2" strokeLinecap="round" />

          {/* Modern Glasses */}
          <rect x="41" y="40.5" width="16" height="13" rx="4.5" fill="none" stroke="#1F2937" strokeWidth="2.4" />
          <rect x="63" y="40.5" width="16" height="13" rx="4.5" fill="none" stroke="#1F2937" strokeWidth="2.4" />
          <path d="M57 46 C59 44.5 61 44.5 63 46" stroke="#1F2937" strokeWidth="2.2" fill="none" />
          <path d="M43 42.5 L47 42.5" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <path d="M65 42.5 L69 42.5" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

          {/* Clean Modern Dark Hair */}
          <path
            d="M38 42 C35 31 41 21 53 18 C58 15 66 15 72 19 C80 22 85 30 83 42 C79 33 73 31 68 34 C64 29 55 30 51 36 C47 35 42 37 38 42 Z"
            fill="url(#darkHairBlue)"
          />
          <path d="M50 23 C54 17 63 18 64 25 C67 21 72 23 71 28 Z" fill="#44403C" />
        </g>

        {/* Static Admin Corner Badge */}
        {showBadge && (
          <g transform="translate(86, 86)">
            <circle cx="14" cy="14" r="13" fill="#3B82A0" stroke="#FFFFFF" strokeWidth="2" />
            <path
              d="M10 17 L12 11 L14 14 L16 11 L18 17 Z"
              fill="#F4A261"
              stroke="#E08842"
              strokeWidth="0.6"
            />
            <circle cx="14" cy="10" r="1.2" fill="#FFFFFF" />
          </g>
        )}
      </svg>
    </div>
  );
}
