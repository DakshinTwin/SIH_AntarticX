'use client';

import React from 'react';

export default function AntarcticaVector({
  size = 36,
  color = '#648BA8',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
      fill={color}
    >
      {/* Accurate vector silhouette of Antarctica with Antarctic Peninsula, Ross Ice Shelf, Ronne Ice Shelf, East & West Antarctica */}
      <path
        d="M28,12 C29,8 33,6 36,9 C39,12 37,17 34,22 C31,27 28,32 26,38 C23,43 19,48 16,53 C14,57 11,63 13,67 C15,70 19,69 22,66 C25,62 27,57 30,52 C33,48 37,45 41,47 C44,49 43,54 41,58 C38,64 33,69 35,76 C37,82 43,85 49,87 C55,89 62,88 68,85 C75,82 81,77 86,70 C90,64 92,56 91,48 C90,40 85,34 79,29 C73,24 66,22 59,20 C52,18 45,19 39,17 C35,15 31,14 28,12 Z
           M22,35 C20,34 18,36 17,39 C16,42 19,44 21,43 C23,41 24,37 22,35 Z
           M14,60 C12,62 13,66 15,66 C17,66 18,62 16,60 Z"
      />
    </svg>
  );
}
