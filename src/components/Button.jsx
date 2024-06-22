import React from 'react';

export default function Button({ children, className, ...props }) {
  return (
    <button
      className={`px-6 h-10 bg-gray-600 text-white hover:opacity-80 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
