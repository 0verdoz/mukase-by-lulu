import React from 'react';

interface SteamPotIconProps {
  className?: string;
  size?: number;
}

export const SteamPotIcon: React.FC<SteamPotIconProps> = ({ className = '', size = 44 }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Steam curls with subtle CSS keyframe float */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 pointer-events-none opacity-80">
        <span
          className="w-0.5 h-3 bg-gradient-to-t from-orange-400/80 to-transparent rounded-full animate-pulse"
          style={{ animationDuration: '2.4s', animationDelay: '0s' }}
        />
        <span
          className="w-0.5 h-4 bg-gradient-to-t from-amber-400/80 to-transparent rounded-full animate-pulse"
          style={{ animationDuration: '1.9s', animationDelay: '0.4s' }}
        />
        <span
          className="w-0.5 h-3 bg-gradient-to-t from-orange-400/80 to-transparent rounded-full animate-pulse"
          style={{ animationDuration: '2.7s', animationDelay: '0.8s' }}
        />
      </div>

      {/* Handcrafted Culinary Pot SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        {/* Pot handles */}
        <path
          d="M6 22C4 22 2.5 24 2.5 26.5C2.5 29 4 31 6 31"
          stroke="#9a3412"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M42 22C44 22 45.5 24 45.5 26.5C45.5 29 44 31 42 31"
          stroke="#9a3412"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Pot Lid Handle Knob */}
        <ellipse cx="24" cy="12" rx="3.5" ry="2" fill="#c2410c" stroke="#7c2d12" strokeWidth="1.5" />
        
        {/* Pot Lid */}
        <path
          d="M8 18C12 15 20 14 24 14C28 14 36 15 40 18"
          stroke="#ea580c"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Pot Body (Traditional Asanka / Heavy cooking cauldron) */}
        <path
          d="M8 19H40V28C40 36 33 42 24 42C15 42 8 36 8 28V19Z"
          fill="#fff7ed"
          stroke="#c2410c"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Terracotta Pot Accent Ring */}
        <path
          d="M8 24C12 26 20 27 24 27C28 27 36 26 40 24"
          stroke="#ea580c"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />

        {/* Warm Ember Core */}
        <circle cx="24" cy="33" r="3.5" fill="#ea580c" opacity="0.85" />
      </svg>
    </div>
  );
};
