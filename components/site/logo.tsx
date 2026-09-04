"use client";
import React, { useState } from "react";
import Link from "next/link";

export function CeramicLogoIcon({ 
  className = "w-10 h-10", 
  isWhite = false 
}: { 
  className?: string; 
  isWhite?: boolean 
}) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    const roofTeal = isWhite ? "#ffffff" : "#062524";
    const roofGold = "#c59b27";
    return (
      <svg
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path d="M50 8L8 42H22L50 20L78 42H92L50 8Z" fill={roofTeal} />
        <path d="M50 25L26 44H36L50 33L64 44H74L50 25Z" fill={roofGold} />
        <rect x="38" y="47" width="10" height="10" rx="1.5" fill={roofGold} />
        <rect x="52" y="47" width="10" height="10" rx="1.5" fill={roofGold} />
        <rect x="38" y="61" width="10" height="10" rx="1.5" fill={roofGold} />
        <rect x="52" y="61" width="10" height="10" rx="1.5" fill={roofGold} />
        <path d="M20 75H80" stroke={roofTeal} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full shadow-sm flex-shrink-0 bg-[#021211] ring-1 ring-[#c59b27]/30 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/app-icon.png"
        alt="Ceramic Bazaar Icon"
        className="w-full h-full object-cover select-none"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

export function Logo({
  size = "md",
  href = "/home",
  white = false,
  variant = "horizontal",
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  white?: boolean;
  variant?: "circular" | "horizontal";
  className?: string;
}) {
  const iconDimensions =
    size === "sm"
      ? "w-8 h-8"
      : size === "lg"
      ? "w-14 h-14"
      : size === "xl"
      ? "w-16 h-16"
      : "w-10 h-10 sm:w-11 sm:h-11";

  if (variant === "circular") {
    return (
      <Link href={href} className={`inline-flex items-center group no-tap-highlight select-none ${className}`}>
        <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
          <CeramicLogoIcon className={iconDimensions} isWhite={white} />
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={`inline-flex items-center gap-2.5 sm:gap-3 group no-tap-highlight select-none ${className}`}>
      <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <CeramicLogoIcon className={iconDimensions} isWhite={white} />
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`font-display font-black tracking-wider ${
            size === "sm" 
              ? "text-base" 
              : size === "lg" 
              ? "text-2xl sm:text-3xl" 
              : size === "xl" 
              ? "text-3xl sm:text-4xl" 
              : "text-lg sm:text-xl"
          } ${white ? "text-white" : "text-slate-900"}`}
        >
          CERAMIC
        </span>
        <span
          className={`font-display font-black tracking-widest text-[#c59b27] ${
            size === "sm" 
              ? "text-xs" 
              : size === "lg" 
              ? "text-lg sm:text-xl" 
              : size === "xl" 
              ? "text-xl sm:text-2xl" 
              : "text-sm sm:text-base"
          }`}
        >
          BAZAAR
        </span>
      </div>
    </Link>
  );
}



