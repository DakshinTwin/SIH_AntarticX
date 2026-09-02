'use client';

import React from 'react';

interface AntarcticaLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export default function AntarcticaLogo({
  className = '',
  size = 36,
  color = '#648BA8',
}: AntarcticaLogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 1000 700"
        width={size}
        height={size}
        className="w-full h-full object-contain"
      >
        <defs>
          <filter id="logo-invert">
            <feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0" />
          </filter>
          <mask id="logo-ant-mask">
            <image
              href="/antarctica-silhouette.jpg"
              width="1000"
              height="700"
              filter="url(#logo-invert)"
              preserveAspectRatio="xMidYMid meet"
            />
          </mask>
        </defs>
        {/* Background rect tinted to exact iceberg blue clipped to Antarctica silhouette */}
        <rect width="1000" height="700" fill={color} mask="url(#logo-ant-mask)" />
      </svg>
    </div>
  );
}
