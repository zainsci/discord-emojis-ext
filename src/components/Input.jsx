import React from 'react';

export default function Input({
  value,
  setValue,
  className,
  innerRef,
  ...props
}) {
  return (
    <input
      value={value}
      onChange={setValue}
      className={`px-4 py-0 text-white text-base h-10 border-transparent bg-gray-800 rounded-md active:outline-none focus:outline-none focus:ring-4 ring-gray-600 ${className}`}
      autoComplete="off"
      ref={innerRef}
      {...props}
    />
  );
}
