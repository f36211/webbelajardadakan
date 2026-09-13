import React from 'react';

export default function GoogleDriveIcon({ size = 16, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 87.3 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <path
        d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z"
        fill="#0066DA"
      />
      <path
        d="M43.65 25L29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L1.2 48.5c-.8 1.4-1.2 2.95-1.2 4.5h27.5L43.65 25z"
        fill="#00AC47"
      />
      <path
        d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 5.25-9.1c.8-1.4 1.2-2.95 1.2-4.5H57.4l6.35 11 9.8 8.65z"
        fill="#EA4335"
      />
      <path
        d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.4-4.5 1.2l13.75 23.8z"
        fill="#00832D"
      />
      <path
        d="M57.4 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.9c1.6 0 3.15-.4 4.5-1.2L57.4 53z"
        fill="#2684FC"
      />
      <path
        d="M86.1 48.5L60.7 4.5C59.9 3.1 58.75 2 57.4 1.2L43.65 25l13.75 28h27.5c0-1.55-.4-3.1-1.2-4.5z"
        fill="#FFBA00"
      />
    </svg>
  );
}
