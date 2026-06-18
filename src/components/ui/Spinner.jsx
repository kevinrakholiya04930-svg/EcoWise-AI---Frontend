import React from 'react';

export const Spinner = ({
  size = 'md',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-transparent border-accent-green ${sizes[size]} ${className}`}
      {...props}
    />
  );
};
