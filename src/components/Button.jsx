import React from 'react';

export default function Button({ children, className, ...props }) {
  return (
    <button
      className={`px-4 h-8 bg-gray-600 text-xs font-bold text-white hover:opacity-80 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
