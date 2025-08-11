import React from 'react';

export const CartIcon = ({ size = 28, color = 'currentColor', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <g>
      <circle cx="14" cy="40" r="4" fill={color}/>
      <circle cx="36" cy="40" r="4" fill={color}/>
      <rect x="8" y="14" width="32" height="14" stroke={color} strokeWidth="3.5" fill="none"/>
      <path d="M8 14 L6 8 H4" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M40 14 L44 14" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <rect x="14" y="20" width="4" height="8" fill={color}/>
      <rect x="22" y="20" width="4" height="8" fill={color}/>
      <rect x="30" y="20" width="4" height="8" fill={color}/>
    </g>
  </svg>
);

export const HeartIcon = ({ size = 28, color = 'currentColor', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.1 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54l-1.35 1.31z" fill={color}/>
  </svg>
);
